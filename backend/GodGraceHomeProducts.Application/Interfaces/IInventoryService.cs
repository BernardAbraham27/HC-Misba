using GodGraceHomeProducts.Application.DTOs.Dashboard;
using GodGraceHomeProducts.Application.DTOs.Inventory;
using GodGraceHomeProducts.Domain.Enums;

namespace GodGraceHomeProducts.Application.Interfaces;

public interface IInventoryService
{
    Task<IReadOnlyCollection<LowStockProductDto>> GetLowStockProductsAsync();
    Task UpdateStockAsync(UpdateStockDto request);
    Task<IReadOnlyCollection<InventoryHistoryDto>> GetHistoryAsync(int productId);
    Task RecordTransactionAsync(int productId, InventoryTransactionType type, int quantityChanged, int previousStock, int newStock, string remarks, bool saveChanges = true);
}
