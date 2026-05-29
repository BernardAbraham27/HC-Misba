using GodGraceHomeProducts.Application.DTOs.Masters;
using GodGraceHomeProducts.Application.Helpers;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Common;
using GodGraceHomeProducts.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GodGraceHomeProducts.Application.Services;

public class MasterService(IAppDbContext db) : IMasterService
{
    public async Task<IReadOnlyCollection<MasterValueDto>> GetPublicAsync(string masterType)
        => (await GetQuery(masterType, false).ToListAsync()).Select(ToDto).ToList();

    public async Task<IReadOnlyCollection<MasterValueDto>> GetAdminAsync(string masterType)
        => (await GetQuery(masterType, true).ToListAsync()).Select(ToDto).ToList();

    public async Task<MasterValueDto> CreateAsync(string masterType, MasterValueRequestDto request)
    {
        var normalizedType = NormalizeType(masterType);
        object entity = normalizedType switch
        {
            "brands" => await CreateBrandAsync(request),
            "brand-types" => (object)CreateNamedMaster(new BrandTypeMaster(), request),
            "categories" => (object)CreateCategory(request),
            "product-sizes" => (object)CreateProductSize(request),
            "product-statuses" => (object)CreateNamedMaster(new ProductStatusMaster(), request),
            "order-statuses" => (object)CreateDisplayOrderedMaster(new OrderStatusMaster(), request),
            "payment-statuses" => (object)CreateNamedMaster(new PaymentStatusMaster(), request),
            "customer-statuses" => (object)CreateNamedMaster(new CustomerStatusMaster(), request),
            "coupon-statuses" => (object)CreateNamedMaster(new CouponStatusMaster(), request),
            "inventory-statuses" => (object)CreateNamedMaster(new InventoryStatusMaster(), request),
            "enquiry-statuses" => (object)CreateNamedMaster(new EnquiryStatusMaster(), request),
            "roles" => (object)CreateNamedMaster(new UserRoleMaster(), request),
            _ => throw Unsupported(masterType)
        };

        AddEntity(entity);
        await db.SaveChangesAsync();
        var entityId = entity switch
        {
            BaseEntity baseEntity => baseEntity.Id,
            _ => throw new InvalidOperationException("Unsupported master entity.")
        };
        return ToDto(await GetEntityByIdAsync(normalizedType, entityId));
    }

    public async Task<MasterValueDto> UpdateAsync(string masterType, int id, MasterValueRequestDto request)
    {
        var entity = await GetEntityByIdAsync(NormalizeType(masterType), id);

        switch (entity)
        {
            case Brand brand:
                await EnsureBrandTypeAsync(request.BrandTypeId);
                brand.Name = request.Name.Trim();
                brand.Code = BuildCode(request.Code, request.Name);
                brand.Slug = SlugHelper.Generate(request.Name);
                brand.BrandTypeId = request.BrandTypeId ?? brand.BrandTypeId;
                brand.Description = (request.Description ?? string.Empty).Trim();
                brand.LogoUrl = request.LogoPath?.Trim();
                brand.DisplayOrder = request.DisplayOrder ?? brand.DisplayOrder;
                brand.IsOwnBrand = brand.BrandTypeId == 1;
                brand.IsActive = request.IsActive;
                brand.UpdatedAt = DateTime.UtcNow;
                break;
            case Category category:
                category.Name = request.Name.Trim();
                category.Code = BuildCode(request.Code, request.Name);
                category.Slug = SlugHelper.Generate(request.Name);
                category.Description = (request.Description ?? string.Empty).Trim();
                category.ImageUrl = request.ImagePath?.Trim();
                category.DisplayOrder = request.DisplayOrder ?? category.DisplayOrder;
                category.IsActive = request.IsActive;
                category.UpdatedAt = DateTime.UtcNow;
                break;
            case ProductSizeMaster size:
                ApplyNamedMaster(size, request);
                size.Unit = (request.Unit ?? size.Unit).Trim();
                size.Value = request.Value ?? size.Value;
                break;
            case DisplayOrderedMasterValueBase ordered:
                ApplyNamedMaster(ordered, request);
                ordered.DisplayOrder = request.DisplayOrder ?? ordered.DisplayOrder;
                break;
            case MasterValueBase master:
                ApplyNamedMaster(master, request);
                break;
            default:
                throw Unsupported(masterType);
        }

        await db.SaveChangesAsync();
        return ToDto(await GetEntityByIdAsync(NormalizeType(masterType), id));
    }

    public async Task<MasterValueDto> SetStatusAsync(string masterType, int id, bool isActive)
    {
        var entity = await GetEntityByIdAsync(NormalizeType(masterType), id);

        switch (entity)
        {
            case Brand brand:
                brand.IsActive = isActive;
                brand.UpdatedAt = DateTime.UtcNow;
                break;
            case Category category:
                category.IsActive = isActive;
                category.UpdatedAt = DateTime.UtcNow;
                break;
            case MasterValueBase master:
                master.IsActive = isActive;
                master.UpdatedAt = DateTime.UtcNow;
                break;
            default:
                throw Unsupported(masterType);
        }

        await db.SaveChangesAsync();
        return ToDto(await GetEntityByIdAsync(NormalizeType(masterType), id));
    }

    public async Task DeleteAsync(string masterType, int id)
    {
        var normalizedType = NormalizeType(masterType);
        var linkedCount = await GetLinkedCountAsync(normalizedType, id);
        if (linkedCount > 0)
        {
            throw new InvalidOperationException("This master value cannot be deleted because it is already linked to records. You can deactivate it instead.");
        }

        var entity = await GetEntityByIdAsync(normalizedType, id);
        RemoveEntity(entity);
        await db.SaveChangesAsync();
    }

    private IQueryable<object> GetQuery(string masterType, bool includeInactive)
    {
        var normalizedType = NormalizeType(masterType);
        return normalizedType switch
        {
            "brands" => db.Brands.Include(x => x.BrandType).Include(x => x.Products)
                .Where(x => includeInactive || x.IsActive).OrderBy(x => x.DisplayOrder).ThenBy(x => x.Name).Cast<object>(),
            "brand-types" => db.BrandTypes.Include(x => x.Brands)
                .Where(x => includeInactive || x.IsActive).OrderBy(x => x.Name).Cast<object>(),
            "categories" => db.Categories.Include(x => x.Products).Where(x => !x.IsDeleted && (includeInactive || x.IsActive))
                .OrderBy(x => x.DisplayOrder).ThenBy(x => x.Name).Cast<object>(),
            "product-sizes" => db.ProductSizeMasters.Where(x => includeInactive || x.IsActive).OrderBy(x => x.Value).Cast<object>(),
            "product-statuses" => db.ProductStatuses.Where(x => includeInactive || x.IsActive).OrderBy(x => x.Id).Cast<object>(),
            "order-statuses" => db.OrderStatuses.Where(x => includeInactive || x.IsActive).OrderBy(x => x.DisplayOrder).Cast<object>(),
            "payment-statuses" => db.PaymentStatuses.Where(x => includeInactive || x.IsActive).OrderBy(x => x.Id).Cast<object>(),
            "customer-statuses" => db.CustomerStatuses.Where(x => includeInactive || x.IsActive).OrderBy(x => x.Id).Cast<object>(),
            "coupon-statuses" => db.CouponStatuses.Where(x => includeInactive || x.IsActive).OrderBy(x => x.Id).Cast<object>(),
            "inventory-statuses" => db.InventoryStatuses.Where(x => includeInactive || x.IsActive).OrderBy(x => x.Id).Cast<object>(),
            "enquiry-statuses" => db.EnquiryStatuses.Where(x => includeInactive || x.IsActive).OrderBy(x => x.Id).Cast<object>(),
            "roles" => db.UserRoles.Where(x => includeInactive || x.IsActive).OrderBy(x => x.Id).Cast<object>(),
            _ => throw Unsupported(masterType)
        };
    }

    private async Task<object> GetEntityByIdAsync(string masterType, int id)
    {
        return masterType switch
        {
            "brands" => await db.Brands.Include(x => x.BrandType).Include(x => x.Products).FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Master value not found."),
            "brand-types" => await db.BrandTypes.Include(x => x.Brands).FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Master value not found."),
            "categories" => await db.Categories.Include(x => x.Products).FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted) ?? throw new KeyNotFoundException("Master value not found."),
            "product-sizes" => await db.ProductSizeMasters.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Master value not found."),
            "product-statuses" => await db.ProductStatuses.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Master value not found."),
            "order-statuses" => await db.OrderStatuses.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Master value not found."),
            "payment-statuses" => await db.PaymentStatuses.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Master value not found."),
            "customer-statuses" => await db.CustomerStatuses.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Master value not found."),
            "coupon-statuses" => await db.CouponStatuses.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Master value not found."),
            "inventory-statuses" => await db.InventoryStatuses.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Master value not found."),
            "enquiry-statuses" => await db.EnquiryStatuses.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Master value not found."),
            "roles" => await db.UserRoles.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Master value not found."),
            _ => throw Unsupported(masterType)
        };
    }

    private async Task<int> GetLinkedCountAsync(string masterType, int id)
    {
        return masterType switch
        {
            "brands" => await db.Products.CountAsync(x => x.BrandId == id && !x.IsDeleted),
            "brand-types" => await db.Brands.CountAsync(x => x.BrandTypeId == id),
            "categories" => await db.Products.CountAsync(x => x.CategoryId == id && !x.IsDeleted),
            "product-sizes" => await db.Products.CountAsync(x => x.ProductSizeMasterId == id && !x.IsDeleted),
            "product-statuses" => await db.Products.CountAsync(x => x.ProductStatusId == id && !x.IsDeleted),
            "order-statuses" => await db.Orders.CountAsync(x => (int)x.Status == id),
            "payment-statuses" => await db.Orders.CountAsync(x => (int)x.PaymentStatus == id),
            "customer-statuses" => 0,
            "coupon-statuses" => 0,
            "inventory-statuses" => 0,
            "enquiry-statuses" => await db.Enquiries.CountAsync(x => (int)x.Status == id),
            "roles" => await db.Users.CountAsync(x => (int)x.Role == id),
            _ => throw Unsupported(masterType)
        };
    }

    private static Brand CreateBrand(MasterValueRequestDto request, int brandTypeId)
        => new()
        {
            Name = request.Name.Trim(),
            Code = BuildCode(request.Code, request.Name),
            Slug = SlugHelper.Generate(request.Name),
            BrandTypeId = brandTypeId,
            Description = (request.Description ?? string.Empty).Trim(),
            LogoUrl = request.LogoPath?.Trim(),
            DisplayOrder = request.DisplayOrder ?? 0,
            IsOwnBrand = brandTypeId == 1,
            IsActive = request.IsActive
        };

    private async Task<Brand> CreateBrandAsync(MasterValueRequestDto request)
    {
        await EnsureBrandTypeAsync(request.BrandTypeId);
        return CreateBrand(request, request.BrandTypeId!.Value);
    }

    private static Category CreateCategory(MasterValueRequestDto request)
        => new()
        {
            Name = request.Name.Trim(),
            Code = BuildCode(request.Code, request.Name),
            Slug = SlugHelper.Generate(request.Name),
            Description = (request.Description ?? string.Empty).Trim(),
            ImageUrl = request.ImagePath?.Trim(),
            DisplayOrder = request.DisplayOrder ?? 0,
            IsActive = request.IsActive
        };

    private static ProductSizeMaster CreateProductSize(MasterValueRequestDto request)
        => new()
        {
            Name = request.Name.Trim(),
            Code = BuildCode(request.Code, request.Name),
            Description = (request.Description ?? string.Empty).Trim(),
            Unit = (request.Unit ?? string.Empty).Trim(),
            Value = request.Value ?? 0,
            IsActive = request.IsActive
        };

    private static T CreateNamedMaster<T>(T entity, MasterValueRequestDto request) where T : MasterValueBase
    {
        ApplyNamedMaster(entity, request);
        return entity;
    }

    private static T CreateDisplayOrderedMaster<T>(T entity, MasterValueRequestDto request) where T : DisplayOrderedMasterValueBase
    {
        ApplyNamedMaster(entity, request);
        entity.DisplayOrder = request.DisplayOrder ?? 0;
        return entity;
    }

    private static void ApplyNamedMaster(MasterValueBase entity, MasterValueRequestDto request)
    {
        entity.Name = request.Name.Trim();
        entity.Code = BuildCode(request.Code, request.Name);
        entity.Description = (request.Description ?? string.Empty).Trim();
        entity.IsActive = request.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;
    }

    private async Task EnsureBrandTypeAsync(int? brandTypeId)
    {
        if (!brandTypeId.HasValue || !await db.BrandTypes.AnyAsync(x => x.Id == brandTypeId.Value && x.IsActive))
        {
            throw new InvalidOperationException("Selected brand type does not exist.");
        }
    }

    private static string NormalizeType(string masterType) => masterType.Trim().ToLowerInvariant();

    private static string BuildCode(string? code, string name)
        => string.IsNullOrWhiteSpace(code)
            ? SlugHelper.Generate(name).Replace("-", "_").ToUpperInvariant()
            : code.Trim().Replace(" ", "_").ToUpperInvariant();

    private static InvalidOperationException Unsupported(string masterType)
        => new($"Unsupported master type '{masterType}'.");

    private void AddEntity(object entity)
    {
        switch (entity)
        {
            case Brand brand:
                db.Brands.Add(brand);
                break;
            case BrandTypeMaster brandType:
                db.BrandTypes.Add(brandType);
                break;
            case Category category:
                db.Categories.Add(category);
                break;
            case ProductSizeMaster productSize:
                db.ProductSizeMasters.Add(productSize);
                break;
            case ProductStatusMaster productStatus:
                db.ProductStatuses.Add(productStatus);
                break;
            case OrderStatusMaster orderStatus:
                db.OrderStatuses.Add(orderStatus);
                break;
            case PaymentStatusMaster paymentStatus:
                db.PaymentStatuses.Add(paymentStatus);
                break;
            case CustomerStatusMaster customerStatus:
                db.CustomerStatuses.Add(customerStatus);
                break;
            case CouponStatusMaster couponStatus:
                db.CouponStatuses.Add(couponStatus);
                break;
            case InventoryStatusMaster inventoryStatus:
                db.InventoryStatuses.Add(inventoryStatus);
                break;
            case EnquiryStatusMaster enquiryStatus:
                db.EnquiryStatuses.Add(enquiryStatus);
                break;
            case UserRoleMaster role:
                db.UserRoles.Add(role);
                break;
            default:
                throw new InvalidOperationException("Unsupported master entity.");
        }
    }

    private void RemoveEntity(object entity)
    {
        switch (entity)
        {
            case Brand brand:
                db.Brands.Remove(brand);
                break;
            case BrandTypeMaster brandType:
                db.BrandTypes.Remove(brandType);
                break;
            case Category category:
                db.Categories.Remove(category);
                break;
            case ProductSizeMaster productSize:
                db.ProductSizeMasters.Remove(productSize);
                break;
            case ProductStatusMaster productStatus:
                db.ProductStatuses.Remove(productStatus);
                break;
            case OrderStatusMaster orderStatus:
                db.OrderStatuses.Remove(orderStatus);
                break;
            case PaymentStatusMaster paymentStatus:
                db.PaymentStatuses.Remove(paymentStatus);
                break;
            case CustomerStatusMaster customerStatus:
                db.CustomerStatuses.Remove(customerStatus);
                break;
            case CouponStatusMaster couponStatus:
                db.CouponStatuses.Remove(couponStatus);
                break;
            case InventoryStatusMaster inventoryStatus:
                db.InventoryStatuses.Remove(inventoryStatus);
                break;
            case EnquiryStatusMaster enquiryStatus:
                db.EnquiryStatuses.Remove(enquiryStatus);
                break;
            case UserRoleMaster role:
                db.UserRoles.Remove(role);
                break;
            default:
                throw new InvalidOperationException("Unsupported master entity.");
        }
    }

    private static MasterValueDto ToDto(object entity)
    {
        return entity switch
        {
            Brand brand => new MasterValueDto
            {
                Id = brand.Id,
                Name = brand.Name,
                Code = brand.Code,
                Description = brand.Description,
                IsActive = brand.IsActive,
                DisplayOrder = brand.DisplayOrder,
                LogoPath = brand.LogoUrl,
                BrandTypeId = brand.BrandTypeId,
                BrandTypeName = brand.BrandType?.Name,
                LinkedCount = brand.Products.Count(x => !x.IsDeleted),
                CreatedAt = brand.CreatedAt,
                UpdatedAt = brand.UpdatedAt
            },
            Category category => new MasterValueDto
            {
                Id = category.Id,
                Name = category.Name,
                Code = category.Code,
                Description = category.Description,
                IsActive = category.IsActive,
                DisplayOrder = category.DisplayOrder,
                ImagePath = category.ImageUrl,
                LinkedCount = category.Products.Count(x => !x.IsDeleted),
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt
            },
            ProductSizeMaster size => new MasterValueDto
            {
                Id = size.Id,
                Name = size.Name,
                Code = size.Code,
                Description = size.Description,
                IsActive = size.IsActive,
                Unit = size.Unit,
                Value = size.Value,
                CreatedAt = size.CreatedAt,
                UpdatedAt = size.UpdatedAt
            },
            DisplayOrderedMasterValueBase ordered => new MasterValueDto
            {
                Id = ordered.Id,
                Name = ordered.Name,
                Code = ordered.Code,
                Description = ordered.Description,
                IsActive = ordered.IsActive,
                DisplayOrder = ordered.DisplayOrder,
                CreatedAt = ordered.CreatedAt,
                UpdatedAt = ordered.UpdatedAt
            },
            MasterValueBase master => new MasterValueDto
            {
                Id = master.Id,
                Name = master.Name,
                Code = master.Code,
                Description = master.Description,
                IsActive = master.IsActive,
                CreatedAt = master.CreatedAt,
                UpdatedAt = master.UpdatedAt
            },
            _ => throw new InvalidOperationException("Unsupported master entity.")
        };
    }
}
