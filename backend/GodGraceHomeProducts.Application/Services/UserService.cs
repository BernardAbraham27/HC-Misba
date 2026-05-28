using GodGraceHomeProducts.Application.DTOs.Users;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Entities;
using GodGraceHomeProducts.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace GodGraceHomeProducts.Application.Services;

public class UserService(IAppDbContext db) : IUserService
{
    public async Task<IReadOnlyCollection<UserResponseDto>> GetCustomersAsync()
        => (await db.Users.Where(x => x.Role == UserRole.Customer).OrderByDescending(x => x.CreatedAt).ToListAsync())
            .Select(Map).ToList();

    public async Task<UserResponseDto> GetByIdAsync(int requesterId, bool isAdmin, int userId)
    {
        if (!isAdmin && requesterId != userId)
        {
            throw new UnauthorizedAccessException("You do not have permission to view this user.");
        }

        var user = await db.Users.FirstOrDefaultAsync(x => x.Id == userId)
            ?? throw new KeyNotFoundException("User not found.");
        return Map(user);
    }

    public async Task<UserResponseDto> UpdateAsync(int requesterId, bool isAdmin, int userId, UpdateUserDto request)
    {
        if (!isAdmin && requesterId != userId)
        {
            throw new UnauthorizedAccessException("You do not have permission to update this user.");
        }

        var user = await db.Users.FirstOrDefaultAsync(x => x.Id == userId)
            ?? throw new KeyNotFoundException("User not found.");
        user.FullName = request.FullName.Trim();
        user.MobileNumber = request.MobileNumber.Trim();
        user.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return Map(user);
    }

    public async Task<UserResponseDto> BlockAsync(int userId)
    {
        var user = await db.Users.FirstOrDefaultAsync(x => x.Id == userId)
            ?? throw new KeyNotFoundException("User not found.");
        user.IsBlocked = true;
        user.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return Map(user);
    }

    public async Task<UserResponseDto> UnblockAsync(int userId)
    {
        var user = await db.Users.FirstOrDefaultAsync(x => x.Id == userId)
            ?? throw new KeyNotFoundException("User not found.");
        user.IsBlocked = false;
        user.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return Map(user);
    }

    private static UserResponseDto Map(User user) => new()
    {
        Id = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        MobileNumber = user.MobileNumber,
        Role = user.Role,
        IsBlocked = user.IsBlocked,
        IsActive = user.IsActive,
        CreatedAt = user.CreatedAt
    };
}
