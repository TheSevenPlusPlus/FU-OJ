using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FU.OJ.Server.Infra.Models{    public class Contest : ContestProperties
    {
        public User User { get; set; } = null!;
        public ICollection<ContestParticipant> ContestParticipants { get; set; } = new List<ContestParticipant>();
    }
    public class ContestProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Comment("Tên contest")]
        public string? Name { get; set; }
        [Comment("Chú thích")]
        public string? Description { get; set; }
        [Comment("Thời gian bắt đầu")]
        public DateTime StartTime { get; set; }
        [Comment("Thời gian kết thúc")]
        public DateTime EndTime { get; set; }
        [Comment("Diễn ra trong bao lâu: phút")]
        public int Duration { get; set; }
        [Comment("Người tổ chức contest")]
        public string? UserId { get; set; }
        [Comment("Luật lệ")]
        public string? Rules { get; set; }
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