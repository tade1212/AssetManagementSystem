using AssetManagement.Domain.Entities;

namespace AssetManagement.Infrastructure.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (!context.Roles.Any())
        {
            context.Roles.AddRange(
                new Role { Name = "Administrator" },
                new Role { Name = "Manager" },
                new Role { Name = "Viewer" }
            );
            context.SaveChanges();
        }
    }
}