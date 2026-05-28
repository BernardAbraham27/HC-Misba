using GodGraceHomeProducts.API.Common;
using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Users;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GodGraceHomeProducts.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UsersController(IUserService userService) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll() => Ok(ApiResponse.Ok(await userService.GetCustomersAsync()));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
        => Ok(ApiResponse.Ok(await userService.GetByIdAsync(User.GetUserId(), User.IsInRole(UserRole.Admin.ToString()), id)));

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto request)
        => Ok(ApiResponse.Ok(await userService.UpdateAsync(User.GetUserId(), User.IsInRole(UserRole.Admin.ToString()), id, request), "Profile updated successfully."));

    [HttpPut("{id:int}/block")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Block(int id)
        => Ok(ApiResponse.Ok(await userService.BlockAsync(id), "Customer blocked successfully."));

    [HttpPut("{id:int}/unblock")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Unblock(int id)
        => Ok(ApiResponse.Ok(await userService.UnblockAsync(id), "Customer unblocked successfully."));
}
