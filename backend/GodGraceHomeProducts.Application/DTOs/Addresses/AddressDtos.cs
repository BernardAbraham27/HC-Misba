using System.ComponentModel.DataAnnotations;

namespace GodGraceHomeProducts.Application.DTOs.Addresses;

public class AddressRequestDto
{
    [Required] public string FullName { get; set; } = string.Empty;
    [Required, RegularExpression(@"^\d{10,15}$")] public string MobileNumber { get; set; } = string.Empty;
    [Required] public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    [Required] public string City { get; set; } = string.Empty;
    [Required] public string State { get; set; } = string.Empty;
    [Required] public string Pincode { get; set; } = string.Empty;
    public string? Landmark { get; set; }
    public bool IsDefault { get; set; }
}

public class AddressResponseDto : AddressRequestDto
{
    public int Id { get; set; }
}
