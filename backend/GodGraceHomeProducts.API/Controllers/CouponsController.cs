using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Coupons;
using GodGraceHomeProducts.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GodGraceHomeProducts.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CouponsController(ICouponService couponService) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll() => Ok(ApiResponse.Ok(await couponService.GetAllAsync()));
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CouponRequestDto request) => Ok(ApiResponse.Ok(await couponService.CreateAsync(request), "Coupon created successfully."));
    [HttpPost("validate")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> Validate([FromBody] CouponValidateDto request) => Ok(ApiResponse.Ok(new { discount = await couponService.ValidateAsync(request) }, "Coupon validated successfully."));
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] CouponRequestDto request) => Ok(ApiResponse.Ok(await couponService.UpdateAsync(id, request), "Coupon updated successfully."));
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id) { await couponService.DeleteAsync(id); return Ok(ApiResponse.Ok(null, "Coupon deleted successfully.")); }
}
