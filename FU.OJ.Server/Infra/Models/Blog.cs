using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;using Microsoft.EntityFrameworkCore.Metadata.Builders;using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.Infra.Models{    public class Blog : BlogProperties
    {
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
            builder.HasOne(b => b.User)
               .WithMany(u => u.Blogs)
               .HasForeignKey(b => b.UserId)
               .OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(b => b.Comments)
                   .WithOne(c => c.Blog)
                   .HasForeignKey(c => c.BlogId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}