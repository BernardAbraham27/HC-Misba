using GodGraceHomeProducts.Application.DTOs.Payments;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Entities;
using GodGraceHomeProducts.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace GodGraceHomeProducts.Application.Services;

public class PaymentService(IAppDbContext db, IConfiguration configuration) : IPaymentService
{
    public async Task<PaymentResponseDto> CreateOrderAsync(CreatePaymentOrderDto request)
    {
        var order = await db.Orders.FirstOrDefaultAsync(x => x.Id == request.OrderId)
            ?? throw new KeyNotFoundException("Order not found.");
        var payment = new Payment
        {
            OrderId = order.Id,
            PaymentGatewayOrderId = $"RZP-{Guid.NewGuid():N}".ToUpperInvariant(),
            PaymentMethod = request.PaymentMethod,
            Status = PaymentStatus.Pending,
            Amount = order.GrandTotal,
            Notes = $"Placeholder payment created with key {configuration["Razorpay:Key"]}."
        };
        db.Payments.Add(payment);
        await db.SaveChangesAsync();
        return Map(payment);
    }

    public async Task<PaymentResponseDto> VerifyPaymentAsync(VerifyPaymentDto request)
    {
        var payment = await db.Payments.FirstOrDefaultAsync(x => x.OrderId == request.OrderId && x.PaymentGatewayOrderId == request.PaymentGatewayOrderId)
            ?? throw new KeyNotFoundException("Payment order not found.");
        payment.PaymentGatewayPaymentId = request.PaymentGatewayPaymentId;
        payment.TransactionReference = request.Signature;
        payment.Status = PaymentStatus.Paid;
        payment.UpdatedAt = DateTime.UtcNow;
        var order = await db.Orders.FirstAsync(x => x.Id == request.OrderId);
        order.PaymentStatus = PaymentStatus.Paid;
        order.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return Map(payment);
    }

    public async Task<PaymentResponseDto> GetByOrderIdAsync(int orderId)
        => Map(await db.Payments.OrderByDescending(x => x.CreatedAt).FirstOrDefaultAsync(x => x.OrderId == orderId)
               ?? throw new KeyNotFoundException("Payment not found."));

    private static PaymentResponseDto Map(Payment x) => new()
    {
        Id = x.Id,
        OrderId = x.OrderId,
        PaymentGatewayOrderId = x.PaymentGatewayOrderId,
        PaymentGatewayPaymentId = x.PaymentGatewayPaymentId,
        PaymentMethod = x.PaymentMethod,
        Status = x.Status,
        Amount = x.Amount,
        Notes = x.Notes
    };
}
