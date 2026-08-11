namespace AssetManagement.Domain.Entities;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty; // e.g., "Laptop", "Furniture"

    // One category can have many assets
    public virtual ICollection<Asset> Assets { get; set; } = new List<Asset>();
}