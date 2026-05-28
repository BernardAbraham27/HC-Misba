using GodGraceHomeProducts.Application.DTOs.Cart;
using GodGraceHomeProducts.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GodGraceHomeProducts.Application.Services;

public class CartService(IAppDbContext db) : ICartService
{
    public async Task<CartSummaryDto> GetCartAsync(int userId)
        => Build(await db.CartItems.Include(x => x.Product).Where(x => x.UserId == userId).ToListAsync());

    public async Task<CartSummaryDto> AddToCartAsync(int userId, AddCartItemDto request)
    {
        var product = await db.Products.Include(x => x.Sizes).FirstOrDefaultAsync(x => x.Id == request.ProductId && x.IsActive && !x.IsDeleted)
            ?? throw new KeyNotFoundException("Product not found.");
        if (product.StockQuantity < request.Quantity) throw new InvalidOperationException("Requested quantity is not available in stock.");
        if (!product.Sizes.Any(x => x.Size == request.Size)) throw new InvalidOperationException("Selected size is not available.");

        var existing = await db.CartItems.FirstOrDefaultAsync(x => x.UserId == userId && x.ProductId == request.ProductId && x.Size == request.Size);
        if (existing is null)
            db.CartItems.Add(new Domain.Entities.CartItem { UserId = userId, ProductId = request.ProductId, Size = request.Size.Trim(), Quantity = request.Quantity });
        else
        {
            if (product.StockQuantity < existing.Quantity + request.Quantity) throw new InvalidOperationException("Requested quantity exceeds available stock.");
            existing.Quantity += request.Quantity;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        await db.SaveChangesAsync();
        return await GetCartAsync(userId);
    }

    public async Task<CartSummaryDto> UpdateCartItemAsync(int userId, UpdateCartItemDto request)
    {
        var item = await db.CartItems.Include(x => x.Product).FirstOrDefaultAsync(x => x.Id == request.CartItemId && x.UserId == userId)
            ?? throw new KeyNotFoundException("Cart item not found.");
        if (item.Product is null || item.Product.StockQuantity < request.Quantity) throw new InvalidOperationException("Requested quantity is not available in stock.");
        item.Quantity = request.Quantity;
        item.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return await GetCartAsync(userId);
    }

    public async Task<CartSummaryDto> RemoveCartItemAsync(int userId, int cartItemId)
    {
        var item = await db.CartItems.FirstOrDefaultAsync(x => x.Id == cartItemId && x.UserId == userId)
            ?? throw new KeyNotFoundException("Cart item not found.");
        db.CartItems.Remove(item);
        await db.SaveChangesAsync();
        return await GetCartAsync(userId);
    }

    public async Task ClearCartAsync(int userId)
    {
        var items = await db.CartItems.Where(x => x.UserId == userId).ToListAsync();
        db.CartItems.RemoveRange(items);
        await db.SaveChangesAsync();
    }

    private static CartSummaryDto Build(IEnumerable<Domain.Entities.CartItem> items)
    {
        var mapped = items.Select(x =>
        {
            var unit = x.Product?.DiscountPrice ?? x.Product?.Price ?? 0m;
            return new CartItemDto
            {
                CartItemId = x.Id,
                ProductId = x.ProductId,
                ProductName = x.Product?.Name ?? string.Empty,
                ImageUrl = x.Product?.ImageUrl ?? string.Empty,
                Size = x.Size,
                Quantity = x.Quantity,
                UnitPrice = unit,
                TotalPrice = unit * x.Quantity
            };
        }).ToList();

        var subtotal = mapped.Sum(x => x.TotalPrice);
        var delivery = subtotal >= 500 || subtotal == 0 ? 0m : 50m;
        return new CartSummaryDto { Items = mapped, Subtotal = subtotal, DeliveryCharge = delivery, Discount = 0m, GrandTotal = subtotal + delivery };
    }
}
