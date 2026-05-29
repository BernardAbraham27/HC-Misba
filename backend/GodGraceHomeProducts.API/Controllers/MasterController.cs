using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Masters;
using GodGraceHomeProducts.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GodGraceHomeProducts.API.Controllers;

[ApiController]
[Route("api/master")]
public class MasterController(IMasterService masterService) : ControllerBase
{
    [HttpGet("brands")]
    public async Task<IActionResult> GetBrands() => Ok(ApiResponse.Ok(await masterService.GetPublicAsync("brands")));

    [HttpGet("brand-types")]
    public async Task<IActionResult> GetBrandTypes() => Ok(ApiResponse.Ok(await masterService.GetPublicAsync("brand-types")));

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories() => Ok(ApiResponse.Ok(await masterService.GetPublicAsync("categories")));

    [HttpGet("product-sizes")]
    public async Task<IActionResult> GetProductSizes() => Ok(ApiResponse.Ok(await masterService.GetPublicAsync("product-sizes")));

    [HttpGet("product-statuses")]
    public async Task<IActionResult> GetProductStatuses() => Ok(ApiResponse.Ok(await masterService.GetPublicAsync("product-statuses")));

    [HttpGet("order-statuses")]
    public async Task<IActionResult> GetOrderStatuses() => Ok(ApiResponse.Ok(await masterService.GetPublicAsync("order-statuses")));

    [HttpGet("payment-statuses")]
    public async Task<IActionResult> GetPaymentStatuses() => Ok(ApiResponse.Ok(await masterService.GetPublicAsync("payment-statuses")));

    [HttpGet("customer-statuses")]
    public async Task<IActionResult> GetCustomerStatuses() => Ok(ApiResponse.Ok(await masterService.GetPublicAsync("customer-statuses")));

    [HttpGet("coupon-statuses")]
    public async Task<IActionResult> GetCouponStatuses() => Ok(ApiResponse.Ok(await masterService.GetPublicAsync("coupon-statuses")));

    [HttpGet("inventory-statuses")]
    public async Task<IActionResult> GetInventoryStatuses() => Ok(ApiResponse.Ok(await masterService.GetPublicAsync("inventory-statuses")));

    [HttpGet("enquiry-statuses")]
    public async Task<IActionResult> GetEnquiryStatuses() => Ok(ApiResponse.Ok(await masterService.GetPublicAsync("enquiry-statuses")));

    [HttpGet("roles")]
    public async Task<IActionResult> GetRoles() => Ok(ApiResponse.Ok(await masterService.GetPublicAsync("roles")));
}

[ApiController]
[Authorize]
[Route("api/admin/master")]
public class AdminMasterController(IMasterService masterService) : ControllerBase
{
    [HttpGet("{masterType}")]
    public async Task<IActionResult> GetAll(string masterType) => Ok(ApiResponse.Ok(await masterService.GetAdminAsync(masterType)));

    [HttpPost("{masterType}")]
    public async Task<IActionResult> Create(string masterType, [FromBody] MasterValueRequestDto request)
        => Ok(ApiResponse.Ok(await masterService.CreateAsync(masterType, request), "Master value created."));

    [HttpPut("{masterType}/{id:int}")]
    public async Task<IActionResult> Update(string masterType, int id, [FromBody] MasterValueRequestDto request)
        => Ok(ApiResponse.Ok(await masterService.UpdateAsync(masterType, id, request), "Master value updated."));

    [HttpPatch("{masterType}/{id:int}/status")]
    public async Task<IActionResult> SetStatus(string masterType, int id, [FromBody] MasterStatusUpdateDto request)
        => Ok(ApiResponse.Ok(await masterService.SetStatusAsync(masterType, id, request.IsActive), "Master status updated."));

    [HttpDelete("{masterType}/{id:int}")]
    public async Task<IActionResult> Delete(string masterType, int id)
    {
        await masterService.DeleteAsync(masterType, id);
        return Ok(ApiResponse.Ok(null, "Master value deleted."));
    }
}
