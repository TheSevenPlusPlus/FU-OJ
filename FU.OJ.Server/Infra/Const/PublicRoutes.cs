namespace FU.OJ.Server.Infra.Const
{
    public static class PublicRoutes
    {
        public static readonly string[] Routes = new[]
        {
            "/auth/register",  // Route cho đăng ký
            "/auth/login",     // Route cho đăng nhập
            "/auth/forgotpassword", // Route cho quên mật khẩu
            "/auth/resetpassword"   // Route cho đặt lại mật khẩu
            // Thêm các route công khai khác nếu cần
        };
    }
}
