﻿namespace FU.OJ.Server.DTOs.Blog.Request
{
    public class CreateBlogRequest
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string UserId { get; set; }
    }
}
