using GodGraceHomeProducts.Domain.Common;
using GodGraceHomeProducts.Domain.Enums;

namespace GodGraceHomeProducts.Domain.Entities;

public class Order : BaseEntity
{
    public int UserId { get; set; }
    public User? User { get; set; }
    public int AddressId { get; set; }
    public Address? Address { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public decimal DeliveryCharge { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal GrandTotal { get; set; }
    public string? CouponCode { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.CashOnDelivery;
    public string? Notes { get; set; }
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
