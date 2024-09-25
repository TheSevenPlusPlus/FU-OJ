using FU.OJ.Server.DTOs.User.Request;
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

        [HttpPut(UserRoute.Action.Update)]
        public async Task<IActionResult> UpdateUser([FromBody] CreateUserRequest updateUserRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedUser = await _userService.UpdateProfileAsync(updateUserRequest);
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
    }


}
