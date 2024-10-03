namespace FU.OJ.Server.DTOs.User.Respond
{
    public class UserView
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }

        public string? FullName { get; set; } = null!;
        public string? City { get; set; } = null!;
        public string? Description { get; set; } = null!;
        public string? FacebookLink { get; set; } = null!;
        public string? GithubLink { get; set; } = null!;
        public string? School { get; set; } = null!;
        public string? AvatarUrl { get; set; } = null!;
        public DateTime? CreatedAt { get; set; } = null!;
    }
}
