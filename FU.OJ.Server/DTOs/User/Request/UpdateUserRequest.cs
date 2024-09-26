using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.User.Respond
{
    public class UpdateUserRequest
    {

        [Required(ErrorMessage = "Username is required")]
        public string UserName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }

        public string? Fullname { get; set; } = null!;
        public string? City { get; set; } = null!;
        public string? Description { get; set; } = null!;
        public string? FacebookLink { get; set; } = null!;
        public string? GithubLink { get; set; } = null!;
        public string? School { get; set; } = null!;
    }
}
