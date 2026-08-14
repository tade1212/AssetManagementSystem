using AssetManagement.Application.DTOs;
using AssetManagement.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace AssetManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssetsController : ControllerBase
{
    private readonly IAssetService _assetService;

    public AssetsController(IAssetService assetService)
    {
        _assetService = assetService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAssets()
    {
        var assets = await _assetService.GetAllAssetsAsync();
        return Ok(assets);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var asset = await _assetService.GetAssetByIdAsync(id);
        if (asset == null) return NotFound();
        return Ok(asset);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsset(string name, string tag, string description, int categoryId, int orgUnitId)
    {
        var result = await _assetService.CreateAssetAsync(name, tag, description, categoryId, orgUnitId);
        return Ok(result);
    }

    [HttpPost("{id}/documents")]
    public async Task<IActionResult> UploadDocument(int id, IFormFile file, [FromForm] string documentType)
    {
        try
        {
            var result = await _assetService.UploadDocumentAsync(id, file, documentType);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _assetService.DeleteAssetAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
//}
[HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] AssetDto assetDto)
    {
        var success = await _assetService.UpdateAssetAsync(id, assetDto);
        if (!success) return NotFound();
        return NoContent();
    }
    }