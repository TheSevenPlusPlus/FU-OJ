using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FU.OJ.Server.Infra.Models{    public class Submission : SubmissionProperties
    {
        public User User { get; set; } = null!;
        public Problem Problem { get; set; } = null!;
        public ICollection<Result> Results { get; set; } = null!;
    }
    public class SubmissionProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ProblemId { get; set; } = null!;
        public string? ProblemCode { get; set; }
        public string? SourceCode { get; set; }
        public string? LanguageName { get; set; }
        public DateTime SubmittedAt { get; set; }
        public string UserId { get; set; } = null!;
        public string? UserName { get; set; }
        public string? Status { get; set; }
    }
    public class SubmissionConfiguration : IEntityTypeConfiguration<Submission>
    {
        public void Configure(EntityTypeBuilder<Submission> builder)
        {
            builder.HasOne(s => s.User)
               .WithMany(u => u.Submissions)
               .HasForeignKey(s => s.UserId)
               .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(s => s.Problem)
                   .WithMany(p => p.Submissions)
                   .HasForeignKey(s => s.ProblemId)
                   .OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(s => s.Results)
                   .WithOne(r => r.Submission)
                   .HasForeignKey(r => r.SubmissionId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}