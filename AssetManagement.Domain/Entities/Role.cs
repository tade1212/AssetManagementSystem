namespace AssetManagement.Domain.Entities;

public class Role
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty; // Admin, Manager, Viewer

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}