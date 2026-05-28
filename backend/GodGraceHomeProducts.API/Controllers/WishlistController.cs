using GodGraceHomeProducts.API.Common;
using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Wishlist;
using GodGraceHomeProducts.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GodGraceHomeProducts.API.Controllers;

[ApiController]
[Authorize(Roles = "Customer")]
[Route("api/[controller]")]
public class WishlistController(IWishlistService wishlistService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get() => Ok(ApiResponse.Ok(await wishlistService.GetAsync(User.GetUserId())));
    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] AddWishlistItemDto request) { await wishlistService.AddAsync(User.GetUserId(), request); return Ok(ApiResponse.Ok(null, "Product added to wishlist.")); }
    [HttpDelete("remove/{productId:int}")]
    public async Task<IActionResult> Remove(int productId) { await wishlistService.RemoveAsync(User.GetUserId(), productId); return Ok(ApiResponse.Ok(null, "Wishlist item removed.")); }
}
