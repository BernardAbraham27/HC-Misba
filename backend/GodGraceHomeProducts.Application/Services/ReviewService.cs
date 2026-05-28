using GodGraceHomeProducts.Application.DTOs.Reviews;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Entities;
using GodGraceHomeProducts.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace GodGraceHomeProducts.Application.Services;

public class ReviewService(IAppDbContext db) : IReviewService
{
    public async Task<IReadOnlyCollection<ReviewResponseDto>> GetByProductAsync(int productId)
        => await db.Reviews.Include(x => x.User).Where(x => x.ProductId == productId).OrderByDescending(x => x.CreatedAt)
            .Select(x => new ReviewResponseDto
            {
                Id = x.Id,
                ProductId = x.ProductId,
                CustomerName = x.User!.FullName,
                Rating = x.Rating,
                Comment = x.Comment,
                CreatedAt = x.CreatedAt
            }).ToListAsync();

    public async Task AddAsync(int userId, ReviewRequestDto request)
    {
        var hasPurchased = await db.OrderItems.Include(x => x.Order).AnyAsync(x =>
            x.ProductId == request.ProductId && x.Order!.UserId == userId && x.Order.Status != OrderStatus.Cancelled);
        if (!hasPurchased) throw new InvalidOperationException("You can review a product only after purchase.");
        db.Reviews.Add(new Review
        {
            UserId = userId,
            ProductId = request.ProductId,
            Rating = request.Rating,
            Comment = request.Comment.Trim()
        });
        await db.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var review = await db.Reviews.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Review not found.");
        db.Reviews.Remove(review);
        await db.SaveChangesAsync();
    }
}
