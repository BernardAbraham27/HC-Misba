using GodGraceHomeProducts.API.Common;
using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Orders;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GodGraceHomeProducts.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class OrdersController(IOrderService orderService) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("guest")]
    public async Task<IActionResult> CreateGuest([FromBody] CreateGuestOrderDto request)
        => Ok(ApiResponse.Ok(await orderService.CreateGuestOrderAsync(request), "Order placed successfully."));

    [HttpPost]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto request) => Ok(ApiResponse.Ok(await orderService.CreateOrderAsync(User.GetUserId(), request), "Order placed successfully."));

    [AllowAnonymous]
    [HttpGet("track")]
    public async Task<IActionResult> Track([FromQuery] string orderNumber, [FromQuery] string mobileNumber)
        => Ok(ApiResponse.Ok(await orderService.TrackOrderAsync(orderNumber, mobileNumber)));

    [HttpGet("my")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> My() => Ok(ApiResponse.Ok(await orderService.GetMyOrdersAsync(User.GetUserId())));
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id) => Ok(ApiResponse.Ok(await orderService.GetOrderByIdAsync(User.GetUserId(), User.IsInRole(UserRole.Admin.ToString()), id)));
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll() => Ok(ApiResponse.Ok(await orderService.GetAllOrdersAsync()));
    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto request) => Ok(ApiResponse.Ok(await orderService.UpdateOrderStatusAsync(id, request.Status), "Order status updated."));
    [HttpPut("{id:int}/payment-status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePaymentStatus(int id, [FromBody] UpdatePaymentStatusDto request) => Ok(ApiResponse.Ok(await orderService.UpdatePaymentStatusAsync(id, request.PaymentStatus), "Payment status updated."));
    [HttpPut("{id:int}/cancel")]
    [Authorize(Roles = "Admin,Customer")]
    public async Task<IActionResult> Cancel(int id) => Ok(ApiResponse.Ok(await orderService.CancelOrderAsync(User.GetUserId(), User.IsInRole(UserRole.Admin.ToString()), id), "Order cancelled successfully."));
    [HttpGet("{id:int}/invoice")]
    public async Task<IActionResult> Invoice(int id) => Ok(ApiResponse.Ok(await orderService.GetInvoiceAsync(User.GetUserId(), User.IsInRole(UserRole.Admin.ToString()), id)));
}
