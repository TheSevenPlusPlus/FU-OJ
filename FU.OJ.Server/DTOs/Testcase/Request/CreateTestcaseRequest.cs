using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Testcase.Request
{
    public class CreateTestcaseRequest
    {
        [Required]
        public string ProblemCode { get; set; } = null!;
        public IFormFile TestcaseFile { get; set; } = null!; //zip only
    }
}