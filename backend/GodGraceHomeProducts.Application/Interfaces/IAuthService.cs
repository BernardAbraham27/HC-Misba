using GodGraceHomeProducts.Application.DTOs.Auth;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
    Task<AuthResponseDto> AdminLoginAsync(LoginRequestDto request);
    Task LogoutAsync(int userId);
    Task<UserProfileDto> GetCurrentUserAsync(int userId);
}
