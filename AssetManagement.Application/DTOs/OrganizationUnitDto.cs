namespace AssetManagement.Application.DTOs;

public class OrganizationUnitDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int? ParentUnitId { get; set; }

    // This helps us show the "Tree" in Angular
    public List<OrganizationUnitDto> Children { get; set; } = new();
}