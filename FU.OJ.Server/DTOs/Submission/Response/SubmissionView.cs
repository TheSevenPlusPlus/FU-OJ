using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Submission.Response{    public class ResultView
    {
        public string? StatusDescription { get; set; }
        public string? Time { set; get; }
        public double? Memory { set; get; }
    }
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
        public string? UserName { get; set; }
        public string? Status { get; set; }
        public ICollection<ResultView> Results { get; set; } = new List<ResultView>();
    }
}