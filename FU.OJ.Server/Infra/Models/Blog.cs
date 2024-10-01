using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FU.OJ.Server.Infra.Models{    public class Blog : BlogProperties
    {
        public User User { get; set; } = null!;
        public ICollection<BlogComment> Comments { get; set; } = new List<BlogComment>();
    }
    public class BlogProperties
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Comment("Tiêu đề")]
        public string Title { get; set; } = null!;
        [Comment("Nội dung")]
        public string Content { get; set; } = null!;
        [Comment("Ngày tạo")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Comment("Người tạo")]
        public string UserId { get; set; } = null!;
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