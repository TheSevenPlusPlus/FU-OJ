using FU.OJ.Server.Infra.Const;
using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Problem.Request
{
    public class CreateProblemRequest
    {
        [Required, StringLength(15, MinimumLength = 1), RegularExpression(RegexPatterns.NoVietnameseAlphabetNoWhiteSpace, ErrorMessage = ErrorMessage.NoVietnameseNoWhiteSpace)]
        public string code { get; set; } = null!;
        public string? title { get; set; }
        public string? description { get; set; }
        public string? constraints { get; set; }
        public string? example_input { get; set; }
        public string? example_output { get; set; }
        public double time_limit { get; set; }
        public float memory_limit { get; set; }
        public DateTime create_at { get; set; }
        public string? user_id { get; set; }
        public int test_case_id { get; set; }
    }
}
