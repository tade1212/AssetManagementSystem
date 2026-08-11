using System;
using System.Collections.Generic;

namespace AssetManagement.Domain.Entities;

public class Asset
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string AssetTag { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Available";
    public int CategoryId { get; set; }
    public virtual Category? Category { get; set; }
    public int OrganizationUnitId { get; set; }
    public virtual OrganizationUnit? OrganizationUnit { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public virtual ICollection<AssetDocument> Documents { get; set; } = new List<AssetDocument>();
    public virtual ICollection<AssetHistory> History { get; set; } = new List<AssetHistory>();
}