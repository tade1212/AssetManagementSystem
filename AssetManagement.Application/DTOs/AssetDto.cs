using System;
using System.Collections.Generic;

namespace AssetManagement.Application.DTOs;

public class AssetDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string AssetTag { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;

    // IDs (Needed for the Add/Edit forms)
    public int CategoryId { get; set; }
    public int OrganizationUnitId { get; set; }

    // Names (Needed for the Table and Details display)
    public string CategoryName { get; set; } = string.Empty;
    public string OrganizationUnitName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    // List of files (Needed for the Details page)
    public List<AssetDocumentDto> AssetDocuments { get; set; } = new();
}