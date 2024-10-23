namespace FU.OJ.Server.Infra.Const.Route{    public class UserRoute
    {
        public const string INDEX = "user";
        public static class Action
        {
            public const string Create = "create";
            public const string GetAll = "get";
            public const string GetDetail = "detail";            public const string GetByUsername = "get/{userName}";            public const string GetByToken= "getbytoken";            public const string Update = "update";
            public const string Delete = "delete/{userName}";
            public const string UpdateRole = "update/role/{userName}";
            public const string ChangePassword = "changepassword";
        }
    }
}