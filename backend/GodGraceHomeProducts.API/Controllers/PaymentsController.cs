using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Payments;
using GodGraceHomeProducts.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GodGraceHomeProducts.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class PaymentsController(IPaymentService paymentService) : ControllerBase
{
    [HttpPost("create-order")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> CreateOrder([FromBody] CreatePaymentOrderDto request) => Ok(ApiResponse.Ok(await paymentService.CreateOrderAsync(request), "Payment order created successfully."));
    [HttpPost("verify")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> Verify([FromBody] VerifyPaymentDto request) => Ok(ApiResponse.Ok(await paymentService.VerifyPaymentAsync(request), "Payment verified successfully."));
    [HttpGet("order/{orderId:int}")]
    public async Task<IActionResult> GetByOrder(int orderId) => Ok(ApiResponse.Ok(await paymentService.GetByOrderIdAsync(orderId)));
}
