using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.User.Request{    public class CreateUserRequest
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;
        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long")]
        public string Password { get; set; } = string.Empty;
        [Required(ErrorMessage = "Full name is required")]
        public string FullName { get; set; } = string.Empty;
        public string? City { get; set; } = null!;
        public string? Description { get; set; } = null!;
        public string? FacebookLink { get; set; } = null!;
        public string? GithubLink { get; set; } = null!;
        public string? School { get; set; } = null!;
        public string? AvatarUrl { get; set; } = null!;
    }
}