namespace FU.OJ.Server.Infra.Const.Route
{
    public class ContestRoute
    {
        public const string INDEX = "contest";
        public static class Action
        {
            public const string Create = "create";
            public const string GetByCode = "{contestCode}";
            public const string GetAll = "";
            public const string SubmitCode = "submit";
            public const string RegisterContest = "register/{contestCode}";
        }
    }
}
