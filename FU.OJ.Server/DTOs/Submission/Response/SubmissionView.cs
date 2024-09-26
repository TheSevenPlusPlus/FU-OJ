using FU.OJ.Server.Infra.Models;
using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Submission.Response
{
    public class SubmissionView
    {
        public string Id { get; set; } = null!;
        public string? ProblemId { get; set; }
        public string? ProblemName { get; set; }
        [Required]
        public string? SourceCode { get; set; }
        [Required]
        public string? LanguageName { get; set; }
        public DateTime SubmittedAt { get; set; }
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? Status { get; set; }

        public ICollection<Result> Results { get; set; } = new List<Result>();
    }
}