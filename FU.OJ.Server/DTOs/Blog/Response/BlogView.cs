namespace FU.OJ.Server.DTOs.Blog.Response{    public class BlogView
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? Title { get; set; }
        public string? Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? UserId { get; set; }
        public string? UserName { get; set; }
    }
}