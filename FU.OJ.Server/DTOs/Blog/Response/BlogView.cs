namespace FU.OJ.Server.DTOs.Blog.Response
{
    public class BlogView
    {
        public string id { get; set; } = Guid.NewGuid().ToString();
        public string? title { get; set; }
        public string? content { get; set; }
        public DateTime create_at { get; set; } = DateTime.Now;
        public string? user_id { get; set; }
        public string? user_name { get; set; }
    }
}
