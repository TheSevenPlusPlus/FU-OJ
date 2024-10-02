using System.ComponentModel.DataAnnotations;namespace FU.OJ.Server.DTOs.BlogComment.Request{    public class CreateBlogCommentRequest
    {
        [Required]
        public string Content { get; set; } = null!;
        [Required]
        public string Username { get; set; } = null!;
        [Required]
        public string BlogId { get; set; } = null!;
    }
    public class UpdateBlogCommentRequest
    {
        [Required]
        public string Content { get; set; } = null!;
        [Required]
        public string Username { get; set; } = null!;
        [Required]
        public string CommentId { get; set; } = null!;
    }
}