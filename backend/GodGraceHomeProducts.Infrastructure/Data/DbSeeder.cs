using GodGraceHomeProducts.Application.Helpers;
using GodGraceHomeProducts.Domain.Entities;
using GodGraceHomeProducts.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace GodGraceHomeProducts.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var hasher = scope.ServiceProvider.GetRequiredService<PasswordHasher>();

        await SeedBrandTypesAsync(db);
        await SeedCategoriesAsync(db);
        await SeedProductSizesAsync(db);
        await SeedProductStatusesAsync(db);
        await SeedOrderStatusesAsync(db);
        await SeedPaymentStatusesAsync(db);
        await SeedCustomerStatusesAsync(db);
        await SeedCouponStatusesAsync(db);
        await SeedInventoryStatusesAsync(db);
        await SeedEnquiryStatusesAsync(db);
        await SeedUserRolesAsync(db);
        await SeedBrandsAsync(db);
        await SeedUsersAsync(db, hasher);
        await SeedProductsAsync(db);
        await SeedCouponsAsync(db);
    }

    private static async Task SeedUsersAsync(AppDbContext db, PasswordHasher hasher)
    {
        if (!await db.Users.AnyAsync(x => x.Email == "admin@mispa.com"))
        {
            db.Users.Add(new User
            {
                FullName = "MISPA Admin",
                Email = "admin@mispa.com",
                MobileNumber = "9999999999",
                PasswordHash = hasher.Hash("Admin@123"),
                Role = UserRole.Admin,
                IsActive = true
            });
        }

        if (!await db.Users.AnyAsync(x => x.Email == "customer@mispa.com"))
        {
            db.Users.Add(new User
            {
                FullName = "MISPA Customer",
                Email = "customer@mispa.com",
                MobileNumber = "8888888888",
                PasswordHash = hasher.Hash("Customer@123"),
                Role = UserRole.Customer,
                IsActive = true
            });
        }

        await db.SaveChangesAsync();
    }

    private static async Task SeedBrandTypesAsync(AppDbContext db)
    {
        await UpsertMasterAsync(db.BrandTypes, 1, "Own Brand", "OWN_BRAND", "In-house GOD GRACE / MISPA brand.");
        await UpsertMasterAsync(db.BrandTypes, 2, "Third-Party", "THIRD_PARTY", "Third-party listed brand.");
        await UpsertMasterAsync(db.BrandTypes, 3, "Partner Brand", "PARTNER_BRAND", "Partner brand managed in the catalog.");
        await db.SaveChangesAsync();
    }

    private static async Task SeedCategoriesAsync(AppDbContext db)
    {
        var seeds = new[]
        {
            new { Id = 1, Name = "Fabric Care", Code = "FABRIC_CARE" },
            new { Id = 2, Name = "Dishwash", Code = "DISHWASH" },
            new { Id = 3, Name = "Laundry Liquid", Code = "LAUNDRY_LIQUID" },
            new { Id = 4, Name = "Toilet Cleaner", Code = "TOILET_CLEANER" },
            new { Id = 5, Name = "Sanitizer", Code = "SANITIZER" },
            new { Id = 6, Name = "Disinfectants", Code = "DISINFECTANTS" },
            new { Id = 7, Name = "Hand Hygiene", Code = "HAND_HYGIENE" },
            new { Id = 8, Name = "Glass Cleaning", Code = "GLASS_CLEANING" },
            new { Id = 9, Name = "Floor Cleaner", Code = "FLOOR_CLEANER" },
            new { Id = 10, Name = "Cleaning Essentials", Code = "CLEANING_ESSENTIALS" }
        };

        foreach (var item in seeds)
        {
            var existing = await db.Categories.FirstOrDefaultAsync(x => x.Id == item.Id || x.Code == item.Code);
            if (existing is null)
            {
                db.Categories.Add(new Category
                {
                    Id = item.Id,
                    Name = item.Name,
                    Code = item.Code,
                    Slug = SlugHelper.Generate(item.Name),
                    Description = $"{item.Name} products from GOD GRACE Home Products.",
                    ImageUrl = "/assets/images/brands/god-grace-logo.png",
                    DisplayOrder = item.Id,
                    IsActive = true
                });
                continue;
            }

            existing.Name = item.Name;
            existing.Code = item.Code;
            existing.Slug = SlugHelper.Generate(item.Name);
            existing.Description = $"{item.Name} products from GOD GRACE Home Products.";
            existing.DisplayOrder = item.Id;
            existing.IsActive = true;
            existing.IsDeleted = false;
        }

        await db.SaveChangesAsync();
    }

    private static async Task SeedProductSizesAsync(AppDbContext db)
    {
        var seeds = new[]
        {
            new { Id = 1, Name = "250ml", Code = "250ML", Unit = "ml", Value = 250m },
            new { Id = 2, Name = "500ml", Code = "500ML", Unit = "ml", Value = 500m },
            new { Id = 3, Name = "1L", Code = "1L", Unit = "L", Value = 1m },
            new { Id = 4, Name = "5L", Code = "5L", Unit = "L", Value = 5m },
            new { Id = 5, Name = "250gm", Code = "250GM", Unit = "gm", Value = 250m },
            new { Id = 6, Name = "500gm", Code = "500GM", Unit = "gm", Value = 500m }
        };

        foreach (var item in seeds)
        {
            var existing = await db.ProductSizeMasters.FirstOrDefaultAsync(x => x.Id == item.Id || x.Code == item.Code);
            if (existing is null)
            {
                db.ProductSizeMasters.Add(new ProductSizeMaster
                {
                    Id = item.Id,
                    Name = item.Name,
                    Code = item.Code,
                    Description = item.Name,
                    Unit = item.Unit,
                    Value = item.Value,
                    IsActive = true
                });
                continue;
            }

            existing.Name = item.Name;
            existing.Code = item.Code;
            existing.Description = item.Name;
            existing.Unit = item.Unit;
            existing.Value = item.Value;
            existing.IsActive = true;
        }

        await db.SaveChangesAsync();
    }

    private static async Task SeedProductStatusesAsync(AppDbContext db)
    {
        await UpsertMasterAsync(db.ProductStatuses, 1, "Active", "ACTIVE", "Currently active product.");
        await UpsertMasterAsync(db.ProductStatuses, 2, "Inactive", "INACTIVE", "Inactive product.");
        await UpsertMasterAsync(db.ProductStatuses, 3, "Draft", "DRAFT", "Draft product.");
        await UpsertMasterAsync(db.ProductStatuses, 4, "Out of Stock", "OUT_OF_STOCK", "Product is out of stock.");
        await db.SaveChangesAsync();
    }

    private static async Task SeedOrderStatusesAsync(AppDbContext db)
    {
        await UpsertOrderedMasterAsync(db.OrderStatuses, 1, "Pending", "PENDING", "Pending order.", 1);
        await UpsertOrderedMasterAsync(db.OrderStatuses, 2, "Confirmed", "CONFIRMED", "Confirmed order.", 2);
        await UpsertOrderedMasterAsync(db.OrderStatuses, 3, "Packed", "PACKED", "Packed order.", 3);
        await UpsertOrderedMasterAsync(db.OrderStatuses, 4, "Shipped", "SHIPPED", "Shipped order.", 4);
        await UpsertOrderedMasterAsync(db.OrderStatuses, 5, "Out for Delivery", "OUT_FOR_DELIVERY", "Out for delivery.", 5);
        await UpsertOrderedMasterAsync(db.OrderStatuses, 6, "Delivered", "DELIVERED", "Delivered order.", 6);
        await UpsertOrderedMasterAsync(db.OrderStatuses, 7, "Cancelled", "CANCELLED", "Cancelled order.", 7);
        await UpsertOrderedMasterAsync(db.OrderStatuses, 8, "Returned", "RETURNED", "Returned order.", 8);
        await db.SaveChangesAsync();
    }

    private static async Task SeedPaymentStatusesAsync(AppDbContext db)
    {
        await UpsertMasterAsync(db.PaymentStatuses, 1, "Pending", "PENDING", "Pending payment.");
        await UpsertMasterAsync(db.PaymentStatuses, 2, "Paid", "PAID", "Paid payment.");
        await UpsertMasterAsync(db.PaymentStatuses, 3, "Failed", "FAILED", "Failed payment.");
        await UpsertMasterAsync(db.PaymentStatuses, 4, "Refunded", "REFUNDED", "Refunded payment.");
        await db.SaveChangesAsync();
    }

    private static async Task SeedCustomerStatusesAsync(AppDbContext db)
    {
        await UpsertMasterAsync(db.CustomerStatuses, 1, "Active", "ACTIVE", "Active customer.");
        await UpsertMasterAsync(db.CustomerStatuses, 2, "Inactive", "INACTIVE", "Inactive customer.");
        await UpsertMasterAsync(db.CustomerStatuses, 3, "Blocked", "BLOCKED", "Blocked customer.");
        await db.SaveChangesAsync();
    }

    private static async Task SeedCouponStatusesAsync(AppDbContext db)
    {
        await UpsertMasterAsync(db.CouponStatuses, 1, "Active", "ACTIVE", "Active coupon.");
        await UpsertMasterAsync(db.CouponStatuses, 2, "Inactive", "INACTIVE", "Inactive coupon.");
        await UpsertMasterAsync(db.CouponStatuses, 3, "Expired", "EXPIRED", "Expired coupon.");
        await db.SaveChangesAsync();
    }

    private static async Task SeedInventoryStatusesAsync(AppDbContext db)
    {
        await UpsertMasterAsync(db.InventoryStatuses, 1, "In Stock", "IN_STOCK", "Inventory is available.");
        await UpsertMasterAsync(db.InventoryStatuses, 2, "Low Stock", "LOW_STOCK", "Inventory is running low.");
        await UpsertMasterAsync(db.InventoryStatuses, 3, "Out of Stock", "OUT_OF_STOCK", "Inventory is unavailable.");
        await db.SaveChangesAsync();
    }

    private static async Task SeedEnquiryStatusesAsync(AppDbContext db)
    {
        await UpsertMasterAsync(db.EnquiryStatuses, 1, "New", "NEW", "New enquiry.");
        await UpsertMasterAsync(db.EnquiryStatuses, 2, "In Progress", "IN_PROGRESS", "Enquiry in progress.");
        await UpsertMasterAsync(db.EnquiryStatuses, 3, "Replied", "REPLIED", "Enquiry replied.");
        await UpsertMasterAsync(db.EnquiryStatuses, 4, "Closed", "CLOSED", "Enquiry closed.");
        await db.SaveChangesAsync();
    }

    private static async Task SeedUserRolesAsync(AppDbContext db)
    {
        await UpsertMasterAsync(db.UserRoles, 1, "Admin", "ADMIN", "Administrative user.");
        await UpsertMasterAsync(db.UserRoles, 2, "Customer", "CUSTOMER", "Customer user.");
        await db.SaveChangesAsync();
    }

    private static async Task SeedBrandsAsync(AppDbContext db)
    {
        var seeds = new[]
        {
            new { Id = 1, Name = "God Grace Home Products", Code = "GOD_GRACE_HOME_PRODUCTS", Slug = "god-grace-home-products", BrandTypeId = 1, Logo = "/assets/images/brands/god-grace-logo.png", Description = "Primary GOD GRACE own-brand catalog.", DisplayOrder = 1 },
            new { Id = 2, Name = "MISPA", Code = "MISPA", Slug = "mispa", BrandTypeId = 1, Logo = "/assets/images/brands/mispa-logo.png", Description = "Own-brand laundry and fabric care range.", DisplayOrder = 2 },
            new { Id = 3, Name = "RAINBOW", Code = "RAINBOW", Slug = "rainbow", BrandTypeId = 1, Logo = "/assets/images/brands/rainbow-logo.png", Description = "Own-brand sanitizer range.", DisplayOrder = 3 },
            new { Id = 4, Name = "CLEANBOY", Code = "CLEANBOY", Slug = "cleanboy", BrandTypeId = 2, Logo = "/assets/images/brands/cleanboy-logo.png", Description = "Third-party dishwash and laundry range.", DisplayOrder = 4 },
            new { Id = 5, Name = "Easy Clean", Code = "EASY_CLEAN", Slug = "easy-clean", BrandTypeId = 3, Logo = "/assets/images/brands/easy-clean-logo.png", Description = "Partner brand listed until product images are available.", DisplayOrder = 5 }
        };

        foreach (var item in seeds)
        {
            var existing = await db.Brands.FirstOrDefaultAsync(x => x.Id == item.Id || x.Code == item.Code || x.Slug == item.Slug);
            if (existing is null)
            {
                db.Brands.Add(new Brand
                {
                    Id = item.Id,
                    Name = item.Name,
                    Code = item.Code,
                    Slug = item.Slug,
                    BrandTypeId = item.BrandTypeId,
                    LogoUrl = item.Logo,
                    Description = item.Description,
                    IsOwnBrand = item.BrandTypeId == 1,
                    DisplayOrder = item.DisplayOrder,
                    IsActive = true
                });
                continue;
            }

            existing.Name = item.Name;
            existing.Code = item.Code;
            existing.Slug = item.Slug;
            existing.BrandTypeId = item.BrandTypeId;
            existing.LogoUrl = item.Logo;
            existing.Description = item.Description;
            existing.IsOwnBrand = item.BrandTypeId == 1;
            existing.DisplayOrder = item.DisplayOrder;
            existing.IsActive = true;
        }

        await db.SaveChangesAsync();
    }

    private static async Task SeedProductsAsync(AppDbContext db)
    {
        if (await db.Products.AnyAsync())
        {
            return;
        }

        var categoryMap = await db.Categories.ToDictionaryAsync(x => x.Code, x => x.Id);
        var brandMap = await db.Brands.ToDictionaryAsync(x => x.Code, x => x.Id);
        var sizeMap = await db.ProductSizeMasters.ToDictionaryAsync(x => x.Code, x => x.Id);

        var products = new[]
        {
            SeedProduct("MISPA Fabric Conditioner Blue", "mispa-fabric-conditioner-blue", "MISPA", "FABRIC_CARE", 165m, 149m, "500ML", "/assets/images/products/transparent/mispa-fabric-conditioner-blue.png", true),
            SeedProduct("MISPA Fabric Conditioner Pink", "mispa-fabric-conditioner-pink", "MISPA", "FABRIC_CARE", 165m, 149m, "500ML", "/assets/images/products/transparent/mispa-fabric-conditioner-pink.png", true),
            SeedProduct("MISPA Detergent Liquid", "mispa-detergent-liquid", "MISPA", "LAUNDRY_LIQUID", 149m, 129m, "500ML", "/assets/images/products/transparent/mispa-detergent-liquid.png", true),
            SeedProduct("MISPA Disinfectant Toilet Cleaner 5L", "mispa-disinfectant-toilet-cleaner-5l", "MISPA", "TOILET_CLEANER", 299m, 279m, "5L", "/assets/images/products/transparent/mispa-disinfectant-toilet-cleaner-5l.png", true),
            SeedProduct("RAINBOW Rose Sanitizer", "rainbow-rose", "RAINBOW", "SANITIZER", 89m, 79m, "500ML", "/assets/images/products/transparent/rainbow-rose.png", false),
            SeedProduct("RAINBOW Jasmine Sanitizer", "rainbow-jasmine", "RAINBOW", "SANITIZER", 89m, 79m, "500ML", "/assets/images/products/transparent/rainbow-jasmine.png", false),
            SeedProduct("RAINBOW Lemon Sanitizer", "rainbow-lemon", "RAINBOW", "SANITIZER", 89m, 79m, "500ML", "/assets/images/products/transparent/rainbow-lemon.png", false),
            SeedProduct("CLEANBOY Dishwash Liquid", "cleanboy-dishwash-liquid", "CLEANBOY", "DISHWASH", 120m, 109m, "500ML", "/assets/images/products/transparent/cleanboy-dishwash-liquid.png", false),
            SeedProduct("CLEANBOY Washing Liquid 5L", "cleanboy-washing-liquid-5l", "CLEANBOY", "LAUNDRY_LIQUID", 249m, 229m, "5L", "/assets/images/products/transparent/cleanboy-washing-liquid-5l.png", false)
        };

        foreach (var product in products)
        {
            product.BrandId = brandMap[product.Brand!.Code];
            product.Brand = null;
            product.CategoryId = categoryMap[product.Category!.Code];
            product.Category = null;
            product.ProductSizeMasterId = sizeMap[product.ProductSizeMaster!.Code];
            product.ProductSizeMaster = null;
            product.ProductStatusId = 1;
            db.Products.Add(product);
        }

        await db.SaveChangesAsync();
    }

    private static async Task SeedCouponsAsync(AppDbContext db)
    {
        if (!await db.Coupons.AnyAsync())
        {
            db.Coupons.Add(new Coupon
            {
                Code = "MISPA10",
                DiscountType = DiscountType.Percentage,
                DiscountValue = 10,
                MinimumOrderAmount = 499,
                ExpiryDate = DateTime.UtcNow.AddYears(1),
                IsActive = true
            });

            await db.SaveChangesAsync();
        }
    }

    private static Product SeedProduct(
        string name,
        string slug,
        string brandCode,
        string categoryCode,
        decimal price,
        decimal discountPrice,
        string sizeCode,
        string imageUrl,
        bool bestSeller)
    {
        var product = new Product
        {
            Name = name,
            Slug = slug,
            Brand = new Brand { Code = brandCode },
            Category = new Category { Code = categoryCode },
            ProductSizeMaster = new ProductSizeMaster { Code = sizeCode },
            ShortDescription = $"{name} from GOD GRACE Home Products.",
            Description = $"{name} is part of the current God Grace cleaning-product catalog.",
            Price = price,
            DiscountPrice = discountPrice,
            StockQuantity = 100,
            ImageUrl = imageUrl,
            Rating = 4.5m,
            IsBestSeller = bestSeller,
            IsNewArrival = false,
            IsActive = true,
            HowToUse = "Use as directed on the product label.",
            SafetyInstructions = "Store tightly closed and away from children.",
            Benefits =
            {
                new ProductBenefit { Benefit = "Quality cleaning performance" },
                new ProductBenefit { Benefit = "Suitable for regular use" },
                new ProductBenefit { Benefit = "Visible branded packaging" }
            }
        };

        product.Sizes.Add(new ProductSize { Size = sizeCode.Replace("ML", "ml").Replace("GM", "gm") });
        return product;
    }

    private static async Task UpsertMasterAsync<T>(DbSet<T> set, int id, string name, string code, string description)
        where T : MasterValueBase, new()
    {
        var existing = await set.FirstOrDefaultAsync(x => x.Id == id || x.Code == code);
        if (existing is null)
        {
            set.Add(new T
            {
                Id = id,
                Name = name,
                Code = code,
                Description = description,
                IsActive = true
            });
            return;
        }

        existing.Name = name;
        existing.Code = code;
        existing.Description = description;
        existing.IsActive = true;
    }

    private static async Task UpsertOrderedMasterAsync<T>(DbSet<T> set, int id, string name, string code, string description, int displayOrder)
        where T : DisplayOrderedMasterValueBase, new()
    {
        var existing = await set.FirstOrDefaultAsync(x => x.Id == id || x.Code == code);
        if (existing is null)
        {
            set.Add(new T
            {
                Id = id,
                Name = name,
                Code = code,
                Description = description,
                DisplayOrder = displayOrder,
                IsActive = true
            });
            return;
        }

        existing.Name = name;
        existing.Code = code;
        existing.Description = description;
        existing.DisplayOrder = displayOrder;
        existing.IsActive = true;
    }
}
