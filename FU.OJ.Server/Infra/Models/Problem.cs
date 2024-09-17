using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
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
        public string? title { get; set; }
        public string? description { get; set; }
        public double time_limit { get; set; }
        public float memory_limit { get; set; }
        public DateTime create_at { get; set; }
        public string? user_id { get; set; }
        public int test_case_id { get; set; }
    }

    public class Problem_configuration : IEntityTypeConfiguration<Problem>
    {
        public void Configure(EntityTypeBuilder<Problem> builder)
        {
        }
    }
}