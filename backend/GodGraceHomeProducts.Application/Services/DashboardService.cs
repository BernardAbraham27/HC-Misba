using GodGraceHomeProducts.Application.DTOs.Dashboard;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace GodGraceHomeProducts.Application.Services;

public class DashboardService(IAppDbContext db, IInventoryService inventoryService) : IDashboardService
{
    public async Task<DashboardSummaryDto> GetAdminDashboardAsync()
    {
        var monthlyRaw = await db.Orders
            .Where(x => x.PaymentStatus == PaymentStatus.Paid)
            .GroupBy(x => new { x.CreatedAt.Year, x.CreatedAt.Month })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Month,
                Sales = g.Sum(x => x.GrandTotal)
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .Take(12)
            .ToListAsync();

        var monthly = monthlyRaw
            .Select(x => new MonthlySalesDto
            {
                Month = $"{x.Year}-{x.Month:00}",
                Sales = x.Sales
            })
            .ToList();

        var top = await db.OrderItems.GroupBy(x => new { x.ProductId, x.ProductName })
            .Select(g => new TopSellingProductDto
            {
                ProductId = g.Key.ProductId,
                ProductName = g.Key.ProductName,
                QuantitySold = g.Sum(x => x.Quantity)
            }).OrderByDescending(x => x.QuantitySold).Take(5).ToListAsync();

        var recent = await db.Orders.Include(x => x.User).OrderByDescending(x => x.CreatedAt).Take(5)
            .Select(x => new RecentOrderDto
            {
                OrderId = x.Id,
                OrderNumber = x.OrderNumber,
                CustomerName = x.User!.FullName,
                GrandTotal = x.GrandTotal,
                CreatedAt = x.CreatedAt
            }).ToListAsync();

        return new DashboardSummaryDto
        {
            TotalSales = await db.Orders.Where(x => x.PaymentStatus == PaymentStatus.Paid).SumAsync(x => (decimal?)x.GrandTotal) ?? 0m,
            TotalOrders = await db.Orders.CountAsync(),
            TotalProducts = await db.Products.CountAsync(x => x.IsActive && !x.IsDeleted),
            TotalCustomers = await db.Users.CountAsync(x => x.Role == UserRole.Customer),
            PendingOrders = await db.Orders.CountAsync(x => x.Status == OrderStatus.Pending),
            LowStockProducts = await inventoryService.GetLowStockProductsAsync(),
            RecentOrders = recent,
            TopSellingProducts = top,
            MonthlySalesSummary = monthly
        };
    }
}
