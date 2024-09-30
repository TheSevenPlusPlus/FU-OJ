using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Auth.Request
{
    public class ResetPasswordRequest
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string NewPassword { get; set; }
    }

}
