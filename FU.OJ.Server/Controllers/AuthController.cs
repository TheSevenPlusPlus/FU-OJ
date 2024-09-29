using FU.OJ.Server.DTOs.Auth.Request;using FU.OJ.Server.DTOs.Auth.Respond;using FU.OJ.Server.Infra.Const.Authorize;using FU.OJ.Server.Infra.Const.Route;using FU.OJ.Server.Infra.Models;using FU.OJ.Server.Service;using Microsoft.AspNetCore.Identity;using Microsoft.AspNetCore.Mvc;using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Controllers{    [Route(AuthRoute.INDEX)]
    [ApiController]
    public class AuthController : BaseController
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ITokenService _tokenService;
        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager,
            ITokenService tokenService, ILogger<AuthController> logger) : base(logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }
        [HttpPost(AuthRoute.Action.Register)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                var user = new User()
                {
                    UserName = registerRequest.UserName,
                    Email = registerRequest.Email,
                    FullName = registerRequest.FullName,
                    //PhoneNumber = registerRequest.PhoneNumber,
                    CreatedAt = DateTime.UtcNow,
                };
                var createUser = await _userManager.CreateAsync(user, registerRequest.Password);
                if (createUser.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(user, RoleStatic.RoleUser);
                    if (roleResult.Succeeded)
                    {
                        var token = await _tokenService.CreateToken(user); // Sử dụng await cho phương thức không đồng bộ
                        return Ok(
                            new RegisterRespond
                            {
                                UserName = user.UserName,
                                Email = user.Email,
                                Token = token,
                                AvatarUrl = user.AvatarUrl
                            }
                        );
                    }
                    else return StatusCode(500, roleResult.Errors);
                }
                else return StatusCode(500, createUser.Errors);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Error during registration"); // Ghi log lỗi
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpPost(AuthRoute.Action.Login)]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName == loginRequest.UserName);
            if (user == null) return Unauthorized("Invalid username");
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginRequest.Password, false);
            if (!result.Succeeded) return Unauthorized("Invalid password");
            var token = await _tokenService.CreateToken(user); // Sử dụng await cho phương thức không đồng bộ
            return Ok(
                new LoginRespond
                {
                    UserName = user.UserName,
                    Email = user.Email,
                    Token = token,
                    AvatarUrl = user.AvatarUrl
                }
            );
        }
        [HttpGet("CheckRole/{username}")]
        public async Task<IActionResult> CheckUserRole(string username)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (user == null) return NotFound("User not found.");
            var roles = await _userManager.GetRolesAsync(user); // Lấy danh sách role của user
            return Ok(new
            {
                UserName = user.UserName,
                Roles = roles
            });
        }
    }
}