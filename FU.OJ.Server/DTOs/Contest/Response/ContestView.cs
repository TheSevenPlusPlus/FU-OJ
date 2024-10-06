using FU.OJ.Server.Infra.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.DTOs.Contest.Response
{
    public class ContestView
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string OrganizationId { get; set; } = null!;
        public string OrganizationName { get; set; } = null!;
        public string? Rules { get; set; }
        public ICollection<ContestParticipantView> Participants { get; set; } = new List<ContestParticipantView>();
        public ICollection<ContestProblemView> Problems { get; set; } = new List<ContestProblemView>();
    }
}
