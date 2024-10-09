using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.Infra.Models
{
    public class ExampleInputOutput : ExampleInputOutputProperties
    {
        public Problem Problem { get; set; } = null!;
    }

    public class ExampleInputOutputProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? Input {  get; set; }
        public string? Output { get; set; }
        public string ProblemId { get; set; } = null!;
    }

    public class ExampleInputOutputConfiguration : IEntityTypeConfiguration<ExampleInputOutput>
    {
        public void Configure(EntityTypeBuilder<ExampleInputOutput> builder)
        {
            builder.HasOne(p => p.Problem)
                   .WithMany(u => u.Examples)
                   .HasForeignKey(p => p.ProblemId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
