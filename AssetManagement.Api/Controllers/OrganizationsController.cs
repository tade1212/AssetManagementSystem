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

    /// <summary>
    /// Gets the full nested hierarchy tree
    /// URL: GET /api/organizations/hierarchy
    /// </summary>
    [HttpGet("hierarchy")]
    public async Task<IActionResult> GetHierarchy()
    {
        var result = await _organizationService.GetHierarchyAsync();
        return Ok(result);
    }

    /// <summary>
    /// Creates a new unit. 
    /// [FromQuery] ensures the parentId is correctly captured from the URL.
    /// URL: POST /api/organizations?name=Finance&parentId=1
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromQuery] string name, [FromQuery] int? parentId)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return BadRequest("Unit name is required.");
        }

        var result = await _organizationService.CreateUnitAsync(name, parentId);
        return Ok(result);
    }

    /// <summary>
    /// Bonus: Added Delete functionality to allow management of the structure
    /// URL: DELETE /api/organizations/5
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var success = await _organizationService.DeleteUnitAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}