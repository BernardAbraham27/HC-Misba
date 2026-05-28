using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Inventory;
using GodGraceHomeProducts.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GodGraceHomeProducts.API.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/[controller]")]
public class InventoryController(IInventoryService inventoryService) : ControllerBase
{
    [HttpGet("low-stock")]
    public async Task<IActionResult> LowStock() => Ok(ApiResponse.Ok(await inventoryService.GetLowStockProductsAsync()));
    [HttpPost("update-stock")]
    public async Task<IActionResult> UpdateStock([FromBody] UpdateStockDto request) { await inventoryService.UpdateStockAsync(request); return Ok(ApiResponse.Ok(null, "Stock updated successfully.")); }
    [HttpGet("history/{productId:int}")]
    public async Task<IActionResult> History(int productId) => Ok(ApiResponse.Ok(await inventoryService.GetHistoryAsync(productId)));
}
