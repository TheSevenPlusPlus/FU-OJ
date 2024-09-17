using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Infra.Models
{
    public class Contest : Contest_properties
    {
        public User user { get; set; } = null!;
        public ICollection<ContestParticipants> contestParticipants { get; set; } = new List<ContestParticipants>();
    }
    public class Contest_properties
    {
        public string id { get; set; } = Guid.NewGuid().ToString();
        public string? name { get; set; }
        public string? description { get; set; }
        public DateTime start_time { get; set; }
        public DateTime end_time { get; set; }
        public string? user_id { get; set; }
    }

    public class Contest_configuration : IEntityTypeConfiguration<Contest>
    {
        public void Configure(EntityTypeBuilder<Contest> builder)
        {
            builder.HasOne(e => e.user).WithMany().HasForeignKey(e => e.user_id);
        }
    }
}