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
            Slug = await UniqueSlugAsync(request.Name, request.Slug),
            LogoUrl = request.LogoUrl?.Trim(),
            Description = request.Description.Trim(),
            IsOwnBrand = request.IsOwnBrand,
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
        brand.Slug = await UniqueSlugAsync(request.Name, request.Slug, id);
        brand.LogoUrl = request.LogoUrl?.Trim();
        brand.Description = request.Description.Trim();
        brand.IsOwnBrand = request.IsOwnBrand;
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
        => db.Brands.Include(x => x.Products).AsQueryable();

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
        Slug = brand.Slug,
        LogoUrl = brand.LogoUrl,
        Description = brand.Description,
        IsOwnBrand = brand.IsOwnBrand,
        IsActive = brand.IsActive,
        ProductCount = brand.Products.Count(product => product.IsActive && !product.IsDeleted),
        CreatedAt = brand.CreatedAt,
        UpdatedAt = brand.UpdatedAt
    };
}
