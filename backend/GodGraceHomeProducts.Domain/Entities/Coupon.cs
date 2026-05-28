using GodGraceHomeProducts.Domain.Common;
using GodGraceHomeProducts.Domain.Enums;

namespace GodGraceHomeProducts.Domain.Entities;

public class Coupon : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public DiscountType DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal MinimumOrderAmount { get; set; }
    public DateTime ExpiryDate { get; set; }
    public bool IsActive { get; set; } = true;
}
