using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Products;
using GodGraceHomeProducts.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GodGraceHomeProducts.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IProductService productService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] ProductListQueryDto query) => Ok(ApiResponse.Ok(await productService.GetProductsAsync(query)));

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id) => Ok(ApiResponse.Ok(await productService.GetByIdAsync(id)));

    [HttpGet("slug/{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBySlug(string slug) => Ok(ApiResponse.Ok(await productService.GetBySlugAsync(slug)));

    [HttpGet("category/{categoryId:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByCategory(int categoryId) => Ok(ApiResponse.Ok(await productService.GetByCategoryAsync(categoryId)));

    [HttpGet("best-sellers")]
    [AllowAnonymous]
    public async Task<IActionResult> BestSellers() => Ok(ApiResponse.Ok(await productService.GetBestSellersAsync()));

    [HttpGet("new-arrivals")]
    [AllowAnonymous]
    public async Task<IActionResult> NewArrivals() => Ok(ApiResponse.Ok(await productService.GetNewArrivalsAsync()));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] ProductRequestDto request)
        => Ok(ApiResponse.Ok(await productService.CreateAsync(request), "Product created successfully."));

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] ProductRequestDto request)
        => Ok(ApiResponse.Ok(await productService.UpdateAsync(id, request), "Product updated successfully."));

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await productService.DeleteAsync(id);
        return Ok(ApiResponse.Ok(null, "Product deleted successfully."));
    }
}
