using AssetManagement.Application.DTOs;
using AssetManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Administrator")] // ONLY Admins can enter this whole controller!
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> Create(UserDto userDto, string password)
    {
        var success = await _userService.CreateUserAsync(userDto, password);
        if (success) return Ok();
        return BadRequest("Could not create user.");
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UserDto userDto)
    {
        var success = await _userService.UpdateUserAsync(id, userDto);
        if (!success) return NotFound();
        return NoContent();
    }
    [HttpPost("{id}/reset-password")]
    public async Task<IActionResult> ResetPassword(int id, [FromQuery] string newPassword)
    {
        var success = await _userService.ResetPasswordAsync(id, newPassword);
        if (!success) return NotFound();
        return Ok(new { message = "Password reset successful" });
    }
}