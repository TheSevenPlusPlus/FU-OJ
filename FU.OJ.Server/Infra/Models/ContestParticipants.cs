using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Infra.Models
{
    public class ContestParticipants : ContestParticipants_properties
    {
        public User user { get; set; } = null!;
        public Contest contest { get; set; } = null!;
    }
    public class ContestParticipants_properties
    {
        public string? id { get; set; } = Guid.NewGuid().ToString();
        public string? user_id { get; set; }
        public string? contest_id { get; set; }
    }

    public class ContestParticipants_configuration : IEntityTypeConfiguration<ContestParticipants>
    {
        public void Configure(EntityTypeBuilder<ContestParticipants> builder)
        {
            builder.HasOne(e => e.user).WithMany().HasForeignKey(e => e.user_id);
            builder.HasOne(e => e.contest).WithMany().HasForeignKey(e => e.contest_id);
        }
    }
}