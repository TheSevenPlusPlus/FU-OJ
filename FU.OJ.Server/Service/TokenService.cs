using FU.OJ.Server.Infra.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;using System.Security.Claims;using System.Text;

namespace FU.OJ.Server.Service{    public interface ITokenService
    {
        Task<string> CreateToken(User user); // Đổi kiểu trả về thành Task<string>
    }
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly SymmetricSecurityKey _key;
        private readonly UserManager<User> _userManager;
        public TokenService(IConfiguration configuration, UserManager<User> userManager)
        {
            _configuration = configuration;
            _key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["JWT:SigningKey"])
            );
            _userManager = userManager;
        }
        public async Task<string> CreateToken(User user)
        {
            // Lấy danh sách roles của người dùng
            var roles = await _userManager.GetRolesAsync(user);

            // Tạo danh sách claims
            var claims = new List<Claim> {
                new Claim(JwtRegisteredClaimNames.GivenName, user.UserName),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
            };

            // Thêm các role của người dùng vào claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // Thêm claim "CanAccessApi" cho người dùng
            claims.Add(new Claim("CanAccessApi", "true"));

            // Tạo signing credentials
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            // Định nghĩa token descriptor
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = creds,
                Issuer = _configuration["JWT:Issuer"],
                Audience = _configuration["JWT:Audience"]
            };

            // Tạo token
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            // Trả về token dưới dạng chuỗi
            return tokenHandler.WriteToken(token);
        }

    }
}