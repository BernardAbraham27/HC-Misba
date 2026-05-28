using GodGraceHomeProducts.Application.DTOs.Users;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface IUserService
{
    Task<IReadOnlyCollection<UserResponseDto>> GetCustomersAsync();
    Task<UserResponseDto> GetByIdAsync(int requesterId, bool isAdmin, int userId);
    Task<UserResponseDto> UpdateAsync(int requesterId, bool isAdmin, int userId, UpdateUserDto request);
    Task<UserResponseDto> BlockAsync(int userId);
    Task<UserResponseDto> UnblockAsync(int userId);
}
