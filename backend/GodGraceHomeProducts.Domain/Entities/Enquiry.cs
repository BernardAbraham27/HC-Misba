using GodGraceHomeProducts.Domain.Common;
using GodGraceHomeProducts.Domain.Enums;

namespace GodGraceHomeProducts.Domain.Entities;

public class Enquiry : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ProductInterested { get; set; } = string.Empty;
    public string Quantity { get; set; } = string.Empty;
    public string? Message { get; set; }
    public EnquiryStatus Status { get; set; } = EnquiryStatus.New;
    public string? AdminRemarks { get; set; }
}
