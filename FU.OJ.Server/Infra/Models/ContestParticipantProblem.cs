using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FU.OJ.Server.Infra.Models
{
    public class ContestParticipantProblem : ContestParticipantProblemProperties
    {
        public ContestParticipant ContestParticipant { get; set; } = null!;
        public ContestProblem ContestProblem { get; set; } = null!;
    }

    public class ContestParticipantProblemProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Comment("Id của người tham gia contest")]
        public string ContestParticipantId { get; set; } = null!;
        [Comment("Id của bài trong contest")]
        public string ContestProblemId { get; set; } = null!;
        [Comment("Mã của bài trong contest")]
        public string ContestProblemCode { get; set; } = null!;
        [Comment("Số lần nộp một bài của một người tham gia contest")]
        public int SubmissionCount { get; set; }
    }

    public class ContestParticipantProblemConfiguration : IEntityTypeConfiguration<ContestParticipantProblem>
    {
        public void Configure(EntityTypeBuilder<ContestParticipantProblem> builder)
        {
            builder.HasOne(cp => cp.ContestParticipant)
               .WithMany()
               .HasForeignKey(cp => cp.ContestParticipantId)
               .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(cp => cp.ContestProblem)
               .WithMany()
               .HasForeignKey(cp => cp.ContestProblemId)
               .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
