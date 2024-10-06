namespace FU.OJ.Server.Infra.Const.Route
{
    public class ContestRoute
    {
        public const string INDEX = "contests";
        public static class Action
        {
            public const string Create = "create";
            public const string GetByCode = "{contestCode}";
            public const string GetAll = "";
            public const string GetContestProblem = "problem/{contestCode}";
            public const string GetContestParticipant = "participant/{contestCode}";
            public const string SubmitCode = "submit";
            public const string RegisterContest = "register/{contestCode}";
            public const string IsRegistered = "is-registered/{contestCode}";
            public const string MaximumSubmission = "maximum-submission/{contestCode}";
        }
    }
}
