using GodGraceHomeProducts.Domain.Common;
using GodGraceHomeProducts.Domain.Enums;

namespace GodGraceHomeProducts.Domain.Entities;

public class Payment : BaseEntity
{
    public int OrderId { get; set; }
    public Order? Order { get; set; }
    public string PaymentGatewayOrderId { get; set; } = string.Empty;
    public string? PaymentGatewayPaymentId { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public decimal Amount { get; set; }
    public string? TransactionReference { get; set; }
    public string? Notes { get; set; }
}
