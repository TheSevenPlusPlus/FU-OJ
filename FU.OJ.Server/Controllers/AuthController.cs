using Exceptions;using FU.OJ.Server.DTOs.Auth.Request;using FU.OJ.Server.DTOs.Auth.Respond;using FU.OJ.Server.Infra.Const.Authorize;using FU.OJ.Server.Infra.Const.Route;using FU.OJ.Server.Infra.Models;using FU.OJ.Server.Service;using Microsoft.AspNetCore.Authorization;using Microsoft.AspNetCore.Identity;using Microsoft.AspNetCore.Mvc;using Microsoft.EntityFrameworkCore;
using System.Web;

namespace FU.OJ.Server.Controllers{    [Route(AuthRoute.INDEX)]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : AuthorizeController
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IEmailSender _emailSender;
        private readonly string _clientUrl; // Khai báo _clientUrl

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager,
           ITokenService tokenService, ILogger<AuthController> logger, IEmailSender emailSender, IConfiguration configuration) : base(logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _emailSender = emailSender;
            _clientUrl = configuration["ClientUrl"];
        }
        [HttpPost(AuthRoute.Action.Register)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
        {
            try
            {
                if (!ModelState.IsValid)
                    throw new BadException("Validate fail");

                // Kiểm tra xem email đã tồn tại chưa
                var existingUser = await _userManager.FindByEmailAsync(registerRequest.Email);
                if (existingUser != null)
                    throw new BadException("Email already exist");

                var user = new User()
                {
                    UserName = registerRequest.UserName,
                    Email = registerRequest.Email,
                    FullName = registerRequest.FullName,
                    CreatedAt = DateTime.UtcNow,
                };

                var createUser = await _userManager.CreateAsync(user, registerRequest.Password);
                if (createUser.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(user, RoleStatic.RoleUser);
                    if (roleResult.Succeeded)
                    {
                        var token = await _tokenService.CreateToken(user);
                        return Ok(new RegisterRespond
                        {
                            UserName = user.UserName,
                            Email = user.Email,
                            Token = token,
                            AvatarUrl = user.AvatarUrl
                        });
                    }
                    else throw new BadException("Something error");
                }
                else throw new BadException("Username already exist");
            }
            catch (Exception exception)
            {
                return HandleException(exception);
            }
        }
        [HttpPost(AuthRoute.Action.Login)]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest) 
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName == loginRequest.Identifier || u.Email == loginRequest.Identifier);
            if (user == null) return Unauthorized("Username/Email không tồn tại");
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginRequest.Password, false);
            if (!result.Succeeded) return Unauthorized("Password không đúng");
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

        [HttpPost(AuthRoute.Action.ForgotPassword)]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest("Invalid email.");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var resetLink = $"{_clientUrl}/resetpassword?token={HttpUtility.UrlEncode(token)}&email={user.Email}"; // Sử dụng _clientUrl

            // Gửi email reset mật khẩu
            await _emailSender.SendEmailAsync(model.Email, "Reset Password", $"Click <a href='{resetLink}'>here</a> to reset your password.");

            return Ok("Password reset link has been sent to your email.");
        }


        [HttpPost(AuthRoute.Action.ResetPassword)]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid request data.");
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest("Invalid email.");
            }

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
            if (result.Succeeded)
            {
                return Ok("Password has been reset successfully.");
            }

            return BadRequest(result.Errors);
        }
    }
}