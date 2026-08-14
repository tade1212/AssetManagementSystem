using AssetManagement.Application.DTOs;

namespace AssetManagement.Application.Interfaces;

public interface IUserService
{
    Task<List<UserDto>> GetAllUsersAsync();
    Task<bool> CreateUserAsync(UserDto userDto, string password);
    Task<bool> DeleteUserAsync(int id);
    Task<bool> UpdateUserAsync(int id, UserDto userDto);
    Task<bool> ResetPasswordAsync(int id, string newPassword);
}