using FU.OJ.Server.DTOs.Problem.Respond;
using FU.OJ.Server.Infra.Const;
using FU.OJ.Server.Infra.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Contest.Request
{
    public class CreateContestRequest
    {
        [Required, StringLength(15, MinimumLength = 1), RegularExpression(RegexPatterns.NoVietnameseAlphabetNoWhiteSpace, ErrorMessage = ErrorMessage.NoVietnameseNoWhiteSpace)]
        public string Code { get; set; } = null!;
        [Required]
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        public string? Rules { get; set; }
        [Required, MinLength(2)]
        public List<CreateContestProblemRequest> Problems { get; set; } = new List<CreateContestProblemRequest>();
    }
}
