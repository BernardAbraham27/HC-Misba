using System.ComponentModel.DataAnnotations;
using GodGraceHomeProducts.Domain.Enums;

namespace GodGraceHomeProducts.Application.DTOs.Inventory;

public class UpdateStockDto
{
    [Required] public int ProductId { get; set; }
    public int QuantityChange { get; set; }
    [Required] public string Remarks { get; set; } = string.Empty;
}

public class InventoryHistoryDto
{
    public int Id { get; set; }
    public InventoryTransactionType Type { get; set; }
    public int QuantityChanged { get; set; }
    public int PreviousStock { get; set; }
    public int NewStock { get; set; }
    public string Remarks { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
