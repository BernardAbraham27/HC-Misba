using GodGraceHomeProducts.Application.DTOs.Categories;
using GodGraceHomeProducts.Application.Helpers;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GodGraceHomeProducts.Application.Services;

public class CategoryService(IAppDbContext db) : ICategoryService
{
    public async Task<IReadOnlyCollection<CategoryResponseDto>> GetAllAsync()
        => (await db.Categories.Include(x => x.Products).Where(x => !x.IsDeleted).OrderBy(x => x.Name).ToListAsync())
            .Select(Map).ToList();

    public async Task<CategoryResponseDto> GetByIdAsync(int id)
    {
        var entity = await db.Categories.Include(x => x.Products).FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted)
            ?? throw new KeyNotFoundException("Category not found.");
        return Map(entity);
    }

    public async Task<CategoryResponseDto> CreateAsync(CategoryRequestDto request)
    {
        var slug = SlugHelper.Generate(request.Name);
        if (await db.Categories.AnyAsync(x => x.Slug == slug && !x.IsDeleted))
        {
            throw new InvalidOperationException("Category already exists.");
        }

        var category = new Category
        {
            Name = request.Name.Trim(),
            Slug = slug,
            Description = request.Description.Trim(),
            ImageUrl = request.ImageUrl?.Trim(),
            IsActive = request.IsActive
        };
        db.Categories.Add(category);
        await db.SaveChangesAsync();
        return Map(category);
    }

    public async Task<CategoryResponseDto> UpdateAsync(int id, CategoryRequestDto request)
    {
        var category = await db.Categories.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted)
            ?? throw new KeyNotFoundException("Category not found.");
        var slug = SlugHelper.Generate(request.Name);
        if (await db.Categories.AnyAsync(x => x.Id != id && x.Slug == slug && !x.IsDeleted))
        {
            throw new InvalidOperationException("Category already exists.");
        }

        category.Name = request.Name.Trim();
        category.Slug = slug;
        category.Description = request.Description.Trim();
        category.ImageUrl = request.ImageUrl?.Trim();
        category.IsActive = request.IsActive;
        category.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task DeleteAsync(int id)
    {
        var category = await db.Categories.Include(x => x.Products).FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted)
            ?? throw new KeyNotFoundException("Category not found.");
        if (category.Products.Any(x => x.IsActive && !x.IsDeleted))
        {
            throw new InvalidOperationException("Cannot delete category while products exist.");
        }

        category.IsDeleted = true;
        category.IsActive = false;
        category.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }

    private static CategoryResponseDto Map(Category x) => new()
    {
        Id = x.Id,
        Name = x.Name,
        Slug = x.Slug,
        Description = x.Description,
        ImageUrl = x.ImageUrl,
        IsActive = x.IsActive,
        ProductCount = x.Products.Count(p => p.IsActive && !p.IsDeleted)
    };
}
