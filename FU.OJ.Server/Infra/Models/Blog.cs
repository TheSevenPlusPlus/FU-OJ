using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FU.OJ.Server.Infra.Models
{
    public class Blog : Blog_properties
    {
        public User user { get; set; } = null!;
        public ICollection<BlogComment> comments { get; set; } = new List<BlogComment>();

    }
    public class Blog_properties
    {
        public string id { get; set; } = Guid.NewGuid().ToString();
        public string? title { get; set; }
        public string? content { get; set; }
        public DateTime create_at { get; set; } = DateTime.Now;
        public string? user_id { get; set; }
    }

    public class Blog_configuration : IEntityTypeConfiguration<Blog>
    {
        public void Configure(EntityTypeBuilder<Blog> builder)
        {
            builder.HasOne(e => e.user).WithMany().HasForeignKey(e => e.user_id);
        }
    }
}
