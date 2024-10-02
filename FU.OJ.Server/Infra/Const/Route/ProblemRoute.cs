namespace FU.OJ.Server.Infra.Const.Route{    public class ProblemRoute
    {
        public const string INDEX = "problem";
        public static class Action
        {
            public const string Create = "create";
            public const string Update = "update";
            public const string Delete = "delete/{id}";
            public const string GetProblemByCodeAsync = "{code}";
            public const string GetAllProblemsAsync = "";
        }
    }}