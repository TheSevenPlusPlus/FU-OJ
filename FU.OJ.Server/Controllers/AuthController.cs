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

                        // Tạo template email chào mừng
                        string welcomeEmailTemplate = @"
                    <!DOCTYPE html>
                    <html lang=""en"">
                    <head>
                        <meta charset=""UTF-8"">
                        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                        <title>Welcome to FU Online Judge</title>
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                margin: 0;
                                padding: 0;
                                background-color: #f0f0f0;
                                color: #333;
                            }
                            .email-container {
                                width: 100%;
                                background: #ffffff;
                                padding: 20px 0;
                            }
                            .email-content {
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                padding: 40px;
                                border: 1px solid #e0e0e0;
                                border-radius: 4px;
                                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                            }
                            .email-header {
                                text-align: center;
                                margin-bottom: 30px;
                                border-bottom: 2px solid #333;
                                padding-bottom: 20px;
                            }
                            .email-header h1 {
                                color: #333;
                                font-size: 28px;
                                font-weight: 700;
                                margin: 0;
                                text-transform: uppercase;
                                letter-spacing: 2px;
                            }
                            .email-body {
                                color: #333;
                            }
                            h2 {
                                color: #333;
                                font-size: 22px;
                                margin-bottom: 20px;
                                font-weight: 600;
                            }
                            p {
                                line-height: 1.6;
                                margin-bottom: 15px;
                            }
                            .email-footer {
                                font-size: 12px;
                                color: #777;
                                text-align: center;
                                margin-top: 30px;
                                padding-top: 20px;
                                border-top: 1px solid #e0e0e0;
                            }
                            .social-link {
                                color: #333;
                                text-decoration: none;
                                display: inline-block;
                                margin-top: 10px;
                                transition: color 0.3s ease;
                            }
                            .social-link:hover {
                                color: #555;
                            }
                            .social-icon {
                                font-size: 16px;
                                margin-right: 5px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class=""email-container"">
                            <div class=""email-content"">
                                <div class=""email-header"">
                                    <h1>Welcome to FU Online Judge</h1>
                                </div>
                                <div class=""email-body"">
                                    <h2>Welcome, {{fullName}}!</h2>
                                    <p>Thank you for registering at FU Online Judge. We are thrilled to have you as a part of our community.</p>
                                    <p>Here at FU Online Judge, we strive to provide a platform for you to enhance your programming skills and challenge yourself with various coding problems.</p>
                                    <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
                                    <p>We hope you enjoy solving problems and improving your skills with us.</p>
                                    <p>Best regards,<br>FU Online Judge Team</p>
                                </div>
                                <div class=""email-footer"">
                                    <p>&copy; 2024 FU Online Judge. All rights reserved.</p>
                                    <a href=""https://www.facebook.com/profile.php?id=61566392623284"" class=""social-link"" target=""_blank"" rel=""noopener noreferrer"">
                                        <span class=""social-icon"">📘</span>
                                        Follow us on Facebook
                                    </a>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>";

                        // Thay thế {{fullName}} bằng tên thật của người dùng
                        string welcomeEmailBody = welcomeEmailTemplate.Replace("{{fullName}}", user.FullName);

                        // Gửi email chào mừng
                        await _emailSender.SendEmailAsync(user.Email, "Welcome to FU Online Judge", welcomeEmailBody);

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
                </head>
                <body style=""font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f0f0f0; color: #333;"">
                    <table width=""100%"" cellpadding=""0"" cellspacing=""0"" border=""0"" style=""background-color: #ffffff; padding: 20px 0;"">
                        <tr>
                            <td align=""center"">
                                <table width=""600"" cellpadding=""0"" cellspacing=""0"" border=""0"" style=""background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 4px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);"">
                                    <tr>
                                        <td style=""padding: 40px;"">
                                            <table width=""100%"" cellpadding=""0"" cellspacing=""0"" border=""0"">
                                                <tr>
                                                    <td align=""center"" style=""padding-bottom: 20px; border-bottom: 2px solid #333;"">
                                                        <h1 style=""color: #333; font-size: 28px; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 2px;"">FU Online Judge</h1>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style=""padding-top: 30px;"">
                                                        <h2 style=""color: #333; font-size: 22px; margin-bottom: 20px; font-weight: 600;"">Reset Your Password</h2>
                                                        <p style=""line-height: 1.6; margin-bottom: 15px;"">Hello,</p>
                                                        <p style=""line-height: 1.6; margin-bottom: 15px;"">We received a request to reset your password. Click the button below to reset your password:</p>
                                                        <p style=""text-align: center; margin: 20px 0;"">
                                                            <a href=""{{resetLink}}"" style=""display: inline-block; padding: 12px 24px; color: #ffffff; background-color: #333; text-decoration: none; border-radius: 3px; font-size: 16px; font-weight: bold; text-align: center;"">Reset Password</a>
                                                        </p>
                                                        <p style=""line-height: 1.6; margin-bottom: 15px;"">If you didn't request this, please ignore this email or let us know.</p>
                                                        <p style=""line-height: 1.6; margin-bottom: 15px;"">Thank you for your attention to this matter.</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style=""font-size: 12px; color: #777; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;"">
                                                        <p style=""margin-bottom: 10px;"">&copy; 2024 FU Online Judge. All rights reserved.</p>
                                                        <a href=""https://www.facebook.com/profile.php?id=61566392623284"" style=""color: #333; text-decoration: none; display: inline-block; margin-top: 10px;"" target=""_blank"" rel=""noopener noreferrer"">
                                                            <span style=""font-size: 16px; margin-right: 5px;"">📘</span>
                                                            Follow us on Facebook
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
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
