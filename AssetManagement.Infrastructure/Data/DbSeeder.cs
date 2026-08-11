using AssetManagement.Domain.Entities;
using AssetManagement.Infrastructure.Data;

public static void Seed(AppDbContext context)
{
    Console.WriteLine("---> Checking Database Seeding...");

    // 1. Seed Roles
    if (!context.Roles.Any())
    {
        Console.WriteLine("---> Seeding Roles...");
        context.Roles.AddRange(
            new Role { Name = "Administrator" },
            new Role { Name = "Manager" },
            new Role { Name = "Viewer" }
        );
        context.SaveChanges();
    }

    // 2. Seed Users
    if (!context.Users.Any())
    {
        Console.WriteLine("---> Seeding Users...");
        var adminRole = context.Roles.First(r => r.Name == "Administrator");
        var viewerRole = context.Roles.First(r => r.Name == "Viewer");

        context.Users.AddRange(
            new User
            {
                FullName = "Admin User",
                Email = "admin@raras.com",
                PasswordHash = "admin123",
                RoleId = adminRole.Id
            },
            new User
            {
                FullName = "Regular Viewer",
                Email = "viewer@raras.com",
                PasswordHash = "viewer123",
                RoleId = viewerRole.Id
            }
        );
        context.SaveChanges();
    }

    // 3. Seed Categories
    if (!context.Categories.Any())
    {
        Console.WriteLine("---> Seeding Categories...");
        context.Categories.AddRange(
            new Category { Name = "Laptops" },
            new Category { Name = "Furniture" },
            new Category { Name = "Printers" }
        );
        context.SaveChanges();
    }

    Console.WriteLine("---> Seeding Complete!");
}