using AssetManagement.Application.DTOs;

namespace AssetManagement.Application.Interfaces;

public interface IOrganizationService
{
    Task<List<OrganizationUnitDto>> GetHierarchyAsync();
    Task<OrganizationUnitDto> CreateUnitAsync(string name, int? parentId);
    Task<bool> DeleteUnitAsync(int id); // ADD THIS LINE
}