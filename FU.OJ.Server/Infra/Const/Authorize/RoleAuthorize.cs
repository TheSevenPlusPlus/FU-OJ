namespace FU.OJ.Server.Infra.Const.Authorize
{
    public class RoleAuthorize
    {
        public const string AdminManager = RoleStatic.Role_Admin + ", " + RoleStatic.Role_Manager;
        public const string AnyRole = RoleStatic.Role_User + ", " + RoleStatic.Role_Admin + ", " + RoleStatic.Role_Manager;
        public const string OnlyAdmin = RoleStatic.Role_Admin;

    }
}
