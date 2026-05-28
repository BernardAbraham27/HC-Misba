using GodGraceHomeProducts.Domain.Common;
using GodGraceHomeProducts.Domain.Enums;

namespace GodGraceHomeProducts.Domain.Entities;

public class InventoryTransaction : BaseEntity
{
    public int ProductId { get; set; }
    public Product? Product { get; set; }
    public InventoryTransactionType Type { get; set; }
    public int QuantityChanged { get; set; }
    public int PreviousStock { get; set; }
    public int NewStock { get; set; }
    public string Remarks { get; set; } = string.Empty;
}
