using Microsoft.EntityFrameworkCore;using Microsoft.EntityFrameworkCore.Metadata.Builders;using System.ComponentModel.DataAnnotations;using System.ComponentModel.DataAnnotations.Schema;namespace FU.OJ.Server.Infra.Models{
    public class Contest : ContestProperties
    {
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
        public ICollection<ContestParticipant> ContestParticipants { get; set; } = new List<ContestParticipant>();
    }

    public class ContestProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string? UserId { get; set; }
    }

    public class ContestConfiguration : IEntityTypeConfiguration<Contest>
    {
        public void Configure(EntityTypeBuilder<Contest> builder)
        {
            //builder.HasKey(s => s.Id);

            //builder.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
        }
    }}