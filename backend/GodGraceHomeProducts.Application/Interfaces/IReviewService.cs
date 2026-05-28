using GodGraceHomeProducts.Application.DTOs.Reviews;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface IReviewService
{
    Task<IReadOnlyCollection<ReviewResponseDto>> GetByProductAsync(int productId);
    Task AddAsync(int userId, ReviewRequestDto request);
    Task DeleteAsync(int id);
}
