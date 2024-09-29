namespace FU.OJ.Server.DTOs.BlogComment.Request
{
    public class CreateBlogCommentRequest
    {
        public string? Content { get; set; }
        public string? Username { get; set; }
        public string? BlogId { get; set; }
    }

    public class UpdateBlogCommentRequest
    {
        public string? Content { get; set; }
    }
}
