using GodGraceHomeProducts.Domain.Common;

namespace GodGraceHomeProducts.Domain.Entities;

public class Review : BaseEntity
{
    public int UserId { get; set; }
    public User? User { get; set; }
    public int ProductId { get; set; }
    public Product? Product { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
}
