using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Testcase.Request
{
    public class CreateTestcaseRequest
    {
        [Required]
        public string problem_code { get; set; } = null!;
        public IFormFile testcase_file { get; set; } = null!; //zip only
    }
}
