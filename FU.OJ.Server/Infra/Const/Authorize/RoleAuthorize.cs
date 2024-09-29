namespace FU.OJ.Server.Infra.Const.Authorize{
    public class RoleAuthorize
    {
        public const string AdminManager = RoleStatic.RoleAdmin + ", " + RoleStatic.RoleManager;
        public const string AnyRole = RoleStatic.RoleAdmin + ", " + RoleStatic.RoleManager + ", " + RoleStatic.RoleUser;
        public const string OnlyAdmin = RoleStatic.RoleAdmin;

    }}