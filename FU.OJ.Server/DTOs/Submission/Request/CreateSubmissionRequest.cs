using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Submission.Request
{
    public class CreateSubmissionRequest
    {
        [Required]
        public string source_code { get; set; } = null!;
        [Required]
        public int language_id { get; set; }
        [Required]
        public string language_name { get; set; } = null!;
        [Required]
        public string problem_code { get; set; } = null!;
        [Required]
        public string problem_id { get; set; } = null!;
    }
}
