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

        var categoryNames = new[]
        {
            "Fabric Care",
            "Dishwash",
            "Laundry Liquid",
            "Toilet Cleaner",
            "Sanitizer",
            "Cleaning Essentials"
        };

        foreach (var name in categoryNames)
        {
            if (await db.Categories.AnyAsync(x => x.Name == name))
            {
                continue;
            }

            db.Categories.Add(new Category
            {
                Name = name,
                Slug = SlugHelper.Generate(name),
                Description = $"{name} products from GOD GRACE Home Products.",
                ImageUrl = $"/assets/images/brands/god-grace-logo.png",
                IsActive = true
            });
        }

        await db.SaveChangesAsync();

        var brands = new[]
        {
            new Brand
            {
                Name = "MISPA",
                Slug = "mispa",
                LogoUrl = "/assets/images/brands/mispa-logo.png",
                Description = "Own-brand laundry and fabric care range.",
                IsOwnBrand = true,
                IsActive = true
            },
            new Brand
            {
                Name = "RAINBOW",
                Slug = "rainbow",
                LogoUrl = "/assets/images/brands/rainbow-logo.png",
                Description = "Own-brand sanitizer range.",
                IsOwnBrand = true,
                IsActive = true
            },
            new Brand
            {
                Name = "CLEANBOY",
                Slug = "cleanboy",
                LogoUrl = "/assets/images/brands/cleanboy-logo.png",
                Description = "Third-party dishwash and laundry range.",
                IsOwnBrand = false,
                IsActive = true
            },
            new Brand
            {
                Name = "Easy Clean",
                Slug = "easy-clean",
                LogoUrl = "/assets/images/brands/easy-clean-logo.png",
                Description = "Partner brand listed until product images are available.",
                IsOwnBrand = false,
                IsActive = true
            }
        };

        foreach (var brand in brands)
        {
            if (!await db.Brands.AnyAsync(x => x.Slug == brand.Slug))
            {
                db.Brands.Add(brand);
            }
        }

        await db.SaveChangesAsync();

        if (!await db.Products.AnyAsync())
        {
            var categories = await db.Categories.ToDictionaryAsync(x => x.Name, x => x.Id);
            var brandMap = await db.Brands.ToDictionaryAsync(x => x.Name, x => x.Id);

            var products = new[]
            {
                SeedProduct("MISPA Fabric Conditioner Blue", "mispa-fabric-conditioner-blue", "MISPA", "Fabric Care", 165m, "500ml", "/assets/images/products/transparent/mispa-fabric-conditioner-blue.png", true),
                SeedProduct("MISPA Fabric Conditioner Pink", "mispa-fabric-conditioner-pink", "MISPA", "Fabric Care", 165m, "500ml", "/assets/images/products/transparent/mispa-fabric-conditioner-pink.png", true),
                SeedProduct("MISPA Detergent Liquid", "mispa-detergent-liquid", "MISPA", "Laundry Liquid", 149m, "500ml", "/assets/images/products/transparent/mispa-detergent-liquid.png", true),
                SeedProduct("MISPA Disinfectant Toilet Cleaner 5L", "mispa-disinfectant-toilet-cleaner-5l", "MISPA", "Toilet Cleaner", 299m, "5L", "/assets/images/products/transparent/mispa-disinfectant-toilet-cleaner-5l.png", true),
                SeedProduct("RAINBOW Rose Sanitizer", "rainbow-rose", "RAINBOW", "Sanitizer", 89m, "500ml", "/assets/images/products/transparent/rainbow-rose.png", false),
                SeedProduct("RAINBOW Jasmine Sanitizer", "rainbow-jasmine", "RAINBOW", "Sanitizer", 89m, "500ml", "/assets/images/products/transparent/rainbow-jasmine.png", false),
                SeedProduct("RAINBOW Lemon Sanitizer", "rainbow-lemon", "RAINBOW", "Sanitizer", 89m, "500ml", "/assets/images/products/transparent/rainbow-lemon.png", false),
                SeedProduct("CLEANBOY Dishwash Liquid", "cleanboy-dishwash-liquid", "CLEANBOY", "Dishwash", 120m, "500ml", "/assets/images/products/transparent/cleanboy-dishwash-liquid.png", false),
                SeedProduct("CLEANBOY Washing Liquid 5L", "cleanboy-washing-liquid-5l", "CLEANBOY", "Laundry Liquid", 249m, "5L", "/assets/images/products/transparent/cleanboy-washing-liquid-5l.png", false),
            };

            foreach (var product in products)
            {
                product.BrandId = brandMap[product.Brand!.Name];
                product.Brand = null;
                product.CategoryId = categories[product.Category!.Name];
                product.Category = null;
                db.Products.Add(product);
            }
        }

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
        }

        await db.SaveChangesAsync();
    }

    private static Product SeedProduct(
        string name,
        string slug,
        string brandName,
        string categoryName,
        decimal price,
        string size,
        string imageUrl,
        bool bestSeller)
    {
        var isFabricCare = name.Contains("Fabric Conditioner", StringComparison.OrdinalIgnoreCase);
        var product = new Product
        {
            Name = name,
            Slug = slug,
            Brand = new Brand { Name = brandName },
            Category = new Category { Name = categoryName },
            ShortDescription = $"{name} from GOD GRACE Home Products.",
            Description = $"{name} is part of the current God Grace cleaning-product catalog.",
            Price = price,
            DiscountPrice = price,
            StockQuantity = 100,
            ImageUrl = imageUrl,
            Rating = 4.7m,
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

        product.Sizes.Add(new ProductSize { Size = size });
        if (isFabricCare)
        {
            product.Sizes.Add(new ProductSize { Size = "1L" });
        }

        return product;
    }
}
