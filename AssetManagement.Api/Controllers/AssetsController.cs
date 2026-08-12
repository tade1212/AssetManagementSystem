using AssetManagement.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

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
}
