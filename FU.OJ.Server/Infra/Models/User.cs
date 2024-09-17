using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace FU.OJ.Server.Infra.Models
{
    public class User : User_properties
    {
        ICollection<Submission> submissions { get; set; } = new List<Submission>();
        ICollection<Problem> problems { get; set; } = new List<Problem>();
        ICollection<ContestParticipants> contestParticipants { get; set; } = new List<ContestParticipants>();
    }
    public class User_properties
    {
        [Key]
        public string id { get; set; } = Guid.NewGuid().ToString();
        public string? name { get; set; } = null;
        public string? email { get; set; } = null;
        public string? password { get; set; }
        public string? phone { get; set; } = null;
        public string? description { get; set; } = null;
    }
    public class User_configuration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
        }
    }
}