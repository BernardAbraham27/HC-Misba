using GodGraceHomeProducts.Application.DTOs.Cart;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface ICartService
{
    Task<CartSummaryDto> GetCartAsync(int userId);
    Task<CartSummaryDto> AddToCartAsync(int userId, AddCartItemDto request);
    Task<CartSummaryDto> UpdateCartItemAsync(int userId, UpdateCartItemDto request);
    Task<CartSummaryDto> RemoveCartItemAsync(int userId, int cartItemId);
    Task ClearCartAsync(int userId);
}
