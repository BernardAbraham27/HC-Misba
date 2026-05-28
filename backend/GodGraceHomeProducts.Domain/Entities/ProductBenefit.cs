using GodGraceHomeProducts.Domain.Common;

namespace GodGraceHomeProducts.Domain.Entities;

public class ProductBenefit : BaseEntity
{
    public int ProductId { get; set; }
    public Product? Product { get; set; }
    public string Benefit { get; set; } = string.Empty;
}
