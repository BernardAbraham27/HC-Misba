using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Products;
using GodGraceHomeProducts.Application.Helpers;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GodGraceHomeProducts.Application.Services;

public class ProductService(IAppDbContext db) : IProductService
{
    public async Task<PagedResult<ProductResponseDto>> GetProductsAsync(ProductListQueryDto query)
    {
        var q = db.Products.Include(x => x.Brand).ThenInclude(x => x.BrandType).Include(x => x.Category).Include(x => x.ProductSizeMaster).Include(x => x.ProductStatus).Include(x => x.Sizes).Include(x => x.Benefits)
            .Where(x => x.IsActive && !x.IsDeleted).AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLowerInvariant();
            q = q.Where(x =>
                x.Name.ToLower().Contains(search) ||
                (x.Brand != null && x.Brand.Name.ToLower().Contains(search)) ||
                (x.Category != null && x.Category.Name.ToLower().Contains(search)));
        }

        if (query.BrandId.HasValue) q = q.Where(x => x.BrandId == query.BrandId);
        if (!string.IsNullOrWhiteSpace(query.BrandSlug))
        {
            var brandSlug = query.BrandSlug.Trim().ToLowerInvariant();
            q = q.Where(x => x.Brand != null && x.Brand.Slug.ToLower() == brandSlug);
        }

        if (query.IsOwnBrand.HasValue) q = q.Where(x => x.Brand != null && x.Brand.IsOwnBrand == query.IsOwnBrand.Value);
        if (query.CategoryId.HasValue) q = q.Where(x => x.CategoryId == query.CategoryId);
        if (query.MinPrice.HasValue) q = q.Where(x => (x.DiscountPrice ?? x.Price) >= query.MinPrice.Value);
        if (query.MaxPrice.HasValue) q = q.Where(x => (x.DiscountPrice ?? x.Price) <= query.MaxPrice.Value);

        q = query.SortBy?.ToLowerInvariant() switch
        {
            "price-low-to-high" => q.OrderBy(x => x.DiscountPrice ?? x.Price),
            "price-high-to-low" => q.OrderByDescending(x => x.DiscountPrice ?? x.Price),
            _ => q.OrderByDescending(x => x.CreatedAt)
        };

        var total = await q.CountAsync();
        var items = await q.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToListAsync();

        return new PagedResult<ProductResponseDto>
        {
            Items = items.Select(Map).ToList(),
            PageNumber = query.PageNumber,
            PageSize = query.PageSize,
            TotalCount = total
        };
    }

    public async Task<ProductResponseDto> GetByIdAsync(int id)
        => Map(await QueryBase().FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Product not found."));

    public async Task<ProductResponseDto> GetBySlugAsync(string slug)
        => Map(await QueryBase().FirstOrDefaultAsync(x => x.Slug == slug) ?? throw new KeyNotFoundException("Product not found."));

    public async Task<IReadOnlyCollection<ProductResponseDto>> GetByCategoryAsync(int categoryId)
        => (await QueryBase().Where(x => x.CategoryId == categoryId).ToListAsync()).Select(Map).ToList();

    public async Task<IReadOnlyCollection<ProductResponseDto>> GetBestSellersAsync()
        => (await QueryBase().Where(x => x.IsBestSeller).ToListAsync()).Select(Map).ToList();

    public async Task<IReadOnlyCollection<ProductResponseDto>> GetNewArrivalsAsync()
        => (await QueryBase().Where(x => x.IsNewArrival).ToListAsync()).Select(Map).ToList();

    public async Task<ProductResponseDto> CreateAsync(ProductRequestDto request)
    {
        await EnsureCategoryAsync(request.CategoryId);
        await EnsureBrandAsync(request.BrandId);
        var productSizeId = await ResolveProductSizeIdAsync(request);
        var productStatusId = await ResolveProductStatusIdAsync(request);
        var entity = new Product
        {
            Name = request.Name.Trim(),
            Slug = await UniqueSlugAsync(request.Name.Trim()),
            BrandId = request.BrandId,
            CategoryId = request.CategoryId,
            ProductSizeMasterId = productSizeId,
            ProductStatusId = productStatusId,
            ShortDescription = request.ShortDescription.Trim(),
            Description = request.Description.Trim(),
            Price = request.Price,
            DiscountPrice = request.DiscountPrice,
            StockQuantity = request.StockQuantity,
            ImageUrl = request.ImageUrl.Trim(),
            Rating = request.Rating,
            IsBestSeller = request.IsBestSeller,
            IsNewArrival = request.IsNewArrival,
            IsActive = request.IsActive,
            HowToUse = request.HowToUse.Trim(),
            SafetyInstructions = request.SafetyInstructions.Trim(),
            Sizes = request.Sizes.Select(x => new ProductSize { Size = x.Trim() }).ToList(),
            Benefits = request.Benefits.Select(x => new ProductBenefit { Benefit = x.Trim() }).ToList()
        };
        db.Products.Add(entity);
        await db.SaveChangesAsync();
        return await GetByIdAsync(entity.Id);
    }

    public async Task<ProductResponseDto> UpdateAsync(int id, ProductRequestDto request)
    {
        var entity = await db.Products.Include(x => x.Sizes).Include(x => x.Benefits).FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted)
            ?? throw new KeyNotFoundException("Product not found.");
        await EnsureCategoryAsync(request.CategoryId);
        await EnsureBrandAsync(request.BrandId);

        entity.Name = request.Name.Trim();
        entity.Slug = await UniqueSlugAsync(entity.Name, id);
        entity.BrandId = request.BrandId;
        entity.CategoryId = request.CategoryId;
        entity.ProductSizeMasterId = await ResolveProductSizeIdAsync(request);
        entity.ProductStatusId = await ResolveProductStatusIdAsync(request);
        entity.ShortDescription = request.ShortDescription.Trim();
        entity.Description = request.Description.Trim();
        entity.Price = request.Price;
        entity.DiscountPrice = request.DiscountPrice;
        entity.StockQuantity = request.StockQuantity;
        entity.ImageUrl = request.ImageUrl.Trim();
        entity.Rating = request.Rating;
        entity.IsBestSeller = request.IsBestSeller;
        entity.IsNewArrival = request.IsNewArrival;
        entity.IsActive = request.IsActive;
        entity.HowToUse = request.HowToUse.Trim();
        entity.SafetyInstructions = request.SafetyInstructions.Trim();
        entity.UpdatedAt = DateTime.UtcNow;
        db.ProductSizes.RemoveRange(entity.Sizes);
        db.ProductBenefits.RemoveRange(entity.Benefits);
        entity.Sizes = request.Sizes.Select(x => new ProductSize { Size = x.Trim() }).ToList();
        entity.Benefits = request.Benefits.Select(x => new ProductBenefit { Benefit = x.Trim() }).ToList();
        await db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await db.Products.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted)
            ?? throw new KeyNotFoundException("Product not found.");
        entity.IsDeleted = true;
        entity.IsActive = false;
        entity.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    private IQueryable<Product> QueryBase() => db.Products.Include(x => x.Brand).ThenInclude(x => x.BrandType).Include(x => x.Category).Include(x => x.ProductSizeMaster).Include(x => x.ProductStatus).Include(x => x.Sizes).Include(x => x.Benefits)
        .Where(x => x.IsActive && !x.IsDeleted);

    private async Task EnsureCategoryAsync(int categoryId)
    {
        if (!await db.Categories.AnyAsync(x => x.Id == categoryId && x.IsActive && !x.IsDeleted))
            throw new InvalidOperationException("Selected category does not exist.");
    }

    private async Task EnsureBrandAsync(int brandId)
    {
        if (!await db.Brands.AnyAsync(x => x.Id == brandId && x.IsActive))
            throw new InvalidOperationException("Selected brand does not exist.");
    }

    private async Task<int?> ResolveProductSizeIdAsync(ProductRequestDto request)
    {
        if (request.SizeId.HasValue)
        {
            return request.SizeId.Value;
        }

        var sizeName = request.Sizes.FirstOrDefault();
        if (string.IsNullOrWhiteSpace(sizeName))
        {
            return null;
        }

        return await db.ProductSizeMasters
            .Where(x => x.Name.ToLower() == sizeName.Trim().ToLower())
            .Select(x => (int?)x.Id)
            .FirstOrDefaultAsync();
    }

    private async Task<int?> ResolveProductStatusIdAsync(ProductRequestDto request)
    {
        if (request.ProductStatusId.HasValue)
        {
            return request.ProductStatusId.Value;
        }

        var code = request.IsActive ? "ACTIVE" : "INACTIVE";
        return await db.ProductStatuses.Where(x => x.Code == code).Select(x => (int?)x.Id).FirstOrDefaultAsync();
    }

    private async Task<string> UniqueSlugAsync(string name, int? id = null)
    {
        var baseSlug = SlugHelper.Generate(name);
        var slug = baseSlug;
        var index = 1;
        while (await db.Products.AnyAsync(x => x.Slug == slug && (!id.HasValue || x.Id != id.Value)))
            slug = $"{baseSlug}-{index++}";
        return slug;
    }

    private static ProductResponseDto Map(Product x) => new()
    {
        Id = x.Id,
        Name = x.Name,
        Slug = x.Slug,
        BrandId = x.BrandId,
        BrandName = x.Brand?.Name ?? string.Empty,
        BrandSlug = x.Brand?.Slug ?? string.Empty,
        BrandTypeId = x.Brand?.BrandTypeId ?? 0,
        BrandTypeName = x.Brand?.BrandType?.Name ?? string.Empty,
        IsOwnBrand = x.Brand?.IsOwnBrand ?? false,
        CategoryId = x.CategoryId,
        CategoryName = x.Category?.Name ?? string.Empty,
        SizeId = x.ProductSizeMasterId,
        SizeName = x.ProductSizeMaster?.Name ?? x.Sizes.Select(s => s.Size).FirstOrDefault() ?? string.Empty,
        ProductStatusId = x.ProductStatusId,
        ProductStatusName = x.ProductStatus?.Name ?? (x.IsActive ? "Active" : "Inactive"),
        ShortDescription = x.ShortDescription,
        Description = x.Description,
        Price = x.Price,
        DiscountPrice = x.DiscountPrice,
        StockQuantity = x.StockQuantity,
        ImageUrl = x.ImageUrl,
        Rating = x.Rating,
        IsBestSeller = x.IsBestSeller,
        IsNewArrival = x.IsNewArrival,
        IsActive = x.IsActive,
        Sizes = x.Sizes.Select(s => s.Size).ToList(),
        Benefits = x.Benefits.Select(b => b.Benefit).ToList(),
        HowToUse = x.HowToUse,
        SafetyInstructions = x.SafetyInstructions,
        CreatedAt = x.CreatedAt,
        UpdatedAt = x.UpdatedAt
    };
}
