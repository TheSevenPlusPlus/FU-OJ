using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.Infra.Models
{
    public class BlogComment : BlogCommentProperties
    {
        public User User { get; set; } = null!;
        public Blog Blog { get; set; } = null!;
    }

    public class BlogCommentProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string? UserId { get; set; }
        public string? BlogId { get; set; }
    }

    public class BlogCommentConfiguration : IEntityTypeConfiguration<BlogComment>
    {
        public void Configure(EntityTypeBuilder<BlogComment> builder)
        {
            builder.HasKey(s => s.Id);

            builder.HasOne(e => e.User)
                   .WithMany()
                   .HasForeignKey(e => e.UserId);

            builder.HasOne(e => e.Blog)
                   .WithMany()
                   .HasForeignKey(e => e.BlogId);
        }
    }
}
