namespace AssetManagement.Application.DTOs;

public class AssetDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string AssetTag { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int OrganizationUnitId { get; set; }
    public string OrganizationUnitName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}