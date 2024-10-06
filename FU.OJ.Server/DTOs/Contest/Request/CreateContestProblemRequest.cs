using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Contest.Request
{
    public class CreateContestProblemRequest
    {
        [Required]
        public string ProblemCode { get; set; } = null!;
        [Required]
        public int Order { get; set; }
        [Required]
        public double Point { get; set; }
    }
}
