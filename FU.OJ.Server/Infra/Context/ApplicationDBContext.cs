using FU.OJ.Server.Infra.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Infra.Context
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        private readonly IConfiguration _config;
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration config) : base(options)
        {
            _config = config;
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Problem> Problems { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<Result> Results { get; set; }
        public DbSet<TestCase> TestCases { get; set; }
        public DbSet<Contest> Contests { get; set; }
        public DbSet<ContestParticipants> ContestsParticipants { get; set; }
        public DbSet<Blog> Blogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new User_configuration());
            modelBuilder.ApplyConfiguration(new Contest_configuration());
            modelBuilder.ApplyConfiguration(new Submission_configuration());
            modelBuilder.ApplyConfiguration(new Result_configuration());
            modelBuilder.ApplyConfiguration(new ContestParticipants_configuration());
            modelBuilder.ApplyConfiguration(new TestCase_configuration());
            modelBuilder.ApplyConfiguration(new Problem_configuration());
            modelBuilder.ApplyConfiguration(new Blog_configuration());
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

    }
}