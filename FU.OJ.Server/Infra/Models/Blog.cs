using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FU.OJ.Server.Infra.Models
{
    public class Blog : BlogProperties
    {
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
        public ICollection<BlogComment> Comments { get; set; } = new List<BlogComment>();
    }

    public class BlogProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? Title { get; set; }
        public string? Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? UserId { get; set; }
    }

    public class BlogConfiguration : IEntityTypeConfiguration<Blog>
    {
        public void Configure(EntityTypeBuilder<Blog> builder)
        {
            //builder.HasKey(s => s.Id);

            //builder.HasOne(e => e.User)
            //       .WithMany()
            //       .HasForeignKey(e => e.UserId);

            // Add further configurations if needed, like specifying table names, indices, etc.
        }
    }
}
