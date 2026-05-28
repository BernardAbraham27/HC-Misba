using System.ComponentModel.DataAnnotations;
using GodGraceHomeProducts.Domain.Enums;

namespace GodGraceHomeProducts.Application.DTOs.Enquiries;

public class EnquiryRequestDto
{
    [Required] public string Name { get; set; } = string.Empty;
    [Required, RegularExpression(@"^\d{10,15}$")] public string MobileNumber { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    [Required] public string ProductInterested { get; set; } = string.Empty;
    [Required] public string Quantity { get; set; } = string.Empty;
    public string? Message { get; set; }
}

public class UpdateEnquiryStatusDto
{
    [Required] public EnquiryStatus Status { get; set; }
}

public class UpdateEnquiryRemarksDto
{
    [Required] public string Remarks { get; set; } = string.Empty;
}

public class EnquiryResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ProductInterested { get; set; } = string.Empty;
    public string Quantity { get; set; } = string.Empty;
    public string? Message { get; set; }
    public EnquiryStatus Status { get; set; }
    public string? AdminRemarks { get; set; }
    public DateTime CreatedAt { get; set; }
}
