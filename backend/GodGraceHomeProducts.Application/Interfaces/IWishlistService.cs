using GodGraceHomeProducts.Application.DTOs.Wishlist;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface IWishlistService
{
    Task<IReadOnlyCollection<WishlistItemDto>> GetAsync(int userId);
    Task AddAsync(int userId, AddWishlistItemDto request);
    Task RemoveAsync(int userId, int productId);
}
