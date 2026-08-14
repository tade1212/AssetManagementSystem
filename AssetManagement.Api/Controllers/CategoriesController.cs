using AssetManagement.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace AssetManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public CategoriesController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var categories = await _context.Categories
            .Select(c => new { c.Id, c.Name })
            .ToListAsync();
        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromQuery] string name)
    {
        if (string.IsNullOrWhiteSpace(name)) return BadRequest("Name required");

        var category = new AssetManagement.Domain.Entities.Category { Name = name };
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return Ok(category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();

        // Check if assets are using this category
        var inUse = await _context.Assets.AnyAsync(a => a.CategoryId == id);
        if (inUse) return BadRequest("Cannot delete category: It is currently assigned to assets.");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}