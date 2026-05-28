using System.ComponentModel.DataAnnotations;
using GodGraceHomeProducts.Domain.Enums;

namespace GodGraceHomeProducts.Application.DTOs.Payments;

public class CreatePaymentOrderDto
{
    [Required] public int OrderId { get; set; }
    [Required] public PaymentMethod PaymentMethod { get; set; }
}

public class VerifyPaymentDto
{
    [Required] public int OrderId { get; set; }
    [Required] public string PaymentGatewayOrderId { get; set; } = string.Empty;
    [Required] public string PaymentGatewayPaymentId { get; set; } = string.Empty;
    public string? Signature { get; set; }
}

public class PaymentResponseDto
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public string PaymentGatewayOrderId { get; set; } = string.Empty;
    public string? PaymentGatewayPaymentId { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus Status { get; set; }
    public decimal Amount { get; set; }
    public string? Notes { get; set; }
}
