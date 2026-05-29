using System.ComponentModel.DataAnnotations;

namespace GodGraceHomeProducts.Application.DTOs.Products;

public class ProductListQueryDto
{
    public string? Search { get; set; }
    public int? BrandId { get; set; }
    public string? BrandSlug { get; set; }
    public bool? IsOwnBrand { get; set; }
    public int? CategoryId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? SortBy { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class ProductRequestDto
{
    [Required] public string Name { get; set; } = string.Empty;
    [Required] public int BrandId { get; set; }
    [Required] public int CategoryId { get; set; }
    public int? SizeId { get; set; }
    public int? ProductStatusId { get; set; }
    [Required] public string ShortDescription { get; set; } = string.Empty;
    [Required] public string Description { get; set; } = string.Empty;
    [Range(0, 999999)] public decimal Price { get; set; }
    [Range(0, 999999)] public decimal? DiscountPrice { get; set; }
    [Range(0, 100000)] public int StockQuantity { get; set; }
    [Required] public string ImageUrl { get; set; } = string.Empty;
    [Range(0, 5)] public decimal Rating { get; set; }
    public bool IsBestSeller { get; set; }
    public bool IsNewArrival { get; set; }
    public bool IsActive { get; set; } = true;
    public List<string> Sizes { get; set; } = [];
    public List<string> Benefits { get; set; } = [];
    [Required] public string HowToUse { get; set; } = string.Empty;
    [Required] public string SafetyInstructions { get; set; } = string.Empty;
}

public class ProductResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int BrandId { get; set; }
    public string BrandName { get; set; } = string.Empty;
    public string BrandSlug { get; set; } = string.Empty;
    public int BrandTypeId { get; set; }
    public string BrandTypeName { get; set; } = string.Empty;
    public bool IsOwnBrand { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int? SizeId { get; set; }
    public string SizeName { get; set; } = string.Empty;
    public int? ProductStatusId { get; set; }
    public string ProductStatusName { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Rating { get; set; }
    public bool IsBestSeller { get; set; }
    public bool IsNewArrival { get; set; }
    public bool IsActive { get; set; }
    public List<string> Sizes { get; set; } = [];
    public List<string> Benefits { get; set; } = [];
    public string HowToUse { get; set; } = string.Empty;
    public string SafetyInstructions { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
