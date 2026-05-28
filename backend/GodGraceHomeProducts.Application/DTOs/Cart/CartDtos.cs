using System.ComponentModel.DataAnnotations;

namespace GodGraceHomeProducts.Application.DTOs.Cart;

public class AddCartItemDto
{
    [Required] public int ProductId { get; set; }
    [Required] public string Size { get; set; } = string.Empty;
    [Range(1, 1000)] public int Quantity { get; set; }
}

public class UpdateCartItemDto
{
    [Required] public int CartItemId { get; set; }
    [Range(1, 1000)] public int Quantity { get; set; }
}

public class CartItemDto
{
    public int CartItemId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public class CartSummaryDto
{
    public IReadOnlyCollection<CartItemDto> Items { get; set; } = Array.Empty<CartItemDto>();
    public decimal Subtotal { get; set; }
    public decimal DeliveryCharge { get; set; }
    public decimal Discount { get; set; }
    public decimal GrandTotal { get; set; }
}
