using System.ComponentModel.DataAnnotations;

namespace GodGraceHomeProducts.Application.DTOs.Wishlist;

public class AddWishlistItemDto
{
    [Required] public int ProductId { get; set; }
}

public class WishlistItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
}
