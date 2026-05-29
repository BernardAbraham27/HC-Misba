using System.ComponentModel.DataAnnotations;

namespace GodGraceHomeProducts.Application.DTOs.Masters;

public class MasterValueDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int? DisplayOrder { get; set; }
    public string? LogoPath { get; set; }
    public string? ImagePath { get; set; }
    public int? BrandTypeId { get; set; }
    public string? BrandTypeName { get; set; }
    public string? Unit { get; set; }
    public decimal? Value { get; set; }
    public int? LinkedCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class MasterValueRequestDto
{
    [Required] public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public int? DisplayOrder { get; set; }
    public string? LogoPath { get; set; }
    public string? ImagePath { get; set; }
    public int? BrandTypeId { get; set; }
    public string? Unit { get; set; }
    public decimal? Value { get; set; }
}

public class MasterStatusUpdateDto
{
    public bool IsActive { get; set; }
}
