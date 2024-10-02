public static class BlogCommentRoute{    public const string INDEX = "blog-comment";
    public static class Action
    {
        public const string Create = "create";
        public const string GetByBlogId = "{blogId}";
        public const string GetLastTime = "time/{username}";
        public const string Update = "";
        public const string Delete = "{id}";
    }
}