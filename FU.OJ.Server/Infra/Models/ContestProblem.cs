using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FU.OJ.Server.Infra.Models
{
    public class ContestProblem : ContestProblemProperties
    {
        public Contest Contest { get; set; } = null!;
        public Problem Problem { get; set; } = null!;
    }

    public class ContestProblemProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Comment("Id contest")]
        public string? ContestId { get; set; }
        [Comment("Mã bài tập")]
        public string? ContestCode { get; set; }
        [Comment("Id bài tập")]
        public string ProblemId { get; set; } = null!;
        [Comment("Mã bài tập")]
        public string ProblemCode { get; set; } = null!;
        [Comment("Điểm của người tham gia")]
        public int Order { get; set; }
        [Comment("Số lần nộp tối đa")]
        public int MaximumSubmission { get; set; }
        [Comment("Điểm của bài")]
        public double Point { get; set; }
    }

    public class ContestProblemConfiguration : IEntityTypeConfiguration<ContestProblem>
    {
        public void Configure(EntityTypeBuilder<ContestProblem> builder)
        {
            builder.HasOne(cp => cp.Contest)
                   .WithMany(c => c.ContestProblems)
                   .HasForeignKey(cp => cp.ContestId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(cp => cp.Problem)
                   .WithMany(p => p.ContestProblems)
                   .HasForeignKey(cp => cp.ProblemId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
