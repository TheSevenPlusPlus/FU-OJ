﻿using FU.OJ.Server.DTOs.User.Request;
using FU.OJ.Server.DTOs.User.Respond;
using FU.OJ.Server.Infra.Const.Authorize;
using FU.OJ.Server.Infra.Const.Route;
using FU.OJ.Server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FU.OJ.Server.Controllers
{
    [Route(UserRoute.INDEX)]
    [ApiController]
    [Authorize(Roles = RoleAuthorize.OnlyAdmin)] // Only allow Admins to manage users
    public class UserController : BaseController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService, ILogger<UserController> logger) : base(logger)
        {
            _userService = userService;
        }

        [HttpPost(UserRoute.Action.Create)]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest createUserRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newUser = await _userService.CreateUserAsync(createUserRequest);
            if (newUser == null)
                return StatusCode(500, "User creation failed"); // Optionally, return specific error messages.

            var userResponse = new UpdateUserRequest
            {
                UserName = newUser.UserName,
                Email = newUser.Email,
                PhoneNumber = newUser.PhoneNumber,
                Fullname = newUser.Fullname,
                City = newUser.City,
                Description = newUser.Description,
                FacebookLink = newUser.FacebookLink,
                GithubLink = newUser.GithubLink,
                School = newUser.School,
            };

            return CreatedAtAction(nameof(GetUserById), new { id = newUser.Id }, userResponse);
        }

        // Get all users
        [HttpGet(UserRoute.Action.GetAll)]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            var userResponses = users.Select(u => new UpdateUserRequest
            {
                UserName = u.UserName,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                Fullname = u.Fullname,
                City = u.City,
                Description = u.Description,
                FacebookLink = u.FacebookLink,
                GithubLink = u.GithubLink,
                School = u.School,
            }).ToList();

            return Ok(userResponses);
        }

        // Get user by ID
        [HttpGet(UserRoute.Action.GetById)]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound("User not found");

            var userResponse = new UpdateUserRequest
            {
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Fullname = user.Fullname,
                City = user.City,
                Description = user.Description,
                FacebookLink = user.FacebookLink,
                GithubLink = user.GithubLink,
                School = user.School,
            };

            return Ok(userResponse);
        }

        // Update user
        [HttpPut(UserRoute.Action.Update)]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] CreateUserRequest updateUserRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedUser = await _userService.UpdateUserAsync(id, updateUserRequest);
            if (updatedUser == null) return NotFound("User not found");

            var userResponse = new UpdateUserRequest
            {
                UserName = updatedUser.UserName,
                Email = updatedUser.Email,
                PhoneNumber = updatedUser.PhoneNumber,
                Fullname = updatedUser.Fullname,
                City = updatedUser.City,
                Description = updatedUser.Description,
                FacebookLink = updatedUser.FacebookLink,
                GithubLink = updatedUser.GithubLink,
                School = updatedUser.School,
            };

            return Ok(userResponse);
        }

        // Delete user
        [HttpDelete(UserRoute.Action.Delete)]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result) return NotFound("User not found");

            return NoContent();
        }
    }
}
