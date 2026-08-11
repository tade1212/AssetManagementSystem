using AssetManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // These represent your Database Tables
    public DbSet<Asset> Assets { get; set; }
    public DbSet<OrganizationUnit> OrganizationUnits { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<AssetDocument> AssetDocuments { get; set; }
    public DbSet<AssetHistory> AssetHistories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // This handles the Organization Hierarchy (Tree)
        modelBuilder.Entity<OrganizationUnit>()
            .HasOne(u => u.ParentUnit)
            .WithMany(u => u.ChildUnits)
            .HasForeignKey(u => u.ParentUnitId)
            .OnDelete(DeleteBehavior.Restrict); // Prevents accidental deletion of a whole branch
    }
}