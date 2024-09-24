using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.Infra.Models
{
    public class Problem : Problem_properies
    {
        ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    }
    public class Problem_properies
    {
        [Key]
        public string id { get; set; } = Guid.NewGuid().ToString();
        public string code { get; set; } = null!;
        public string? title { get; set; }
        public string? description { get; set; }
        public string? constraints { get; set; }
        public string? example_input { get; set; }
        public string? example_output { get; set; }
        public double? time_limit { get; set; }
        public double? memory_limit { get; set; }
        public DateTime create_at { get; set; }
        public string? user_id { get; set; }
        public string? test_case_id { get; set; }
        public int? ac_quantity { get; set; }
        public string? difficulty { get; set; }
        public bool? hasSolution { get; set; }

    }

    public class Problem_configuration : IEntityTypeConfiguration<Problem>
    {
        public void Configure(EntityTypeBuilder<Problem> builder)
        {
        }
    }
}