namespace GodGraceHomeProducts.Application.DTOs.Dashboard;

public class LowStockProductDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
}

public class RecentOrderDto
{
    public int OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public decimal GrandTotal { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class TopSellingProductDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int QuantitySold { get; set; }
}

public class MonthlySalesDto
{
    public string Month { get; set; } = string.Empty;
    public decimal Sales { get; set; }
}

public class DashboardSummaryDto
{
    public decimal TotalSales { get; set; }
    public int TotalOrders { get; set; }
    public int TotalProducts { get; set; }
    public int TotalCustomers { get; set; }
    public int PendingOrders { get; set; }
    public IReadOnlyCollection<LowStockProductDto> LowStockProducts { get; set; } = Array.Empty<LowStockProductDto>();
    public IReadOnlyCollection<RecentOrderDto> RecentOrders { get; set; } = Array.Empty<RecentOrderDto>();
    public IReadOnlyCollection<TopSellingProductDto> TopSellingProducts { get; set; } = Array.Empty<TopSellingProductDto>();
    public IReadOnlyCollection<MonthlySalesDto> MonthlySalesSummary { get; set; } = Array.Empty<MonthlySalesDto>();
}
