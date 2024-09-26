using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.Infra.Models
{
    public class TestCase : TestCaseProperties
    {
        public Problem Problem { get; set; } = null!;
    }

    public class TestCaseProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ProblemId { get; set; } = null!;
        public string FolderPath { get; set; } = null!; // folder chứa test
    }

    public class TestCaseConfiguration : IEntityTypeConfiguration<TestCase>
    {
        public void Configure(EntityTypeBuilder<TestCase> builder)
        {
            builder.HasKey(s => s.Id);

            builder.HasOne(e => e.Problem)
                   .WithMany()
                   .HasForeignKey(e => e.ProblemId);
        }
    }
}
