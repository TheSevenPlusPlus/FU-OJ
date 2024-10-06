using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Contest.Response
{
    public class ContestParticipantView
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? ContestId { get; set; }
        public string? ContestCode { get; set; }
        public double Score { get; set; }
        public List<ContestProblemView>? Problems { get; set; } = new List<ContestProblemView>();
    }
}
