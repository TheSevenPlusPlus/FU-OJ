namespace FU.OJ.Server.DTOs.Submission.Request
{
    public class SubmissionRequest
    {
        public string source_code { get; set; } = null!;
        public int language_id { get; set; }
        public string? stdin { get; set; }
        public string? expected_output { get; set; }
        public double? cpu_time_limit { get; set; }
        public double? memory_limit { get; set; }
    }
}
