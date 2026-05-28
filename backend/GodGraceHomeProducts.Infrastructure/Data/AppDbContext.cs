using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GodGraceHomeProducts.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options), IAppDbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductSize> ProductSizes => Set<ProductSize>();
    public DbSet<ProductBenefit> ProductBenefits => Set<ProductBenefit>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<Enquiry> Enquiries => Set<Enquiry>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<InventoryTransaction> InventoryTransactions => Set<InventoryTransaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(x => x.Email).IsUnique();
        modelBuilder.Entity<Brand>().HasIndex(x => x.Slug).IsUnique();
        modelBuilder.Entity<Category>().HasIndex(x => x.Slug).IsUnique();
        modelBuilder.Entity<Product>().HasIndex(x => x.Slug).IsUnique();
        modelBuilder.Entity<Coupon>().HasIndex(x => x.Code).IsUnique();
        modelBuilder.Entity<Order>().HasIndex(x => x.OrderNumber).IsUnique();

        modelBuilder.Entity<Product>().Property(x => x.Price).HasColumnType("numeric(18,2)");
        modelBuilder.Entity<Product>().Property(x => x.DiscountPrice).HasColumnType("numeric(18,2)");
        modelBuilder.Entity<Product>().Property(x => x.Rating).HasColumnType("numeric(4,2)");
        modelBuilder.Entity<Order>().Property(x => x.Subtotal).HasColumnType("numeric(18,2)");
        modelBuilder.Entity<Order>().Property(x => x.DeliveryCharge).HasColumnType("numeric(18,2)");
        modelBuilder.Entity<Order>().Property(x => x.DiscountAmount).HasColumnType("numeric(18,2)");
        modelBuilder.Entity<Order>().Property(x => x.GrandTotal).HasColumnType("numeric(18,2)");
        modelBuilder.Entity<OrderItem>().Property(x => x.UnitPrice).HasColumnType("numeric(18,2)");
        modelBuilder.Entity<OrderItem>().Property(x => x.TotalPrice).HasColumnType("numeric(18,2)");
        modelBuilder.Entity<Payment>().Property(x => x.Amount).HasColumnType("numeric(18,2)");
        modelBuilder.Entity<Coupon>().Property(x => x.DiscountValue).HasColumnType("numeric(18,2)");
        modelBuilder.Entity<Coupon>().Property(x => x.MinimumOrderAmount).HasColumnType("numeric(18,2)");

        modelBuilder.Entity<Address>()
            .HasOne(x => x.User)
            .WithMany(x => x.Addresses)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Product>()
            .HasOne(x => x.Brand)
            .WithMany(x => x.Products)
            .HasForeignKey(x => x.BrandId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ProductSize>()
            .HasOne(x => x.Product)
            .WithMany(x => x.Sizes)
            .HasForeignKey(x => x.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProductBenefit>()
            .HasOne(x => x.Product)
            .WithMany(x => x.Benefits)
            .HasForeignKey(x => x.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItem>()
            .HasOne(x => x.Order)
            .WithMany(x => x.Items)
            .HasForeignKey(x => x.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
