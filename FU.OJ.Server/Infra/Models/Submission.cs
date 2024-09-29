using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FU.OJ.Server.Infra.Models
{
    public class Submission : SubmissionProperties
    {
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [ForeignKey("ProblemId")]
        public Problem Problem { get; set; } = null!;
        public ICollection<Result> Results { get; set; } = null!;
    }

    public class SubmissionProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? ProblemId { get; set; }
        public string? ProblemCode { get; set; }
        public string? SourceCode { get; set; }
        public string? LanguageName { get; set; }
        public DateTime SubmittedAt { get; set; }
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? Status { get; set; }
    }

    public class SubmissionConfiguration : IEntityTypeConfiguration<Submission>
    {
        public void Configure(EntityTypeBuilder<Submission> builder)
        {
            //builder.HasKey(s => s.Id);

            //builder.HasOne(e => e.User)
            //       .WithMany()
            //       .HasForeignKey(e => e.UserId);

            //builder.HasOne(e => e.Problem)
            //       .WithMany()
            //       .HasForeignKey(e => e.ProblemId);
        }
    }
}
