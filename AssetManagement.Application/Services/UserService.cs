using AssetManagement.Application.DTOs;
using AssetManagement.Application.Interfaces;
using AssetManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Application.Services;

public class UserService : IUserService
{
    private readonly IApplicationDbContext _context;

    public UserService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserDto>> GetAllUsersAsync()
    {
        return await _context.Users
            .Include(u => u.Role)
            .Select(u => new UserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                RoleId = u.RoleId,
                RoleName = u.Role!.Name
            }).ToListAsync();
    }

    public async Task<bool> CreateUserAsync(UserDto userDto, string password)
    {
        var user = new User
        {
            FullName = userDto.FullName,
            Email = userDto.Email,
            PasswordHash = password, // In a real app, hash this!
            RoleId = userDto.RoleId
        };

        _context.Users.Add(user);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        return await _context.SaveChangesAsync() > 0;
    }
    public async Task<bool> UpdateUserAsync(int id, UserDto userDto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        user.FullName = userDto.FullName;
        user.Email = userDto.Email;
        user.RoleId = userDto.RoleId;
        // We don't update password here for security

        return await _context.SaveChangesAsync() > 0;
    }
    public async Task<bool> ResetPasswordAsync(int id, string newPassword)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        // In this project, we store the plain password as discussed
        user.PasswordHash = newPassword;

        return await _context.SaveChangesAsync() > 0;
    }
}