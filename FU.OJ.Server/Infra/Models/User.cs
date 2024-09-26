using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FU.OJ.Server.Infra.Models
{
    public class User : IdentityUser
    {
        public string? Fullname { get; set; }
        public string? City { get; set; }
        public string? School { get; set; }
        public string? Description { get; set; } = null;
        public string? FacebookLink { get; set; }
        public string? GithubLink { get; set; }

        // Mối quan hệ một-nhiều với Submission
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();

        // Mối quan hệ một-nhiều với Problem
        public ICollection<Problem> Problems { get; set; } = new List<Problem>();
    }

    public class User_configuration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasMany(u => u.Submissions)
                   .WithOne(s => s.User) // Đảm bảo rằng User trong Submission tham chiếu đến đúng User
                   .HasForeignKey(s => s.user_id)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.Problems)
                   .WithOne(p => p.User) // Đảm bảo rằng User trong Problem tham chiếu đến đúng User
                   .HasForeignKey(p => p.user_id)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
