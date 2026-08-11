namespace AssetManagement.Domain.Entities;

public class AssetHistory
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty; // e.g., "Assigned to IT", "Status changed to Broken"
    public string ChangedBy { get; set; } = string.Empty;
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    public int AssetId { get; set; }
    public virtual Asset? Asset { get; set; }
}