using GodGraceHomeProducts.Application.DTOs.Brands;
using GodGraceHomeProducts.Application.Helpers;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GodGraceHomeProducts.Application.Services;

public class BrandService(IAppDbContext db) : IBrandService
{
    public async Task<IReadOnlyCollection<BrandResponseDto>> GetAllAsync()
        => (await QueryBase().OrderBy(x => x.Name).ToListAsync()).Select(Map).ToList();

    public async Task<BrandResponseDto> GetByIdAsync(int id)
    {
        var entity = await QueryBase().FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new KeyNotFoundException("Brand not found.");
        return Map(entity);
    }

    public async Task<BrandResponseDto> GetBySlugAsync(string slug)
    {
        var entity = await QueryBase().FirstOrDefaultAsync(x => x.Slug == slug)
            ?? throw new KeyNotFoundException("Brand not found.");
        return Map(entity);
    }

    public async Task<BrandResponseDto> CreateAsync(BrandRequestDto request)
    {
        var brand = new Brand
        {
            Name = request.Name.Trim(),
            Code = string.IsNullOrWhiteSpace(request.Code) ? SlugHelper.Generate(request.Name).Replace("-", "_").ToUpperInvariant() : request.Code.Trim().Replace(" ", "_").ToUpperInvariant(),
            Slug = await UniqueSlugAsync(request.Name, request.Slug),
            BrandTypeId = request.BrandTypeId ?? (request.IsOwnBrand ? 1 : 3),
            LogoUrl = request.LogoUrl?.Trim(),
            Description = request.Description.Trim(),
            IsOwnBrand = (request.BrandTypeId ?? (request.IsOwnBrand ? 1 : 3)) == 1,
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive
        };

        db.Brands.Add(brand);
        await db.SaveChangesAsync();
        return await GetByIdAsync(brand.Id);
    }

    public async Task<BrandResponseDto> UpdateAsync(int id, BrandRequestDto request)
    {
        var brand = await db.Brands.Include(x => x.Products).FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new KeyNotFoundException("Brand not found.");

        brand.Name = request.Name.Trim();
        brand.Code = string.IsNullOrWhiteSpace(request.Code) ? SlugHelper.Generate(request.Name).Replace("-", "_").ToUpperInvariant() : request.Code.Trim().Replace(" ", "_").ToUpperInvariant();
        brand.Slug = await UniqueSlugAsync(request.Name, request.Slug, id);
        brand.BrandTypeId = request.BrandTypeId ?? (request.IsOwnBrand ? 1 : brand.BrandTypeId);
        brand.LogoUrl = request.LogoUrl?.Trim();
        brand.Description = request.Description.Trim();
        brand.IsOwnBrand = brand.BrandTypeId == 1;
        brand.DisplayOrder = request.DisplayOrder;
        brand.IsActive = request.IsActive;
        brand.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task DeleteAsync(int id)
    {
        var brand = await db.Brands.Include(x => x.Products).FirstOrDefaultAsync(x => x.Id == id)
            ?? throw new KeyNotFoundException("Brand not found.");

        if (brand.Products.Any(x => !x.IsDeleted))
        {
            throw new InvalidOperationException("Cannot delete brand while products exist.");
        }

        db.Brands.Remove(brand);
        await db.SaveChangesAsync();
    }

    private IQueryable<Brand> QueryBase()
        => db.Brands.Include(x => x.BrandType).Include(x => x.Products).AsQueryable();

    private async Task<string> UniqueSlugAsync(string name, string slug, int? id = null)
    {
        var baseSlug = SlugHelper.Generate(string.IsNullOrWhiteSpace(slug) ? name : slug);
        var candidate = baseSlug;
        var index = 1;

        while (await db.Brands.AnyAsync(x => x.Slug == candidate && (!id.HasValue || x.Id != id.Value)))
        {
            candidate = $"{baseSlug}-{index++}";
        }

        return candidate;
    }

    private static BrandResponseDto Map(Brand brand) => new()
    {
        Id = brand.Id,
        Name = brand.Name,
        Code = brand.Code,
        Slug = brand.Slug,
        BrandTypeId = brand.BrandTypeId,
        BrandTypeName = brand.BrandType?.Name ?? (brand.IsOwnBrand ? "Own Brand" : "Partner Brand"),
        LogoUrl = brand.LogoUrl,
        Description = brand.Description,
        IsOwnBrand = brand.IsOwnBrand,
        DisplayOrder = brand.DisplayOrder,
        IsActive = brand.IsActive,
        ProductCount = brand.Products.Count(product => product.IsActive && !product.IsDeleted),
        CreatedAt = brand.CreatedAt,
        UpdatedAt = brand.UpdatedAt
    };
}
