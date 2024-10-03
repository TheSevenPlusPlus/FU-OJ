using FU.OJ.Server.DTOs;
using FU.OJ.Server.DTOs.User.Request;using FU.OJ.Server.DTOs.User.Respond;using FU.OJ.Server.Infra.Const.Authorize;
using FU.OJ.Server.Infra.Const.Route;using FU.OJ.Server.Service;using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FU.OJ.Server.Controllers{    [Route(UserRoute.INDEX)]
    [ApiController]
    [Authorize(Roles = RoleAuthorize.OnlyAdmin)]
    public class UserController : AuthorizeController
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

            var existingUserByEmail = await _userService.GetUserByEmailAsync(createUserRequest.Email);
            if (existingUserByEmail != null)
            {
                return BadRequest("Email is already in use.");
            }

            var existingUserByPhone = await _userService.GetUserByPhoneAsync(createUserRequest.PhoneNumber);
            if (existingUserByPhone != null)
            {
                return BadRequest("Phone number is already in use.");
            }

            var newUser = await _userService.CreateUserAsync(createUserRequest);
            if (newUser == null)
                return StatusCode(500, "User creation failed");

            var userResponse = new UserView
            {
                UserName = newUser.UserName,
                Email = newUser.Email,
                PhoneNumber = newUser.PhoneNumber,
                FullName = newUser.FullName,
                City = newUser.City,
                Description = newUser.Description,
                FacebookLink = newUser.FacebookLink,
                GithubLink = newUser.GithubLink,
                School = newUser.School,
                AvatarUrl = newUser.AvatarUrl,
                CreatedAt = newUser.CreatedAt,
            };

            return Ok(userResponse);
        }

        [HttpGet(UserRoute.Action.GetAll)]
        public async Task<IActionResult> GetAllUsers([FromQuery] Paging query)
        {
            try
            {
                var (users, totalPages) = await _userService.GetAllUsersAsync(query);
                return Ok(new { users, totalPages });
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
        //Duplicate route and param with GetUserByUserName
        //[HttpGet(UserRoute.Action.GetById)]
        //public async Task<IActionResult> GetUserById(string id)
        //{
        //    var user = await _userService.GetUserByIdAsync(id);
        //    if (user == null) return NotFound("User not found");

        //    var userResponse = new UserView
        //    {
        //        UserName = user.UserName,
        //        Email = user.Email,
        //        PhoneNumber = user.PhoneNumber,
        //        FullName = user.FullName,
        //        City = user.City,
        //        Description = user.Description,
        //        FacebookLink = user.FacebookLink,
        //        GithubLink = user.GithubLink,
        //        School = user.School,
        //        AvatarUrl = user.AvatarUrl,
        //        CreatedAt = user.CreatedAt,
        //    };
        //    return Ok(userResponse);
        //}

        [HttpGet(UserRoute.Action.GetDetail)]
        public async Task<IActionResult> GetUserByUserName()
        {
            var user = await _userService.GetUserByIdAsync(UserHeader.UserId);
            if (user == null) return null;
            var userResponse = new UserView
            {
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                City = user.City,
                Description = user.Description,
                FacebookLink = user.FacebookLink,
                GithubLink = user.GithubLink,
                School = user.School,
                AvatarUrl = user.AvatarUrl,
                CreatedAt = user.CreatedAt,
            };
            return Ok(userResponse);
        }
        [HttpPut(UserRoute.Action.Update)]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequest updateUserRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUserByEmail = await _userService.GetUserByEmailAsync(updateUserRequest.Email);
            if (existingUserByEmail != null && existingUserByEmail.UserName != updateUserRequest.UserName)
            {
                return BadRequest("Email is already in use.");
            }

            var existingUserByPhone = await _userService.GetUserByPhoneAsync(updateUserRequest.PhoneNumber);
            if (existingUserByPhone != null && existingUserByPhone.UserName != updateUserRequest.UserName)
            {
                return BadRequest("Phone number is already in use.");
            }

            var user = await _userService.UpdateUserAsync(updateUserRequest);
            if (user == null) return NotFound("User not found");

            var userResponse = new UserView
            {
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                City = user.City,
                Description = user.Description,
                FacebookLink = user.FacebookLink,
                GithubLink = user.GithubLink,
                School = user.School,
                AvatarUrl = user.AvatarUrl,
                CreatedAt = user.CreatedAt,
            };

            return Ok(userResponse);
        }

        [HttpDelete(UserRoute.Action.Delete)]
        public async Task<IActionResult> DeleteUser(string userName)
        {
            var result = await _userService.DeleteUserAsync(userName);
            if (!result) return NotFound("User not found");
            return NoContent();
        }

        [HttpPut(UserRoute.Action.UpdateRole)]
        public async Task<IActionResult> EditUserRole(string userName, [FromBody] string role)
        {
            try
            {
                var result = await _userService.EditUserRoleAsync(userName, role);
                if (!result) return StatusCode(500, "Failed to edit user role");

                return Ok("User role updated successfully");
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpPut(UserRoute.Action.ChangePassword)]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest changePasswordRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _userService.ChangePasswordAsync(changePasswordRequest);
                if (!result)
                    return StatusCode(500, "Failed to change password");

                return Ok("Password changed successfully");
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
    }
}