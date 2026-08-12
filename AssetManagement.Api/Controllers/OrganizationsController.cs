using AssetManagement.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrganizationsController : ControllerBase
{
    private readonly IOrganizationService _organizationService;

    public OrganizationsController(IOrganizationService organizationService)
    {
        _organizationService = organizationService;
    }

    [HttpGet("hierarchy")]
    public async Task<IActionResult> GetHierarchy()
    {
        var result = await _organizationService.GetHierarchyAsync();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(string name, int? parentId)
    {
        var result = await _organizationService.CreateUnitAsync(name, parentId);
        return Ok(result);
    }
}