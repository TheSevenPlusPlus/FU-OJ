namespace FU.OJ.Server.Infra.Const.Route
{
    public class UserRoute
    {
        public const string INDEX = "user";
        public static class Action
        {
            public const string Create = "create";
            public const string GetAll = "get";
            public const string GetById = "get/{id}";
            public const string GetByUsername = "get/{userName}";

            public const string Update = "update";
            public const string Delete = "delete";

        }
    }
}