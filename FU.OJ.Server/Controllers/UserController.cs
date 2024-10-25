using FU.OJ.Server.DTOs;
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
    [Authorize]
    public class UserController : AuthorizeController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService, ILogger<UserController> logger) : base(logger)
        {
            _userService = userService;
        }
        [Authorize(Roles = RoleAuthorize.OnlyAdmin)]
        [HttpPost(UserRoute.Action.Create)]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest createUserRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var existingUserByUserName = await _userService.GetUserByUsernameAsync(createUserRequest.UserName);
            if (existingUserByUserName != null)
            {
                return BadRequest("Tên người dùng đã tồn tại.");
            }

            var existingUserByEmail = await _userService.GetUserByEmailAsync(createUserRequest.Email);
            if (existingUserByEmail != null)
            {
                return BadRequest("Email đã tồn tại.");
            }

            var existingUserByPhone = await _userService.GetUserByPhoneAsync(createUserRequest.PhoneNumber);
            if (existingUserByPhone != null)
            {
                return BadRequest("Số điện thoại đã tồn tại.");
            }

            var newUser = await _userService.CreateUserAsync(createUserRequest);
            if (newUser == null)
                return StatusCode(500, "Tạo người dùng thất bại");

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

        [Authorize(Roles = RoleAuthorize.OnlyAdmin)]
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
        [Authorize(Roles = RoleAuthorize.OnlyAdmin)]
        [HttpGet(UserRoute.Action.GetByUsername)]
        public async Task<IActionResult> GetUserByUserName([FromRoute] string userName)
        {
            var user = await _userService.GetUserByUsernameAsync(userName);
            if (user == null) return NotFound("Không tìm thấy người dùng");

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
        [Authorize(Roles = RoleAuthorize.OnlyAdmin)]
        [HttpPut(UserRoute.Action.Update)]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequest updateUserRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUserByEmail = await _userService.GetUserByEmailAsync(updateUserRequest.Email);
            if (existingUserByEmail != null && existingUserByEmail.UserName != updateUserRequest.UserName)
            {
                return BadRequest("Email đã tồn tại.");
            }

            var existingUserByPhone = await _userService.GetUserByPhoneAsync(updateUserRequest.PhoneNumber);
            if (existingUserByPhone != null && existingUserByPhone.UserName != updateUserRequest.UserName)
            {
                return BadRequest("Số điện thoại đã tồn tại.");
            }

            var user = await _userService.UpdateUserAsync(updateUserRequest);
            if (user == null) return NotFound("Không tìm thấy người dùng");

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

        [Authorize(Roles = RoleAuthorize.OnlyAdmin)]
        [HttpDelete(UserRoute.Action.Delete)]
        public async Task<IActionResult> DeleteUser(string userName)
        {
            var result = await _userService.DeleteUserAsync(userName);
            if (!result) return NotFound("User not found");

            return NoContent();
        }
        [Authorize(Roles = RoleAuthorize.OnlyAdmin)]
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
