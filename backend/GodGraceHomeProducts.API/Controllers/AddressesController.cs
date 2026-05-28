using GodGraceHomeProducts.API.Common;
using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Addresses;
using GodGraceHomeProducts.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GodGraceHomeProducts.API.Controllers;

[ApiController]
[Authorize(Roles = "Customer")]
[Route("api/[controller]")]
public class AddressesController(IAddressService addressService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get() => Ok(ApiResponse.Ok(await addressService.GetAsync(User.GetUserId())));
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AddressRequestDto request) => Ok(ApiResponse.Ok(await addressService.CreateAsync(User.GetUserId(), request), "Address added successfully."));
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] AddressRequestDto request) => Ok(ApiResponse.Ok(await addressService.UpdateAsync(User.GetUserId(), id, request), "Address updated successfully."));
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id) { await addressService.DeleteAsync(User.GetUserId(), id); return Ok(ApiResponse.Ok(null, "Address deleted successfully.")); }
    [HttpPut("{id:int}/default")]
    public async Task<IActionResult> SetDefault(int id) => Ok(ApiResponse.Ok(await addressService.SetDefaultAsync(User.GetUserId(), id), "Default address updated successfully."));
}
