using GodGraceHomeProducts.API.Common;
using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Cart;
using GodGraceHomeProducts.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GodGraceHomeProducts.API.Controllers;

[ApiController]
[Authorize(Roles = "Customer")]
[Route("api/[controller]")]
public class CartController(ICartService cartService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get() => Ok(ApiResponse.Ok(await cartService.GetCartAsync(User.GetUserId())));
    [HttpPost]
    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] AddCartItemDto request) => Ok(ApiResponse.Ok(await cartService.AddToCartAsync(User.GetUserId(), request), "Product added to cart."));
    [HttpPut("{cartItemId:int}")]
    public async Task<IActionResult> UpdateRest(int cartItemId, [FromBody] UpdateCartItemDto request)
    {
        request.CartItemId = cartItemId;
        return Ok(ApiResponse.Ok(await cartService.UpdateCartItemAsync(User.GetUserId(), request), "Cart updated."));
    }
    [HttpPut("update")]
    public async Task<IActionResult> Update([FromBody] UpdateCartItemDto request) => Ok(ApiResponse.Ok(await cartService.UpdateCartItemAsync(User.GetUserId(), request), "Cart updated."));
    [HttpDelete("{cartItemId:int}")]
    public async Task<IActionResult> RemoveRest(int cartItemId) => Ok(ApiResponse.Ok(await cartService.RemoveCartItemAsync(User.GetUserId(), cartItemId), "Cart item removed."));
    [HttpDelete("remove/{cartItemId:int}")]
    public async Task<IActionResult> Remove(int cartItemId) => Ok(ApiResponse.Ok(await cartService.RemoveCartItemAsync(User.GetUserId(), cartItemId), "Cart item removed."));
    [HttpDelete("clear")]
    public async Task<IActionResult> Clear() { await cartService.ClearCartAsync(User.GetUserId()); return Ok(ApiResponse.Ok(null, "Cart cleared.")); }
}
