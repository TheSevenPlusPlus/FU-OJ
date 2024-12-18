namespace FU.OJ.Server.DTOs.BlogComment.Response{    public class BlogCommentResponse
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? UserName { get; set; }
    }
}