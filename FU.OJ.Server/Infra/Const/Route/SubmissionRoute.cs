namespace FU.OJ.Server.Infra.Const.Route{    public class SubmissionRoute
    {
        public const string INDEX = "submissions";
        public static class Action
        {
            public const string Create = "submit";
            public const string Get = "{id}";
            public const string GetWithoutResult = "non-result/{id}";
            public const string GetAll = "all";
        }
    }}