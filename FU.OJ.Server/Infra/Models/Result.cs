using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using FU.OJ.Server.Infra.Enum;

namespace FU.OJ.Server.Infra.Models
{
    public class Result : Result_properties
    {
        public Submission submission { get; set; } = null!;
    }
    public class Result_properties
    {
        public string id { get; set; } = Guid.NewGuid().ToString();
        public string submission_id { get; set; } = null!;
        public eStatus_Submission? status { get; set; }
        public string? message { get; set; }
        public double? time { set; get; }
        public double? memory { set; get; }
    }
    public class Result_configuration : IEntityTypeConfiguration<Result>
    {
        public void Configure(EntityTypeBuilder<Result> builder)
        {
            builder.HasOne(e => e.submission).WithMany().HasForeignKey(e => e.submission_id);
        }
    }
}