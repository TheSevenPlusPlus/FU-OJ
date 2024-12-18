using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Submission.Request{    public class CreateSubmissionRequest
    {
        [Required]
        public string SourceCode { get; set; } = null!;
        [Required]
        public int LanguageId { get; set; }
        [Required]
        public string LanguageName { get; set; } = null!;
        [Required]
        public string ProblemCode { get; set; } = null!;
        [Required]
        public string ProblemId { get; set; } = null!;
    }}