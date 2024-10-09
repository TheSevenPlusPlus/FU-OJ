using System.ComponentModel.DataAnnotations;
using FU.OJ.Server.Infra.Const;
using FU.OJ.Server.Infra.Models;

namespace FU.OJ.Server.DTOs.Problem.Request{    public class CreateProblemRequest
    {
        [Required, StringLength(30, MinimumLength = 1), RegularExpression(RegexPatterns.NoVietnameseAlphabetNoWhiteSpace, ErrorMessage = ErrorMessage.NoVietnameseNoWhiteSpace)]
        public string Code { get; set; } = null!;
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Constraints { get; set; }
        public string? Input { get; set; }
        public string? Output { get; set; }
        public ICollection<CreateExampleInputOutput> Examples { get; set; } = new List<CreateExampleInputOutput>();        public double TimeLimit { get; set; } = 1;
        public float MemoryLimit { get; set; } = 256 * 1024;
        public string Difficulty { get; set; } = null!;
    }
}