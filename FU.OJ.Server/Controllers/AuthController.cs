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

        //[HttpPost(AuthRoute.Action.ForgotPassword)]
        //public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest model)
        //{
        //    var user = await _userManager.FindByEmailAsync(model.Email);
        //    if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
        //    {
        //        return BadRequest("Invalid email.");
        //    }

        //    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        //    var resetLink = Url.Action("ResetPassword", "Account", new { token, email = user.Email }, Request.Scheme);

        //    // Gửi email reset mật khẩu
        //    await _emailSender.SendEmailAsync(model.Email, "Reset Password", $"Click <a href='{resetLink}'>here</a> to reset your password.");

        //    return Ok("Password reset link has been sent to your email.");
        //}

        //[HttpPost("reset-password")]
        //public async Task<IActionResult> ResetPassword(ResetPasswordRequest model)
        //{
        //    var user = await _userManager.FindByEmailAsync(model.Email);
        //    if (user == null)
        //    {
        //        return BadRequest("Invalid email.");
        //    }

        //    var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
        //    if (result.Succeeded)
        //    {
        //        return Ok("Password has been reset successfully.");
        //    }

        //    return BadRequest(result.Errors);
        //}

    }
}