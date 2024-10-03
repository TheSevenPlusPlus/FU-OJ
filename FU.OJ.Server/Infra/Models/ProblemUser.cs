using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FU.OJ.Server.Infra.Models
{
    public class ProblemUser : ProblemUserProperties
    {
        public Problem Problem { get; set; } = null!;
        public User User { get; set; } = null!;
    }

    public class ProblemUserProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = null!;
        public string ProblemId { get; set; } = null!;
        public string? Status { get; set; }
        public int PassedTestCount { get; set; }
    }

    public class ProblemUserConfiguration : IEntityTypeConfiguration<ProblemUser>
    {
        public void Configure(EntityTypeBuilder<ProblemUser> builder)
        {
            builder.HasOne(p => p.User)
               .WithMany(u => u.ProblemsUsers)
               .HasForeignKey(p => p.UserId)
               .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(p => p.Problem)
               .WithMany(u => u.ProblemUsers)
               .HasForeignKey(p => p.ProblemId)
               .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
