using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;using Microsoft.EntityFrameworkCore.Metadata.Builders;using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.Infra.Models{    public class BlogComment : BlogCommentProperties
    {
        public User User { get; set; } = null!;
        public Blog Blog { get; set; } = null!;
    }
    public class BlogCommentProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? UserId { get; set; }
        public string? BlogId { get; set; }
    }
    public class BlogCommentConfiguration : IEntityTypeConfiguration<BlogComment>
    {
        public void Configure(EntityTypeBuilder<BlogComment> builder)
        {
            builder.HasOne(c => c.User)
               .WithMany()
               .HasForeignKey(c => c.UserId)
               .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(c => c.Blog)
                   .WithMany(b => b.Comments)
                   .HasForeignKey(c => c.BlogId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}