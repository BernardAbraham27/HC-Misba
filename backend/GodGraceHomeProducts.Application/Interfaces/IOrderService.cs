using GodGraceHomeProducts.Application.DTOs.Orders;
using GodGraceHomeProducts.Domain.Enums;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface IOrderService
{
    Task<OrderResponseDto> CreateOrderAsync(int userId, CreateOrderDto request);
    Task<GuestOrderResultDto> CreateGuestOrderAsync(CreateGuestOrderDto request);
    Task<IReadOnlyCollection<OrderResponseDto>> GetMyOrdersAsync(int userId);
    Task<OrderResponseDto> GetOrderByIdAsync(int requesterId, bool isAdmin, int orderId);
    Task<OrderResponseDto> TrackOrderAsync(string orderNumber, string mobileNumber);
    Task<IReadOnlyCollection<OrderResponseDto>> GetAllOrdersAsync();
    Task<OrderResponseDto> UpdateOrderStatusAsync(int orderId, OrderStatus status);
    Task<OrderResponseDto> UpdatePaymentStatusAsync(int orderId, PaymentStatus status);
    Task<OrderResponseDto> CancelOrderAsync(int requesterId, bool isAdmin, int orderId);
    Task<InvoiceDto> GetInvoiceAsync(int requesterId, bool isAdmin, int orderId);
}
