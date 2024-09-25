using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FU.OJ.Server.Infra.Models
{
    public class BlogComment : BlogComment_properties
    {
        public User user { get; set; } = null!;
        public Blog blog { get; set; } = null!;
    }
    public class BlogComment_properties
    {
        public string id { get; set; } = Guid.NewGuid().ToString();
        public string? content { get; set; }
        public DateTime create_at { get; set; } = DateTime.Now;
        public string? user_id { get; set; }
        public string? blog_id { get; set; }
    }

    public class BlogComment_configuration : IEntityTypeConfiguration<BlogComment>
    {
        public void Configure(EntityTypeBuilder<BlogComment> builder)
        {
            builder.HasOne(e => e.user).WithMany().HasForeignKey(e => e.user_id);
            builder.HasOne(e => e.blog).WithMany().HasForeignKey(e => e.blog_id);
        }
    }
}
