using GodGraceHomeProducts.Domain.Common;

namespace GodGraceHomeProducts.Domain.Entities;

public class Brand : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int BrandTypeId { get; set; }
    public BrandTypeMaster? BrandType { get; set; }
    public string? LogoUrl { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsOwnBrand { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
