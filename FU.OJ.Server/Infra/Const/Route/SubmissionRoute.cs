namespace FU.OJ.Server.Infra.Const.Route
{
    public class SubmissionRoute
    {
        public const string INDEX = "submissions";
        public static class Action
        {
            public const string Create = "submit";
            public const string Get = "{token}";
            public const string GetWithoutResult = "non-result/{token}";
            public const string GetAll = "";
            public const string GetAllBelongUser = "all/user";
        }
    }
}