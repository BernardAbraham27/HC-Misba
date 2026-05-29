using GodGraceHomeProducts.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface IAppDbContext
{
    DbSet<User> Users { get; }
    DbSet<Brand> Brands { get; }
    DbSet<BrandTypeMaster> BrandTypes { get; }
    DbSet<Category> Categories { get; }
    DbSet<Product> Products { get; }
    DbSet<ProductSize> ProductSizes { get; }
    DbSet<ProductSizeMaster> ProductSizeMasters { get; }
    DbSet<ProductStatusMaster> ProductStatuses { get; }
    DbSet<ProductBenefit> ProductBenefits { get; }
    DbSet<CartItem> CartItems { get; }
    DbSet<WishlistItem> WishlistItems { get; }
    DbSet<Address> Addresses { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<Payment> Payments { get; }
    DbSet<Coupon> Coupons { get; }
    DbSet<CouponStatusMaster> CouponStatuses { get; }
    DbSet<Enquiry> Enquiries { get; }
    DbSet<EnquiryStatusMaster> EnquiryStatuses { get; }
    DbSet<Review> Reviews { get; }
    DbSet<InventoryTransaction> InventoryTransactions { get; }
    DbSet<OrderStatusMaster> OrderStatuses { get; }
    DbSet<PaymentStatusMaster> PaymentStatuses { get; }
    DbSet<CustomerStatusMaster> CustomerStatuses { get; }
    DbSet<InventoryStatusMaster> InventoryStatuses { get; }
    DbSet<UserRoleMaster> UserRoles { get; }
    DatabaseFacade Database { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
