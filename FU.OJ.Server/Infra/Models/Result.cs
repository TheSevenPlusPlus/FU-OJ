using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FU.OJ.Server.Infra.Models
{
    public class Result : ResultProperties
    {
        public Submission Submission { get; set; } = null!;
    }

    public class ResultProperties
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string SubmissionId { get; set; } = null!;
        public string? StatusDescription { get; set; }
        public string? Time { set; get; }
        public double? Memory { set; get; }
    }

    public class ResultConfiguration : IEntityTypeConfiguration<Result>
    {
        public void Configure(EntityTypeBuilder<Result> builder)
        {
            builder.HasOne(r => r.Submission)
              .WithMany(s => s.Results)
              .HasForeignKey(r => r.SubmissionId)
              .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
