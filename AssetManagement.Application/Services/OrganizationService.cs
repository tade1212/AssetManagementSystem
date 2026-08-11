using AssetManagement.Application.DTOs;
using AssetManagement.Application.Interfaces;
using AssetManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Application.Services;

public class OrganizationService : IOrganizationService
{
    private readonly IApplicationDbContext _context;

    public OrganizationService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<OrganizationUnitDto>> GetHierarchyAsync()
    {
        // Fetch all units from the database
        var allUnits = await _context.OrganizationUnits.ToListAsync();

        // Start building the tree from the top-level units (where ParentId is null)
        return allUnits
            .Where(u => u.ParentUnitId == null)
            .Select(u => MapToDto(u, allUnits))
            .ToList();
    }

    public async Task<OrganizationUnitDto> CreateUnitAsync(string name, int? parentId)
    {
        var unit = new OrganizationUnit
        {
            Name = name,
            ParentUnitId = parentId
        };

        _context.OrganizationUnits.Add(unit);
        await _context.SaveChangesAsync();

        return new OrganizationUnitDto
        {
            Id = unit.Id,
            Name = unit.Name,
            ParentUnitId = unit.ParentUnitId
        };
    }

    private OrganizationUnitDto MapToDto(OrganizationUnit unit, List<OrganizationUnit> allUnits)
    {
        return new OrganizationUnitDto
        {
            Id = unit.Id,
            Name = unit.Name,
            ParentUnitId = unit.ParentUnitId,
            Children = allUnits
                .Where(child => child.ParentUnitId == unit.Id)
                .Select(child => MapToDto(child, allUnits))
                .ToList()
        };
    }
}