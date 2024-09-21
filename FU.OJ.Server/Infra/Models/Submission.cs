using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.Infra.Models
{
    public class Submission : Submission_properties
    {
        public User user { get; set; } = null!;
        public Problem problem { get; set; } = null!;

        public ICollection<Result> results { get; set; } = null!;
    }
    public class Submission_properties
    {
        public string id { get; set; } = Guid.NewGuid().ToString();
        public string? problem_id { get; set; }
        public string? source_code { get; set; }
        public string? language_name { get; set; }
        public DateTime submit_at { get; set; }
        public string? user_id { get; set; }
        public string? user_name { get; set; }
        public bool? status { get; set; }
    }

    public class Submission_configuration : IEntityTypeConfiguration<Submission>
    {
        public void Configure(EntityTypeBuilder<Submission> builder)
        {
            builder.HasOne(e => e.user).WithMany().HasForeignKey(e => e.user_id);
            builder.HasOne(e => e.problem).WithMany().HasForeignKey(e => e.problem_id);
        }
    }
}