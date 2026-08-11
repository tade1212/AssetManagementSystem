namespace AssetManagement.Domain.Entities;

public class AssetDocument
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty; // Where the file is stored on disk
    public string DocumentType { get; set; } = string.Empty; // Invoice, Warranty, Image

    public int AssetId { get; set; }
    public virtual Asset? Asset { get; set; }

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
