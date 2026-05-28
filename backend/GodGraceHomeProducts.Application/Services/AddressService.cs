using GodGraceHomeProducts.Application.DTOs.Addresses;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GodGraceHomeProducts.Application.Services;

public class AddressService(IAppDbContext db) : IAddressService
{
    public async Task<IReadOnlyCollection<AddressResponseDto>> GetAsync(int userId)
        => (await db.Addresses.Where(x => x.UserId == userId).OrderByDescending(x => x.IsDefault).ThenByDescending(x => x.CreatedAt).ToListAsync())
            .Select(Map).ToList();

    public async Task<AddressResponseDto> CreateAsync(int userId, AddressRequestDto request)
    {
        if (request.IsDefault) await ResetDefaults(userId);
        var entity = new Address
        {
            UserId = userId,
            FullName = request.FullName.Trim(),
            MobileNumber = request.MobileNumber.Trim(),
            AddressLine1 = request.AddressLine1.Trim(),
            AddressLine2 = request.AddressLine2?.Trim(),
            City = request.City.Trim(),
            State = request.State.Trim(),
            Pincode = request.Pincode.Trim(),
            Landmark = request.Landmark?.Trim(),
            IsDefault = request.IsDefault
        };
        db.Addresses.Add(entity);
        await db.SaveChangesAsync();
        return Map(entity);
    }

    public async Task<AddressResponseDto> UpdateAsync(int userId, int id, AddressRequestDto request)
    {
        var entity = await db.Addresses.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId)
            ?? throw new KeyNotFoundException("Address not found.");
        if (request.IsDefault) await ResetDefaults(userId);
        entity.FullName = request.FullName.Trim();
        entity.MobileNumber = request.MobileNumber.Trim();
        entity.AddressLine1 = request.AddressLine1.Trim();
        entity.AddressLine2 = request.AddressLine2?.Trim();
        entity.City = request.City.Trim();
        entity.State = request.State.Trim();
        entity.Pincode = request.Pincode.Trim();
        entity.Landmark = request.Landmark?.Trim();
        entity.IsDefault = request.IsDefault;
        entity.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return Map(entity);
    }

    public async Task DeleteAsync(int userId, int id)
    {
        var entity = await db.Addresses.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId)
            ?? throw new KeyNotFoundException("Address not found.");
        db.Addresses.Remove(entity);
        await db.SaveChangesAsync();
    }

    public async Task<AddressResponseDto> SetDefaultAsync(int userId, int id)
    {
        var entity = await db.Addresses.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId)
            ?? throw new KeyNotFoundException("Address not found.");
        await ResetDefaults(userId);
        entity.IsDefault = true;
        entity.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return Map(entity);
    }

    private async Task ResetDefaults(int userId)
    {
        var defaults = await db.Addresses.Where(x => x.UserId == userId && x.IsDefault).ToListAsync();
        foreach (var item in defaults)
        {
            item.IsDefault = false;
            item.UpdatedAt = DateTime.UtcNow;
        }
    }

    private static AddressResponseDto Map(Address x) => new()
    {
        Id = x.Id,
        FullName = x.FullName,
        MobileNumber = x.MobileNumber,
        AddressLine1 = x.AddressLine1,
        AddressLine2 = x.AddressLine2,
        City = x.City,
        State = x.State,
        Pincode = x.Pincode,
        Landmark = x.Landmark,
        IsDefault = x.IsDefault
    };
}
