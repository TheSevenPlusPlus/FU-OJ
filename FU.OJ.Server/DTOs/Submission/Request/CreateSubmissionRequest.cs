namespace FU.OJ.Server.DTOs.Submission.Request
{
    public class CreateSubmissionRequest
    {
        public string source_code { get; set; } = null!;
        public int language_id { get; set; }
        public string problem_code { get; set; } = null!;
    }
}
