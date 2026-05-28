using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Products;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface IProductService
{
    Task<PagedResult<ProductResponseDto>> GetProductsAsync(ProductListQueryDto query);
    Task<ProductResponseDto> GetByIdAsync(int id);
    Task<ProductResponseDto> GetBySlugAsync(string slug);
    Task<IReadOnlyCollection<ProductResponseDto>> GetByCategoryAsync(int categoryId);
    Task<IReadOnlyCollection<ProductResponseDto>> GetBestSellersAsync();
    Task<IReadOnlyCollection<ProductResponseDto>> GetNewArrivalsAsync();
    Task<ProductResponseDto> CreateAsync(ProductRequestDto request);
    Task<ProductResponseDto> UpdateAsync(int id, ProductRequestDto request);
    Task DeleteAsync(int id);
}
