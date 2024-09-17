using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Testcase.Request
{
    public class CreateTestcaseRequest
    {
        [Required]
        public string problem_id { get; set; } = null!;
        public string folder_path { get; set; } = null!; //Link to folder chua testcase
    }
}
