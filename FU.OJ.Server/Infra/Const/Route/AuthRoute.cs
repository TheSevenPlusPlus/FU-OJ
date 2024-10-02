namespace FU.OJ.Server.Infra.Const.Route{    public class AuthRoute
    {
        public const string INDEX = "auth";
        public static class Action
        {
            public const string Login = "login";
            public const string Register = "register";
            public const string ForgotPassword = "forgotpassword";
            public const string ResetPassword = "resetpassword";

        }
    }}