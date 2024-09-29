using Microsoft.EntityFrameworkCore;using Microsoft.EntityFrameworkCore.Metadata.Builders;using System.ComponentModel.DataAnnotations;using System.ComponentModel.DataAnnotations.Schema;namespace FU.OJ.Server.Infra.Models{
    public class ContestParticipant : ContestParticipantProperties
    {
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
        [ForeignKey("ContestId")]
        public Contest Contest { get; set; } = null!;
    }

    public class ContestParticipantProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? UserId { get; set; }
        public string? ContestId { get; set; }
    }

    public class ContestParticipantConfiguration : IEntityTypeConfiguration<ContestParticipant>
    {
        public void Configure(EntityTypeBuilder<ContestParticipant> builder)
        {
            //builder.HasKey(s => s.Id);

            //builder.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
            //builder.HasOne(e => e.Contest).WithMany().HasForeignKey(e => e.ContestId);
        }
    }}