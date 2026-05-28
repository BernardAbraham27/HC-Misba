using GodGraceHomeProducts.Application.DTOs.Wishlist;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GodGraceHomeProducts.Application.Services;

public class WishlistService(IAppDbContext db) : IWishlistService
{
    public async Task<IReadOnlyCollection<WishlistItemDto>> GetAsync(int userId)
        => await db.WishlistItems.Include(x => x.Product).Where(x => x.UserId == userId).OrderByDescending(x => x.CreatedAt)
            .Select(x => new WishlistItemDto
            {
                Id = x.Id,
                ProductId = x.ProductId,
                ProductName = x.Product!.Name,
                ImageUrl = x.Product.ImageUrl,
                Price = x.Product.Price,
                DiscountPrice = x.Product.DiscountPrice
            }).ToListAsync();

    public async Task AddAsync(int userId, AddWishlistItemDto request)
    {
        var exists = await db.WishlistItems.AnyAsync(x => x.UserId == userId && x.ProductId == request.ProductId);
        if (exists) return;
        if (!await db.Products.AnyAsync(x => x.Id == request.ProductId && x.IsActive && !x.IsDeleted))
            throw new KeyNotFoundException("Product not found.");
        db.WishlistItems.Add(new WishlistItem { UserId = userId, ProductId = request.ProductId });
        await db.SaveChangesAsync();
    }

    public async Task RemoveAsync(int userId, int productId)
    {
        var item = await db.WishlistItems.FirstOrDefaultAsync(x => x.UserId == userId && x.ProductId == productId)
            ?? throw new KeyNotFoundException("Wishlist item not found.");
        db.WishlistItems.Remove(item);
        await db.SaveChangesAsync();
    }
}
