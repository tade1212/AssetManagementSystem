using AssetManagement.Application.DTOs;

namespace AssetManagement.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
}