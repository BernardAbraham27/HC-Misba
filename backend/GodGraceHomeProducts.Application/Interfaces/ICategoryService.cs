using GodGraceHomeProducts.Application.DTOs.Categories;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface ICategoryService
{
    Task<IReadOnlyCollection<CategoryResponseDto>> GetAllAsync();
    Task<CategoryResponseDto> GetByIdAsync(int id);
    Task<CategoryResponseDto> CreateAsync(CategoryRequestDto request);
    Task<CategoryResponseDto> UpdateAsync(int id, CategoryRequestDto request);
    Task DeleteAsync(int id);
}
