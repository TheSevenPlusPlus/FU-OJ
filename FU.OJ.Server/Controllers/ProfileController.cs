using FU.OJ.Server.DTOs.User.Respond;
using FU.OJ.Server.Infra.Const.Route;
using FU.OJ.Server.Service;
using Microsoft.AspNetCore.Mvc;

namespace FU.OJ.Server.Controllers
{
    [Route("Profile")]
    [ApiController]
    public class ProfileController : BaseController
    {
        private readonly IUserService _userService;

        public ProfileController(IUserService userService, ILogger<ProfileController> logger) : base(logger)
        {
            _userService = userService;
        }

        [HttpGet(UserRoute.Action.GetByUsername)]
        public async Task<IActionResult> GetUserByUsername(string userName)
        {
            var user = await _userService.GetUserByUsername(userName);
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

        [HttpPut(UserRoute.Action.Update)]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequest updateUserRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedUser = await _userService.UpdateProfileAsync(updateUserRequest);
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
    }


}
