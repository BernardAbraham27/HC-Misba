using System.ComponentModel.DataAnnotations;
using GodGraceHomeProducts.Domain.Enums;

namespace GodGraceHomeProducts.Application.DTOs.Users;

public class UpdateUserDto
{
    [Required] public string FullName { get; set; } = string.Empty;
    [Required, RegularExpression(@"^\d{10,15}$")] public string MobileNumber { get; set; } = string.Empty;
}

public class UserResponseDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsBlocked { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
