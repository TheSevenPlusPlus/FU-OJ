using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations.Schema;

namespace FU.OJ.Server.Infra.Models
{
    public class Result : ResultProperties
    {
        [ForeignKey("SubmissionId")]
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
            //builder.HasKey(s => s.Id);

            //builder.HasOne(e => e.Submission).WithMany().HasForeignKey(e => e.SubmissionId);
        }
    }
}
