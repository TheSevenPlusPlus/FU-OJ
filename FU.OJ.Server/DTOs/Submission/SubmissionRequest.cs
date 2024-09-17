namespace FU.OJ.Server.DTO.Submission.Request
{
    public class SubmissionRequest
    {

        public string source_code { get; set; } = null!;
        public int language_id { get; set; }
        public string? stdin { get; set; }
        public string? expected_output { get; set; }
        public float? cpu_time_limit { get; set; }
        public float? memory_limit { get; set; }
        public string? stdout { get; set; }
        public string? stderr { get; set; }
        public string? compile_output { get; set; }

    }
}