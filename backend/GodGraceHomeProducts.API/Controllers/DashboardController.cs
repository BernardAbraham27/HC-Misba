using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GodGraceHomeProducts.API.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/dashboard")]
public class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    [HttpGet("admin")]
    public async Task<IActionResult> Admin() => Ok(ApiResponse.Ok(await dashboardService.GetAdminDashboardAsync()));
}
