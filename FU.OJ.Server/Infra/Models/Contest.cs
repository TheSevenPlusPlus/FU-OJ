using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FU.OJ.Server.Infra.Models{    public class Contest : ContestProperties
    {
        public User User { get; set; } = null!;
        public ICollection<ContestParticipant> ContestParticipants { get; set; } = new List<ContestParticipant>();
        public ICollection<ContestProblem> ContestProblems { get; set; } = new List<ContestProblem>();
    }
    public class ContestProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Comment("Mã contest")]
        public string Code { get; set; } = null!;
        [Comment("Tên contest")]
        public string Name { get; set; } = null!;
        [Comment("Chú thích")]
        public string? Description { get; set; }
        [Comment("Thời gian bắt đầu")]
        public DateTime StartTime { get; set; }
        [Comment("Thời gian kết thúc")]
        public DateTime EndTime { get; set; }
        [Comment("Người tổ chức contest")]
        public string OrganizationUserId { get; set; } = null!;
        [Comment("Luật lệ")]
        public string? Rules { get; set; }
    }

    public class ContestConfiguration : IEntityTypeConfiguration<Contest>
    {
        public void Configure(EntityTypeBuilder<Contest> builder)
        {
            builder.HasOne(c => c.User)
                   .WithMany(u => u.Contests)
                   .HasForeignKey(c => c.OrganizationUserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(c => c.ContestParticipants)
                   .WithOne(cp => cp.Contest)
                   .HasForeignKey(cp => cp.ContestId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(c => c.ContestProblems)
                   .WithOne(cp => cp.Contest)
                   .HasForeignKey(cp => cp.ContestId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}