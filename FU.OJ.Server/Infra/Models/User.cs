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

        //ICollection<Submission> submissions { get; set; } = new List<Submission>();
        //ICollection<Problem> problems { get; set; } = new List<Problem>();
        //ICollection<ContestParticipants> contestParticipants { get; set; } = new List<ContestParticipants>();
    }

    public class User_configuration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
        }
    }
}