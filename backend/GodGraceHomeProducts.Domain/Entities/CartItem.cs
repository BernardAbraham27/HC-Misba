using GodGraceHomeProducts.Domain.Common;

namespace GodGraceHomeProducts.Domain.Entities;

public class CartItem : BaseEntity
{
    public int UserId { get; set; }
    public User? User { get; set; }
    public int ProductId { get; set; }
    public Product? Product { get; set; }
    public string Size { get; set; } = string.Empty;
    public int Quantity { get; set; }
}
