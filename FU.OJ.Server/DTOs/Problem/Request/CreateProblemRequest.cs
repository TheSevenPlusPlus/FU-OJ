using System.ComponentModel.DataAnnotations;
using FU.OJ.Server.Infra.Const;

namespace FU.OJ.Server.DTOs.Problem.Request{    public class CreateProblemRequest
    {
        [Required, StringLength(15, MinimumLength = 1), RegularExpression(RegexPatterns.NoVietnameseAlphabetNoWhiteSpace, ErrorMessage = ErrorMessage.NoVietnameseNoWhiteSpace)]
        public string Code { get; set; } = null!;
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Constraints { get; set; }
        public string? Input { get; set; }
        public string? Output { get; set; }
        public string? ExampleInput { get; set; }
        public string? ExampleOutput { get; set; }        public double TimeLimit { get; set; } = 1;
        public float MemoryLimit { get; set; } = 256 * 1024;
        public string? Difficulty { get; set; }
    }
}