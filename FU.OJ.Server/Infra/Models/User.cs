using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FU.OJ.Server.Infra.Models
{
    public class User : IdentityUser
    {
        public string? FullName { get; set; }
        public string? City { get; set; }
        public string? School { get; set; }
        public string? Description { get; set; }
        public string? FacebookLink { get; set; }
        public string? GithubLink { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
        public ICollection<Problem> Problems { get; set; } = new List<Problem>();
        public ICollection<Blog> Blogs { get; set; } = new List<Blog>();
    }

    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasMany(u => u.Submissions)
               .WithOne(s => s.User)
               .HasForeignKey(s => s.UserId)
               .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.Problems)
                   .WithOne(p => p.User)
                   .HasForeignKey(p => p.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.Blogs)
                   .WithOne(b => b.User)
                   .HasForeignKey(b => b.UserId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
