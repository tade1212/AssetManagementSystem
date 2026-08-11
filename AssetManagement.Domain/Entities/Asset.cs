namespace AssetManagement.Domain.Entities;

public class Asset
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string AssetTag { get; set; } = string.Empty; // e.g., "AST-001"
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Available"; // e.g., "Available", "Assigned", "Broken"

    // Classification
    public int CategoryId { get; set; }
    public virtual Category? Category { get; set; }

    // Ownership/Location
    public int OrganizationUnitId { get; set; }
    public virtual OrganizationUnit? OrganizationUnit { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public virtual ICollection<AssetDocument> Documents { get; set; } = new List<AssetDocument>();
    public virtual ICollection<AssetHistory> History { get; set; } = new List<AssetHistory>();
}