public static class BlogCommentRoute
{
    public const string INDEX = "blog-comment";

    public static class Action
    {
        public const string Create = "create";
        public const string GetByBlogId = "{blogId}";
        public const string GetLastTime = "time/{username}";
        // Thêm các hằng số cho các hành động khác nếu cần
    }
}
