using GodGraceHomeProducts.Domain.Common;

namespace GodGraceHomeProducts.Domain.Entities;

public class ProductSize : BaseEntity
{
    public int ProductId { get; set; }
    public Product? Product { get; set; }
    public string Size { get; set; } = string.Empty;
}
