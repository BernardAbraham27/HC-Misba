using GodGraceHomeProducts.Application.DTOs.Brands;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface IBrandService
{
    Task<IReadOnlyCollection<BrandResponseDto>> GetAllAsync();
    Task<BrandResponseDto> GetByIdAsync(int id);
    Task<BrandResponseDto> GetBySlugAsync(string slug);
    Task<BrandResponseDto> CreateAsync(BrandRequestDto request);
    Task<BrandResponseDto> UpdateAsync(int id, BrandRequestDto request);
    Task DeleteAsync(int id);
}
