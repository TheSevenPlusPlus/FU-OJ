using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.User.Request
{
    public class CreateUserRequest
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Full name is required")]
        public string Fullname { get; set; }

        public string? City { get; set; }
        public string? Description { get; set; }
        public string? FacebookLink { get; set; }
        public string? GithubLink { get; set; }
        public string? Slogan { get; set; }
        public string? Role { get; set; }
    }
}
