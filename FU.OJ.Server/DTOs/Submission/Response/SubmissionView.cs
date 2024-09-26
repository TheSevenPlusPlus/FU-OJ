using FU.OJ.Server.Infra.Models;
using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Submission.Response
{
    public class SubmissionView
    {
        public string id { get; set; } = null!;
        public string? problem_id { get; set; }
        public string? problem_name { get; set; }
        [Required]
        public string? source_code { get; set; }
        [Required]
        public string? language_name { get; set; }
        public DateTime submit_at { get; set; }
        public string? user_id { get; set; }
        public string? user_name { get; set; }
        public string? status { get; set; }

        public List<Result> results { get; set; } = new List<Result>();
    }
}