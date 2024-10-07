using FU.OJ.Server.Infra.Const;
using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Contest.Request
{
    public class UpdateContestRequest
    {
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
