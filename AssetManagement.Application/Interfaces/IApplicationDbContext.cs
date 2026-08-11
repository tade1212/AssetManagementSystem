using AssetManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Asset> Assets { get; }
    DbSet<OrganizationUnit> OrganizationUnits { get; }
    DbSet<Category> Categories { get; }
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<AssetDocument> AssetDocuments { get; }
    DbSet<AssetHistory> AssetHistories { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}