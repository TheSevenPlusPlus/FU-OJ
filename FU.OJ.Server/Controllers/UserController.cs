using FU.OJ.Server.DTOs.User.Request;
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

        // Get all users
        [HttpGet(UserRoute.Action.GetAll)]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            var userResponses = users.Select(u => new UpdateUserRespond
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                Fullname = u.Fullname,
                City = u.City,
                Description = u.Description,
                FacebookLink = u.FacebookLink,
                GithubLink = u.GithubLink,
                Slogan = u.Slogan
            }).ToList();

            return Ok(userResponses);
        }

        // Get user by ID
        [HttpGet(UserRoute.Action.GetById)]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound("User not found");

            var userResponse = new UpdateUserRespond
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Fullname = user.Fullname,
                City = user.City,
                Description = user.Description,
                FacebookLink = user.FacebookLink,
                GithubLink = user.GithubLink,
                Slogan = user.Slogan
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

            var userResponse = new UpdateUserRespond
            {
                Id = updatedUser.Id,
                UserName = updatedUser.UserName,
                Email = updatedUser.Email,
                Fullname = updatedUser.Fullname,
                City = updatedUser.City,
                Description = updatedUser.Description,
                FacebookLink = updatedUser.FacebookLink,
                GithubLink = updatedUser.GithubLink,
                Slogan = updatedUser.Slogan
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
