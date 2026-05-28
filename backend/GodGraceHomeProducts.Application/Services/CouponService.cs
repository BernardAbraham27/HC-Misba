using GodGraceHomeProducts.Application.DTOs.Coupons;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Entities;
using GodGraceHomeProducts.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace GodGraceHomeProducts.Application.Services;

public class CouponService(IAppDbContext db) : ICouponService
{
    public async Task<IReadOnlyCollection<CouponResponseDto>> GetAllAsync()
        => (await db.Coupons.OrderByDescending(x => x.CreatedAt).ToListAsync()).Select(Map).ToList();

    public async Task<CouponResponseDto> CreateAsync(CouponRequestDto request)
    {
        var code = request.Code.Trim().ToUpperInvariant();
        if (await db.Coupons.AnyAsync(x => x.Code == code))
            throw new InvalidOperationException("Coupon code already exists.");
        var coupon = new Coupon
        {
            Code = code,
            DiscountType = request.DiscountType,
            DiscountValue = request.DiscountValue,
            MinimumOrderAmount = request.MinimumOrderAmount,
            ExpiryDate = request.ExpiryDate.ToUniversalTime(),
            IsActive = request.IsActive
        };
        db.Coupons.Add(coupon);
        await db.SaveChangesAsync();
        return Map(coupon);
    }

    public async Task<CouponResponseDto> UpdateAsync(int id, CouponRequestDto request)
    {
        var coupon = await db.Coupons.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Coupon not found.");
        var code = request.Code.Trim().ToUpperInvariant();
        if (await db.Coupons.AnyAsync(x => x.Id != id && x.Code == code))
            throw new InvalidOperationException("Coupon code already exists.");
        coupon.Code = code;
        coupon.DiscountType = request.DiscountType;
        coupon.DiscountValue = request.DiscountValue;
        coupon.MinimumOrderAmount = request.MinimumOrderAmount;
        coupon.ExpiryDate = request.ExpiryDate.ToUniversalTime();
        coupon.IsActive = request.IsActive;
        coupon.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return Map(coupon);
    }

    public async Task DeleteAsync(int id)
    {
        var coupon = await db.Coupons.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException("Coupon not found.");
        db.Coupons.Remove(coupon);
        await db.SaveChangesAsync();
    }

    public async Task<decimal> ValidateAsync(CouponValidateDto request)
    {
        var coupon = await GetValidCouponAsync(request.Code, request.OrderAmount);
        return CalculateDiscount(coupon, request.OrderAmount);
    }

    public async Task<Coupon> GetValidCouponAsync(string code, decimal orderAmount)
    {
        var coupon = await db.Coupons.FirstOrDefaultAsync(x => x.Code == code.Trim().ToUpperInvariant())
            ?? throw new InvalidOperationException("Coupon not found.");
        if (!coupon.IsActive || coupon.ExpiryDate < DateTime.UtcNow)
            throw new InvalidOperationException("Coupon is inactive or expired.");
        if (orderAmount < coupon.MinimumOrderAmount)
            throw new InvalidOperationException($"Minimum order amount for this coupon is {coupon.MinimumOrderAmount}.");
        return coupon;
    }

    public decimal CalculateDiscount(Coupon coupon, decimal amount)
        => coupon.DiscountType == DiscountType.Percentage
            ? Math.Round(amount * coupon.DiscountValue / 100m, 2)
            : Math.Min(coupon.DiscountValue, amount);

    private static CouponResponseDto Map(Coupon x) => new()
    {
        Id = x.Id,
        Code = x.Code,
        DiscountType = x.DiscountType,
        DiscountValue = x.DiscountValue,
        MinimumOrderAmount = x.MinimumOrderAmount,
        ExpiryDate = x.ExpiryDate,
        IsActive = x.IsActive
    };
}
