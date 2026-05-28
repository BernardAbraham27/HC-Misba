using GodGraceHomeProducts.Domain.Common;

namespace GodGraceHomeProducts.Domain.Entities;

public class Address : BaseEntity
{
    public int UserId { get; set; }
    public User? User { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public string? Landmark { get; set; }
    public bool IsDefault { get; set; }
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
