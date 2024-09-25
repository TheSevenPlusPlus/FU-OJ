using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.User.Respond
{
    public class UpdateUserRespond
    {
        [Required(ErrorMessage = "User ID is required")]
        public string Id { get; set; }

        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        public string? Fullname { get; set; }
        public string? City { get; set; }
        public string? Description { get; set; }
        public string? FacebookLink { get; set; }
        public string? GithubLink { get; set; }
        public string? Slogan { get; set; }
    }
}
