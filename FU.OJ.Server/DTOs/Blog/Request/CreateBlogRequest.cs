namespace FU.OJ.Server.DTOs.Blog.Request
{
    public class CreateBlogRequest
    {
        public string title { get; set; }
        public string content { get; set; }
        public string user_id { get; set; }
    }
}
