using System.ComponentModel.DataAnnotations;

namespace GodGraceHomeProducts.Application.DTOs.Brands;

public class BrandRequestDto
{
    [Required] public string Name { get; set; } = string.Empty;
    [Required] public string Slug { get; set; } = string.Empty;
    public string? Code { get; set; }
    public int? BrandTypeId { get; set; }
    public string? LogoUrl { get; set; }
    [Required] public string Description { get; set; } = string.Empty;
    public bool IsOwnBrand { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class BrandResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int BrandTypeId { get; set; }
    public string BrandTypeName { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsOwnBrand { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public int ProductCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
