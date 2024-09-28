using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.Infra.Models
{
    public class ContestParticipant : ContestParticipantProperties
    {
        public User User { get; set; } = null!;
        public Contest Contest { get; set; } = null!;
    }

    public class ContestParticipantProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? UserId { get; set; }
        public string? ContestId { get; set; }
    }

    public class ContestParticipantConfiguration : IEntityTypeConfiguration<ContestParticipant>
    {
        public void Configure(EntityTypeBuilder<ContestParticipant> builder)
        {
            builder.HasOne(cp => cp.User)
               .WithMany()
               .HasForeignKey(cp => cp.UserId)
               .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(cp => cp.Contest)
                   .WithMany(c => c.ContestParticipants)
                   .HasForeignKey(cp => cp.ContestId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
