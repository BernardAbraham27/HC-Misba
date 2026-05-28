using GodGraceHomeProducts.Application.DTOs.Payments;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface IPaymentService
{
    Task<PaymentResponseDto> CreateOrderAsync(CreatePaymentOrderDto request);
    Task<PaymentResponseDto> VerifyPaymentAsync(VerifyPaymentDto request);
    Task<PaymentResponseDto> GetByOrderIdAsync(int orderId);
}
