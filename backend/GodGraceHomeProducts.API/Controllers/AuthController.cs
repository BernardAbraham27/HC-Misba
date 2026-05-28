using GodGraceHomeProducts.API.Common;
using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Auth;
using GodGraceHomeProducts.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GodGraceHomeProducts.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        => Ok(ApiResponse.Ok(await authService.RegisterAsync(request), "Customer registered successfully."));

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        => Ok(ApiResponse.Ok(await authService.LoginAsync(request), "Login successful."));

    [HttpPost("admin-login")]
    [AllowAnonymous]
    public async Task<IActionResult> AdminLogin([FromBody] LoginRequestDto request)
        => Ok(ApiResponse.Ok(await authService.AdminLoginAsync(request), "Admin login successful."));

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await authService.LogoutAsync(User.GetUserId());
        return Ok(ApiResponse.Ok(null, "Logout successful."));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
        => Ok(ApiResponse.Ok(await authService.GetCurrentUserAsync(User.GetUserId())));
}
