using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Auth.Request
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
