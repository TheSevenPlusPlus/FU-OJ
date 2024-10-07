using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FU.OJ.Server.Infra.Models
{
    public class ContestRank : ContestRankProperties
    {
        public ContestParticipant Participant { get; set; } = null!;
        public ContestProblem Problem { get; set; } = null!;
    }

    public class ContestRankProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ContestProblemId { get; set; } = null!;
        public string ContestProblemCode { get; set; } = null!;
        public string ContestParticipantId { get; set; } = null!;
        public string? ContestParticipantName { get; set; }
        public int PassedTestCount { get; set; }
        public double Point { get; set; }
    }

    public class ContestRankConfiguration : IEntityTypeConfiguration<ContestRank>
    {
        public void Configure(EntityTypeBuilder<ContestRank> builder)
        {
            builder.HasOne(cp => cp.Problem)
                   .WithMany(c => c.ContestRank)
                   .HasForeignKey(cp => cp.ContestProblemId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(cp => cp.Participant)
                   .WithMany(p => p.ContestRank)
                   .HasForeignKey(cp => cp.ContestParticipantId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
