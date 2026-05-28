using GodGraceHomeProducts.Application.DTOs.Coupons;
using GodGraceHomeProducts.Domain.Entities;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface ICouponService
{
    Task<IReadOnlyCollection<CouponResponseDto>> GetAllAsync();
    Task<CouponResponseDto> CreateAsync(CouponRequestDto request);
    Task<CouponResponseDto> UpdateAsync(int id, CouponRequestDto request);
    Task DeleteAsync(int id);
    Task<decimal> ValidateAsync(CouponValidateDto request);
    Task<Coupon> GetValidCouponAsync(string code, decimal orderAmount);
    decimal CalculateDiscount(Coupon coupon, decimal amount);
}
