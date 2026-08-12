using AssetManagement.Application.DTOs;
using AssetManagement.Application.Interfaces;
using AssetManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace AssetManagement.Application.Services;

public class AssetService : IAssetService
{
    private readonly IApplicationDbContext _context;

    public AssetService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AssetDto>> GetAllAssetsAsync()
    {
        return await _context.Assets
            .Include(a => a.Category)
            .Include(a => a.OrganizationUnit)
            .Select(a => new AssetDto
            {
                Id = a.Id,
                Name = a.Name,
                AssetTag = a.AssetTag,
                Description = a.Description,
                Status = a.Status,
                CategoryId = a.CategoryId,
                CategoryName = a.Category!.Name,
                OrganizationUnitId = a.OrganizationUnitId,
                OrganizationUnitName = a.OrganizationUnit!.Name,
                CreatedAt = a.CreatedAt
            }).ToListAsync();
    }

    public async Task<AssetDto> CreateAssetAsync(string name, string tag, string description, int categoryId, int orgUnitId)
    {
        var asset = new Asset
        {
            Name = name,
            AssetTag = tag,
            Description = description,
            CategoryId = categoryId,
            OrganizationUnitId = orgUnitId,
            Status = "Available",
            CreatedAt = DateTime.UtcNow
        };

        _context.Assets.Add(asset);
        await _context.SaveChangesAsync();

        return new AssetDto
        {
            Id = asset.Id,
            Name = asset.Name,
            AssetTag = asset.AssetTag,
            Description = asset.Description,
            Status = asset.Status
        };
    }
    public async Task<AssetDocumentDto> UploadDocumentAsync(int assetId, IFormFile file, string documentType)
    {
        // 1. Validation
        var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
        {
            throw new Exception("Invalid file type. Only PDF, JPG, and PNG are allowed.");
        }

        // 2. STABLE PATH LOGIC
        // This creates the folder inside the API project's directory
        string rootPath = AppContext.BaseDirectory;
        var uploadsFolder = Path.Combine(rootPath, "wwwroot", "Uploads");

        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        // 3. Save file to disk
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // 4. Save to Database
        var doc = new AssetDocument
        {
            AssetId = assetId,
            FileName = file.FileName,
            FilePath = "/Uploads/" + uniqueFileName,
            DocumentType = documentType,
            UploadedAt = DateTime.UtcNow
        };

        _context.AssetDocuments.Add(doc);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // If the database fails, we should know why!
            throw new Exception("Database error: " + ex.InnerException?.Message ?? ex.Message);
        }

        return new AssetDocumentDto
        {
            Id = doc.Id,
            FileName = doc.FileName,
            DocumentType = doc.DocumentType,
            FilePath = doc.FilePath,
            UploadedAt = doc.UploadedAt
        };
    }
}
