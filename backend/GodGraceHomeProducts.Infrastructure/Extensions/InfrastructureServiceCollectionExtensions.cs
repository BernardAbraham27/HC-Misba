using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Application.Services;
using GodGraceHomeProducts.Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;

namespace GodGraceHomeProducts.Infrastructure.Extensions;

public static class InfrastructureServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IAppDbContext>(sp => sp.GetRequiredService<AppDbContext>());

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IBrandService, BrandService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<ICartService, CartService>();
        services.AddScoped<IWishlistService, WishlistService>();
        services.AddScoped<IAddressService, AddressService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<ICouponService, CouponService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IEnquiryService, EnquiryService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IInventoryService, InventoryService>();

        return services;
    }
}
