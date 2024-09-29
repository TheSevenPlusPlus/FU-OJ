using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;using Microsoft.EntityFrameworkCore.Metadata.Builders;using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.Infra.Models{    public class Contest : ContestProperties
    {
        public User User { get; set; } = null!;
        public ICollection<ContestParticipant> ContestParticipants { get; set; } = new List<ContestParticipant>();
    }
    public class ContestProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string? UserId { get; set; }
    }
    public class ContestConfiguration : IEntityTypeConfiguration<Contest>
    {
        public void Configure(EntityTypeBuilder<Contest> builder)
        {
            builder.HasOne(c => c.User)
               .WithMany()
               .HasForeignKey(c => c.UserId)
               .OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(c => c.ContestParticipants)
                   .WithOne(cp => cp.Contest)
                   .HasForeignKey(cp => cp.ContestId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}