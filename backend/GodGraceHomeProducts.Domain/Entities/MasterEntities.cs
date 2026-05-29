using GodGraceHomeProducts.Domain.Common;

namespace GodGraceHomeProducts.Domain.Entities;

public abstract class MasterValueBase : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public abstract class DisplayOrderedMasterValueBase : MasterValueBase
{
    public int DisplayOrder { get; set; }
}

public class BrandTypeMaster : MasterValueBase
{
    public ICollection<Brand> Brands { get; set; } = new List<Brand>();
}

public class ProductSizeMaster : MasterValueBase
{
    public string Unit { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public ICollection<Product> Products { get; set; } = new List<Product>();
}

public class ProductStatusMaster : MasterValueBase
{
    public ICollection<Product> Products { get; set; } = new List<Product>();
}

public class OrderStatusMaster : DisplayOrderedMasterValueBase
{
}

public class PaymentStatusMaster : MasterValueBase
{
}

public class CustomerStatusMaster : MasterValueBase
{
}

public class CouponStatusMaster : MasterValueBase
{
}

public class InventoryStatusMaster : MasterValueBase
{
}

public class EnquiryStatusMaster : MasterValueBase
{
}

public class UserRoleMaster : MasterValueBase
{
}
