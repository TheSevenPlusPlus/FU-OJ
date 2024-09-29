namespace FU.OJ.Server.DTOs.User.Request
{
    public class ChangePasswordRequest
    {
        public string UserName { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
