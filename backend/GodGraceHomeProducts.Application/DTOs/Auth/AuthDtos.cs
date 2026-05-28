using System.ComponentModel.DataAnnotations;
using GodGraceHomeProducts.Domain.Enums;

namespace GodGraceHomeProducts.Application.DTOs.Auth;

public class RegisterRequestDto
{
    [Required, MaxLength(120)]
    public string FullName { get; set; } = string.Empty;
    [EmailAddress]
    public string? Email { get; set; }
    [RegularExpression(@"^\d{10,15}$")]
    public string? MobileNumber { get; set; }
    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;
    [Required, Compare(nameof(Password))]
    public string ConfirmPassword { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Pincode { get; set; }
}

public class LoginRequestDto
{
    public string? Email { get; set; }
    public string? EmailOrMobile { get; set; }
    [Required]
    public string Password { get; set; } = string.Empty;
}

public class UserProfileDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsBlocked { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Pincode { get; set; }
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserProfileDto User { get; set; } = new();
}
