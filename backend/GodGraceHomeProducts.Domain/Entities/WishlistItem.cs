using GodGraceHomeProducts.Domain.Common;

namespace GodGraceHomeProducts.Domain.Entities;

public class WishlistItem : BaseEntity
{
    public int UserId { get; set; }
    public User? User { get; set; }
    public int ProductId { get; set; }
    public Product? Product { get; set; }
}
