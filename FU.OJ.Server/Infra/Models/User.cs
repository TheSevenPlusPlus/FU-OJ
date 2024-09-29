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

        // Mối quan hệ một-nhiều với Submission
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();

        // Mối quan hệ một-nhiều với Problem
        public ICollection<Problem> Problems { get; set; } = new List<Problem>();
        public ICollection<Blog> Blogs { get; set; } = new List<Blog>();
    }

    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            //builder.HasKey(s => s.Id);

            //builder.HasMany(u => u.Submissions)
            //       .WithOne(s => s.User) // Đảm bảo rằng User trong Submission tham chiếu đến đúng User
            //       .HasForeignKey(s => s.UserId)
            //       .OnDelete(DeleteBehavior.Cascade);

            //builder.HasMany(u => u.Problems)
            //       .WithOne(p => p.User) // Đảm bảo rằng User trong Problem tham chiếu đến đúng User
            //       .HasForeignKey(p => p.UserId)
            //       .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
