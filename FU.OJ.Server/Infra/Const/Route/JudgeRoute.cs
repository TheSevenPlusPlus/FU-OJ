namespace FU.OJ.Server.Infra.Const.Route
{
    public class JudgeRoute
    {
        public const string INDEX = "system";

        public static class Action
        {
            public const string GetAll = "languages";
            public const string GetDetail = "languages/{id}";
            public const string GetActive = "languages/all";
            public const string GetStatus = "statuses";
            public const string About = "about";
            public const string SystemInfo = "system_info";
            public const string ConfigInfo = "config_info";
            public const string Statistics = "statistics";
            public const string Workers = "workers";
        }
    }
}
