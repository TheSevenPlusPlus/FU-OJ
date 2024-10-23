using Exceptions;
using FU.OJ.Server.DTOs.Auth.Request;
using FU.OJ.Server.DTOs.Auth.Respond;
using FU.OJ.Server.Infra.Const.Authorize;
using FU.OJ.Server.Infra.Const.Route;
using FU.OJ.Server.Infra.Models;
using FU.OJ.Server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Web;

namespace FU.OJ.Server.Controllers
{
    [Route(AuthRoute.INDEX)]
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
                            Token = token,
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
                   Token = token,
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

            // Email template trực tiếp trong controller
            string emailTemplate = @"
    <!DOCTYPE html>
    <html lang=""en"">
    <head>
        <meta charset=""UTF-8"">
        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
        <title>Reset Your Password</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }

            .email-container {
                width: 100%;
                background: linear-gradient(to right, #1a237e, #3949ab);
                padding: 20px 0;
            }

            .email-content {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            }

            .email-header {
                text-align: center;
                margin-bottom: 30px;
            }

            .email-header img {
                max-width: 150px;
                height: auto;
            }

            .email-body {
                color: #333333;
            }

            h2 {
                color: #4CAF50;
                font-size: 24px;
                margin-bottom: 20px;
            }

            p {
                line-height: 1.6;
                margin-bottom: 15px;
            }

            .reset-button {
                display: inline-block;
                margin: 20px 0;
                padding: 12px 24px;
                color: white;
                background-color: #4CAF50;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                text-align: center;
            }

            .reset-button:hover {
                background-color: #45a049;
            }

            .email-footer {
                font-size: 12px;
                color: #888888;
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #dddddd;
            }

            .social-link {
                color: #4CAF50;
                text-decoration: none;
                display: inline-block;
                margin-top: 10px;
            }

            .social-link img {
                vertical-align: middle;
                margin-right: 5px;
            }
        </style>
    </head>
    <body>
        <div class=""email-container"">
            <div class=""email-content"">
                <div class=""email-header"">
                    <img src=""https://scontent.fhan3-2.fna.fbcdn.net/v/t39.30808-6/461991495_122107472564546420_5174621129877262716_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEG-jBeRW2UHmXmU6xV8Rb1d8cBYjKzyiZ3xwFiMrPKJm7jZnbyVkLcpdg7-I9d2Tv-k0YmafDIgIaixyU3u5N2&_nc_ohc=9kz8vli2EckQ7kNvgG-nSQ4&_nc_zt=23&_nc_ht=scontent.fhan3-2.fna&_nc_gid=AqenNJVoCONXkGGykCfgWGS&oh=00_AYD8Nj3pnGmYks2okwZp5SOARmYAv9TTrRVKF8ob1wpNxA&oe=671F0C00"" alt=""FUOJ 7EVEN++ Logo"">
                </div>
                <div class=""email-body"">
                    <h2>Reset Your Password</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password. Click the button below to reset your password:</p>
                    <p style=""text-align: center;"">
                        <a href=""{{resetLink}}"" class=""reset-button"">Reset Password</a>
                    </p>
                    <p>If you didn't request this, please ignore this email or let us know.</p>
                    <p>Thank you!</p>
                </div>
                <div class=""email-footer"">
                    <p>&copy; 2024 FUOJ. All rights reserved.</p>
                    <a href=""https://www.facebook.com/profile.php?id=61566392623284"" class=""social-link"" target=""_blank"" rel=""noopener noreferrer"">
                        <img src=""https://cdn-icons-png.flaticon.com/32/124/124010.png"" alt=""Facebook"" width=""16"" height=""16"">
                        Follow us on Facebook
                    </a>
                </div>
            </div>
        </div>
    </body>
    </html>";

            // Thay thế {{resetLink}} bằng link reset thực tế
            string emailBody = emailTemplate.Replace("{{resetLink}}", resetLink);

            // Gửi email
            await _emailSender.SendEmailAsync(model.Email, "Reset Password", emailBody);

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
