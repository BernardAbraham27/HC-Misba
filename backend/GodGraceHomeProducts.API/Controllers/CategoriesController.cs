using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Categories;
using GodGraceHomeProducts.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GodGraceHomeProducts.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(ICategoryService categoryService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll() => Ok(ApiResponse.Ok(await categoryService.GetAllAsync()));

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id) => Ok(ApiResponse.Ok(await categoryService.GetByIdAsync(id)));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CategoryRequestDto request)
        => Ok(ApiResponse.Ok(await categoryService.CreateAsync(request), "Category created successfully."));

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] CategoryRequestDto request)
        => Ok(ApiResponse.Ok(await categoryService.UpdateAsync(id, request), "Category updated successfully."));

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await categoryService.DeleteAsync(id);
        return Ok(ApiResponse.Ok(null, "Category deleted successfully."));
    }
}
