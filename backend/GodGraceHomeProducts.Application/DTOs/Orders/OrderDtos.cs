using System.ComponentModel.DataAnnotations;
using GodGraceHomeProducts.Domain.Enums;

namespace GodGraceHomeProducts.Application.DTOs.Orders;

public class CreateOrderDto
{
    public int? AddressId { get; set; }
    public string? FullName { get; set; }
    public string? MobileNumber { get; set; }
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Pincode { get; set; }
    public string? Landmark { get; set; }
    public string? CouponCode { get; set; }
    [Required] public PaymentMethod PaymentMethod { get; set; }
    public string? Notes { get; set; }
}

public class GuestOrderItemDto
{
    [Required] public int ProductId { get; set; }
    public string? ProductName { get; set; }
    [Required] public string Size { get; set; } = string.Empty;
    [Range(1, 1000)] public int Quantity { get; set; }
    [Range(0, 999999)] public decimal UnitPrice { get; set; }
}

public class CreateGuestOrderDto
{
    [Required] public string CustomerName { get; set; } = string.Empty;
    [Required] public string MobileNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    [Required] public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    [Required] public string City { get; set; } = string.Empty;
    [Required] public string State { get; set; } = string.Empty;
    [Required] public string Pincode { get; set; } = string.Empty;
    public string? Landmark { get; set; }
    [Required] public PaymentMethod PaymentMethod { get; set; }
    public string? CouponCode { get; set; }
    public string? Notes { get; set; }
    [MinLength(1)] public IReadOnlyCollection<GuestOrderItemDto> Items { get; set; } = Array.Empty<GuestOrderItemDto>();
}

public class GuestOrderResultDto
{
    public bool Success { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class OrderAddressDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public string? Landmark { get; set; }
}

public class UpdateOrderStatusDto
{
    [Required] public OrderStatus Status { get; set; }
}

public class UpdatePaymentStatusDto
{
    [Required] public PaymentStatus PaymentStatus { get; set; }
}

public class OrderItemDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductImageUrl { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
}

public class OrderResponseDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerMobileNumber { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public decimal DeliveryCharge { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal GrandTotal { get; set; }
    public string? CouponCode { get; set; }
    public OrderStatus Status { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string? Notes { get; set; }
    public DateTime OrderDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public OrderAddressDto? Address { get; set; }
    public IReadOnlyCollection<OrderItemDto> Items { get; set; } = Array.Empty<OrderItemDto>();
}

public class InvoiceDto
{
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal GrandTotal { get; set; }
    public IReadOnlyCollection<OrderItemDto> Items { get; set; } = Array.Empty<OrderItemDto>();
}
