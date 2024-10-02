using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FU.OJ.Server.Infra.Models{    public class Problem : ProblemProperties
    {
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        public ICollection<ProblemUser> ProblemUsers { get; set; } = new List<ProblemUser>();
        public User User { get; set; } = null!;
    }
    public class ProblemProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Code { get; set; } = null!;
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Constraints { get; set; }
        public string? Input { get; set; }
        public string? Output { get; set; }
        public string? ExampleInput { get; set; }
        public string? ExampleOutput { get; set; }
        public double? TimeLimit { get; set; }
        public double? MemoryLimit { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UserId { get; set; }
        public int TotalTests { get; set; }
        public int? AcQuantity { get; set; }
        public string? Difficulty { get; set; }
        public string? HasSolution { get; set; }
        public string? TestCasePath { get; set; } = null!; // folder ch?a test

    }
    public class ProblemConfiguration : IEntityTypeConfiguration<Problem>
    {
        public void Configure(EntityTypeBuilder<Problem> builder)
        {
            builder.HasOne(p => p.User)
               .WithMany(u => u.Problems)
               .HasForeignKey(p => p.UserId)
               .OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(p => p.Submissions)
                   .WithOne(s => s.Problem)
                   .HasForeignKey(s => s.ProblemId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}