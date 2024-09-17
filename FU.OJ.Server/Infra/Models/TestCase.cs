using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.Infra.Models
{
    public class TestCase : TestCase_properties
    {
        public Problem problem { get; set; } = null!;
    }
    public class TestCase_properties
    {
        [Key]
        public string id { get; set; } = Guid.NewGuid().ToString();
        public string problem_id { get; set; } = null!;
        public string? input { get; set; } //Link to Input folder
        public string? output { get; set; } //Link to Output folder
    }
    public class TestCase_configuration : IEntityTypeConfiguration<TestCase>
    {
        public void Configure(EntityTypeBuilder<TestCase> builder)
        {
            builder.HasOne(e => e.problem).WithMany().HasForeignKey(e => e.problem_id);
        }
    }
}