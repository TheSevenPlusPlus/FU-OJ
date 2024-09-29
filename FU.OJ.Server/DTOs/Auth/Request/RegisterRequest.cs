using System.ComponentModel.DataAnnotations;
namespace FU.OJ.Server.DTOs.Auth.Request
{
    public class RegisterRequest
    {
        [Required]
        public string UserName { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = null!;
        [Required]
        public string FullName { get; set; } = null!;
        //[Required]
        //public string PhoneNumber { get; set; } = null!;

    }
}