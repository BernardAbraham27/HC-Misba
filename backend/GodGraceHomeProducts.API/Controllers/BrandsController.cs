using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Brands;
using GodGraceHomeProducts.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GodGraceHomeProducts.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandsController(IBrandService brandService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll() => Ok(ApiResponse.Ok(await brandService.GetAllAsync()));

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id) => Ok(ApiResponse.Ok(await brandService.GetByIdAsync(id)));

    [HttpGet("slug/{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBySlug(string slug) => Ok(ApiResponse.Ok(await brandService.GetBySlugAsync(slug)));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] BrandRequestDto request)
        => Ok(ApiResponse.Ok(await brandService.CreateAsync(request), "Brand created successfully."));

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] BrandRequestDto request)
        => Ok(ApiResponse.Ok(await brandService.UpdateAsync(id, request), "Brand updated successfully."));

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await brandService.DeleteAsync(id);
        return Ok(ApiResponse.Ok(null, "Brand deleted successfully."));
    }
}
