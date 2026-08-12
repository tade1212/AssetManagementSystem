// Add this using statement at the top
using AssetManagement.Application.DTOs;
using Microsoft.AspNetCore.Http;
using System.Linq;
namespace AssetManagement.Application.Interfaces;
using AssetManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

public interface IAssetService
{
    Task<List<AssetDto>> GetAllAssetsAsync();
    Task<AssetDto> CreateAssetAsync(string name, string tag, string description, int categoryId, int orgUnitId);

    // NEW METHOD FOR UPLOADS
    Task<AssetDocumentDto> UploadDocumentAsync(int assetId, IFormFile file, string documentType);
}