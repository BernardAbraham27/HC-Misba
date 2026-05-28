using GodGraceHomeProducts.Application.DTOs.Enquiries;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GodGraceHomeProducts.Application.Services;

public class EnquiryService(IAppDbContext db) : IEnquiryService
{
    public async Task<EnquiryResponseDto> CreateAsync(EnquiryRequestDto request)
    {
        var entity = new Enquiry
        {
            Name = request.Name.Trim(),
            MobileNumber = request.MobileNumber.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            ProductInterested = request.ProductInterested.Trim(),
            Quantity = request.Quantity.Trim(),
            Message = request.Message?.Trim()
        };
        db.Enquiries.Add(entity);
        await db.SaveChangesAsync();
        return Map(entity);
    }

    public async Task<IReadOnlyCollection<EnquiryResponseDto>> GetAllAsync()
        => (await db.Enquiries.OrderByDescending(x => x.CreatedAt).ToListAsync()).Select(Map).ToList();

    public async Task<EnquiryResponseDto> GetByIdAsync(int id)
        => Map(await db.Enquiries.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Enquiry not found."));

    public async Task<EnquiryResponseDto> UpdateStatusAsync(int id, UpdateEnquiryStatusDto request)
    {
        var entity = await db.Enquiries.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Enquiry not found.");
        entity.Status = request.Status;
        entity.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return Map(entity);
    }

    public async Task<EnquiryResponseDto> UpdateRemarksAsync(int id, UpdateEnquiryRemarksDto request)
    {
        var entity = await db.Enquiries.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Enquiry not found.");
        entity.AdminRemarks = request.Remarks.Trim();
        entity.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return Map(entity);
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await db.Enquiries.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Enquiry not found.");
        db.Enquiries.Remove(entity);
        await db.SaveChangesAsync();
    }

    private static EnquiryResponseDto Map(Enquiry x) => new()
    {
        Id = x.Id,
        Name = x.Name,
        MobileNumber = x.MobileNumber,
        Email = x.Email,
        ProductInterested = x.ProductInterested,
        Quantity = x.Quantity,
        Message = x.Message,
        Status = x.Status,
        AdminRemarks = x.AdminRemarks,
        CreatedAt = x.CreatedAt
    };
}
