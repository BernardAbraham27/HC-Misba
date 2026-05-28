using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Reviews;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.API.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GodGraceHomeProducts.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController(IReviewService reviewService) : ControllerBase
{
    [HttpGet("product/{productId:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> ByProduct(int productId) => Ok(ApiResponse.Ok(await reviewService.GetByProductAsync(productId)));
    [HttpPost]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> Create([FromBody] ReviewRequestDto request) { await reviewService.AddAsync(User.GetUserId(), request); return Ok(ApiResponse.Ok(null, "Review added successfully.")); }
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id) { await reviewService.DeleteAsync(id); return Ok(ApiResponse.Ok(null, "Review deleted successfully.")); }
}
