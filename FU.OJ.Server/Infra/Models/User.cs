using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json.Serialization;

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
        public ICollection<ProblemUser> ProblemsUsers { get; set; } = new List<ProblemUser>();
        public ICollection<ContestParticipant> ContestParticipants { get; set; } = new List<ContestParticipant>();
        public ICollection<Contest> Contests { get; set; } = new List<Contest>();
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

            builder.HasMany(u => u.ProblemsUsers)
                    .WithOne(pu => pu.User)
                   .HasForeignKey(pu => pu.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.ContestParticipants)
                    .WithOne(pu => pu.User)
                   .HasForeignKey(pu => pu.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(u => u.Contests)
                    .WithOne(pu => pu.User)
                   .HasForeignKey(pu => pu.OrganizationId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
