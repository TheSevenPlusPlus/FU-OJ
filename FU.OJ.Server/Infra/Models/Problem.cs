using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FU.OJ.Server.Infra.Models
{
    public class Problem : ProblemProperties
    {
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
        [ForeignKey("TestCaseId")]
        public TestCase TestCase { get; set; }
    }

    public class ProblemProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Code { get; set; } = null!;
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Constraints { get; set; }
        public string? ExampleInput { get; set; }
        public string? ExampleOutput { get; set; }
        public double? TimeLimit { get; set; }
        public double? MemoryLimit { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UserId { get; set; }
        public string? TestCaseId { get; set; }
        public int? AcQuantity { get; set; }
        public string? Difficulty { get; set; }
        public string? HasSolution { get; set; }
    }

    public class ProblemConfiguration : IEntityTypeConfiguration<Problem>
    {
        public void Configure(EntityTypeBuilder<Problem> builder)
        {
            //builder.HasKey(s => s.Id);

            //builder.HasOne(p => p.User)
            //       .WithMany(u => u.Problems)
            //       .HasForeignKey(p => p.UserId);
        }
    }
}
