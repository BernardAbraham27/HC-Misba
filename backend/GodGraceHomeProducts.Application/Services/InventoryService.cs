using GodGraceHomeProducts.Application.DTOs.Dashboard;
using GodGraceHomeProducts.Application.DTOs.Inventory;
using GodGraceHomeProducts.Application.Interfaces;
using GodGraceHomeProducts.Domain.Entities;
using GodGraceHomeProducts.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace GodGraceHomeProducts.Application.Services;

public class InventoryService(IAppDbContext db) : IInventoryService
{
    public async Task<IReadOnlyCollection<LowStockProductDto>> GetLowStockProductsAsync()
        => await db.Products.Where(x => x.IsActive && !x.IsDeleted && x.StockQuantity <= 10).OrderBy(x => x.StockQuantity)
            .Select(x => new LowStockProductDto { ProductId = x.Id, ProductName = x.Name, StockQuantity = x.StockQuantity }).ToListAsync();

    public async Task UpdateStockAsync(UpdateStockDto request)
    {
        var product = await db.Products.FirstOrDefaultAsync(x => x.Id == request.ProductId && x.IsActive && !x.IsDeleted)
            ?? throw new KeyNotFoundException("Product not found.");
        var previous = product.StockQuantity;
        var next = previous + request.QuantityChange;
        if (next < 0) throw new InvalidOperationException("Stock cannot become negative.");
        product.StockQuantity = next;
        product.UpdatedAt = DateTime.UtcNow;
        db.InventoryTransactions.Add(new InventoryTransaction
        {
            ProductId = product.Id,
            Type = InventoryTransactionType.Adjusted,
            QuantityChanged = request.QuantityChange,
            PreviousStock = previous,
            NewStock = next,
            Remarks = request.Remarks.Trim()
        });
        await db.SaveChangesAsync();
    }

    public async Task<IReadOnlyCollection<InventoryHistoryDto>> GetHistoryAsync(int productId)
        => await db.InventoryTransactions.Where(x => x.ProductId == productId).OrderByDescending(x => x.CreatedAt)
            .Select(x => new InventoryHistoryDto
            {
                Id = x.Id,
                Type = x.Type,
                QuantityChanged = x.QuantityChanged,
                PreviousStock = x.PreviousStock,
                NewStock = x.NewStock,
                Remarks = x.Remarks,
                CreatedAt = x.CreatedAt
            }).ToListAsync();

    public async Task RecordTransactionAsync(int productId, InventoryTransactionType type, int quantityChanged, int previousStock, int newStock, string remarks, bool saveChanges = true)
    {
        db.InventoryTransactions.Add(new InventoryTransaction
        {
            ProductId = productId,
            Type = type,
            QuantityChanged = quantityChanged,
            PreviousStock = previousStock,
            NewStock = newStock,
            Remarks = remarks
        });
        if (saveChanges) await db.SaveChangesAsync();
    }
}
