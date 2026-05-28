using GodGraceHomeProducts.Application.DTOs.Auth;
using GodGraceHomeProducts.Application.Helpers;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Entities;
using GodGraceHomeProducts.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace GodGraceHomeProducts.Application.Services;

public class AuthService(IAppDbContext db, PasswordHasher hasher, JwtHelper jwtHelper) : IAuthService
{
    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        var email = request.Email?.Trim().ToLowerInvariant();
        var mobileNumber = request.MobileNumber?.Trim();

        if (string.IsNullOrWhiteSpace(email) && string.IsNullOrWhiteSpace(mobileNumber))
        {
            throw new InvalidOperationException("Email or mobile number is required.");
        }

        if (!string.IsNullOrWhiteSpace(email) && await db.Users.AnyAsync(x => x.Email == email))
        {
            throw new InvalidOperationException("Email is already registered.");
        }

        if (!string.IsNullOrWhiteSpace(mobileNumber) && await db.Users.AnyAsync(x => x.MobileNumber == mobileNumber))
        {
            throw new InvalidOperationException("Mobile number is already registered.");
        }

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = email ?? string.Empty,
            MobileNumber = mobileNumber ?? string.Empty,
            PasswordHash = hasher.Hash(request.Password),
            Role = UserRole.Customer
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        if (!string.IsNullOrWhiteSpace(request.Address) &&
            !string.IsNullOrWhiteSpace(request.City) &&
            !string.IsNullOrWhiteSpace(request.Pincode))
        {
            db.Addresses.Add(new Address
            {
                UserId = user.Id,
                FullName = user.FullName,
                MobileNumber = user.MobileNumber,
                AddressLine1 = request.Address.Trim(),
                City = request.City.Trim(),
                State = request.City.Trim(),
                Pincode = request.Pincode.Trim(),
                IsDefault = true
            });

            await db.SaveChangesAsync();
        }

        return new AuthResponseDto { Token = jwtHelper.GenerateToken(user), User = MapUser(user) };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await FindUserAsync(request.EmailOrMobile ?? request.Email ?? string.Empty);
        ValidateUserState(user);

        if (user.Role != UserRole.Customer)
        {
            throw new InvalidOperationException("Use admin login for admin accounts.");
        }

        ValidatePassword(user, request.Password);
        return new AuthResponseDto { Token = jwtHelper.GenerateToken(user), User = MapUser(user) };
    }

    public async Task<AuthResponseDto> AdminLoginAsync(LoginRequestDto request)
    {
        var user = await FindUserAsync(request.EmailOrMobile ?? request.Email ?? string.Empty);
        ValidateUserState(user);

        if (user.Role != UserRole.Admin)
        {
            throw new InvalidOperationException("This account does not have admin access.");
        }

        ValidatePassword(user, request.Password);
        return new AuthResponseDto { Token = jwtHelper.GenerateToken(user), User = MapUser(user) };
    }

    public Task LogoutAsync(int userId)
        => Task.CompletedTask;

    private async Task<User> FindUserAsync(string emailOrMobile)
    {
        var lookup = emailOrMobile.Trim().ToLowerInvariant();
        var user = await db.Users.FirstOrDefaultAsync(x =>
            x.Email.ToLower() == lookup || x.MobileNumber == emailOrMobile.Trim());

        if (user is null)
        {
            throw new InvalidOperationException("Invalid email or password.");
        }

        return user;
    }

    private void ValidateUserState(User user)
    {
        if (user.IsBlocked || !user.IsActive)
        {
            throw new InvalidOperationException("Your account is blocked or inactive.");
        }
    }

    private void ValidatePassword(User user, string password)
    {
        if (!hasher.Verify(user.PasswordHash, password))
        {
            throw new InvalidOperationException("Invalid email or password.");
        }
    }

    public async Task<UserProfileDto> GetCurrentUserAsync(int userId)
    {
        var user = await db.Users
            .Include(x => x.Addresses)
            .FirstOrDefaultAsync(x => x.Id == userId)
            ?? throw new KeyNotFoundException("User not found.");
        return MapUser(user);
    }

    private static UserProfileDto MapUser(User user)
    {
        var defaultAddress = user.Addresses?.FirstOrDefault(x => x.IsDefault) ?? user.Addresses?.FirstOrDefault();

        return new UserProfileDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            MobileNumber = user.MobileNumber,
            Role = user.Role,
            IsBlocked = user.IsBlocked,
            Address = defaultAddress?.AddressLine1,
            City = defaultAddress?.City,
            Pincode = defaultAddress?.Pincode
        };
    }
}
