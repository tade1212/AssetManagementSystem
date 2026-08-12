using AssetManagement.Application.DTOs;
using AssetManagement.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration; // Now this will work
using Microsoft.IdentityModel.Tokens;    // Now this will work
using System.IdentityModel.Tokens.Jwt;   // Now this will work
using System.Security.Claims;
using System.Text;

namespace AssetManagement.Application.Services;

public class AuthService : IAuthService
{
    private readonly IApplicationDbContext _context;
    private readonly IConfiguration _config;

    public AuthService(IApplicationDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
    {
        // 1. Find user and include their Role
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email && u.PasswordHash == loginDto.Password);

        // If user not found, return null
        if (user == null || user.Role == null) return null;

        // 2. Read the Key from appsettings.json
        var jwtKey = _config["Jwt:Key"];
        if (string.IsNullOrEmpty(jwtKey)) throw new Exception("JWT Key is missing in configuration.");

        var key = Encoding.ASCII.GetBytes(jwtKey);

        // 3. Prepare the Token
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.Name)
            }),
            Expires = DateTime.UtcNow.AddDays(1),
            Issuer = _config["Jwt:Issuer"],
            Audience = _config["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return new AuthResponseDto
        {
            Token = tokenHandler.WriteToken(token),
            FullName = user.FullName,
            Role = user.Role.Name
        };
    }
}