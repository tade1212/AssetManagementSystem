namespace AssetManagement.Domain.Entities;

public class OrganizationUnit
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public int? ParentUnitId { get; set; }
    public virtual OrganizationUnit? ParentUnit { get; set; }

    public virtual ICollection<OrganizationUnit> ChildUnits { get; set; } = new List<OrganizationUnit>();
    public virtual ICollection<Asset> Assets { get; set; } = new List<Asset>();
}