using System.ComponentModel.DataAnnotations;
using GodGraceHomeProducts.Domain.Enums;

namespace GodGraceHomeProducts.Application.DTOs.Coupons;

public class CouponRequestDto
{
    [Required] public string Code { get; set; } = string.Empty;
    [Required] public DiscountType DiscountType { get; set; }
    [Range(0, 999999)] public decimal DiscountValue { get; set; }
    [Range(0, 999999)] public decimal MinimumOrderAmount { get; set; }
    public DateTime ExpiryDate { get; set; }
    public bool IsActive { get; set; } = true;
}

public class CouponValidateDto
{
    [Required] public string Code { get; set; } = string.Empty;
    [Range(0, 999999)] public decimal OrderAmount { get; set; }
}

public class CouponResponseDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public DiscountType DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal MinimumOrderAmount { get; set; }
    public DateTime ExpiryDate { get; set; }
    public bool IsActive { get; set; }
}
