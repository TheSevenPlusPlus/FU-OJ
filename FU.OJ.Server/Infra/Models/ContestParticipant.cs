using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FU.OJ.Server.Infra.Models{    public class ContestParticipant : ContestParticipantProperties
    {
        public User User { get; set; } = null!;
        public Contest Contest { get; set; } = null!;
    }
    public class ContestParticipantProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Comment("Id người tham gia")]
        public string? UserId { get; set; }
        [Comment("Id contest")]
        public string? ContestId { get; set; }
        [Comment("Điểm của người tham gia")]
        public double Score { get; set; }
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