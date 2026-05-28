using GodGraceHomeProducts.Application.Common;
using GodGraceHomeProducts.Application.DTOs.Enquiries;
using GodGraceHomeProducts.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GodGraceHomeProducts.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnquiriesController(IEnquiryService enquiryService) : ControllerBase
{
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Create([FromBody] EnquiryRequestDto request) => Ok(ApiResponse.Ok(await enquiryService.CreateAsync(request), "Enquiry submitted successfully."));
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll() => Ok(ApiResponse.Ok(await enquiryService.GetAllAsync()));
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetById(int id) => Ok(ApiResponse.Ok(await enquiryService.GetByIdAsync(id)));
    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateEnquiryStatusDto request) => Ok(ApiResponse.Ok(await enquiryService.UpdateStatusAsync(id, request), "Enquiry status updated."));
    [HttpPut("{id:int}/remarks")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateRemarks(int id, [FromBody] UpdateEnquiryRemarksDto request) => Ok(ApiResponse.Ok(await enquiryService.UpdateRemarksAsync(id, request), "Enquiry remarks updated."));
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id) { await enquiryService.DeleteAsync(id); return Ok(ApiResponse.Ok(null, "Enquiry deleted successfully.")); }
}
