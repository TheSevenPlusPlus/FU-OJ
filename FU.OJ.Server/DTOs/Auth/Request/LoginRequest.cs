using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Auth.Request{    public class LoginRequest
    {
        [Required]
        public string Identifier { get; set; } = null!;
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = null!;
    }
}