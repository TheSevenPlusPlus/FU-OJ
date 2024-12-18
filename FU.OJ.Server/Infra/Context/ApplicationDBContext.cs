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
        public DbSet<Contest> Contests { get; set; }
        public DbSet<ContestParticipant> ContestParticipants { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<BlogComment> BlogComments { get; set; }
        public DbSet<ProblemUser> ProblemUsers { get; set; }
        public DbSet<ContestProblem> ContestProblems { get; set; }
        public DbSet<ContestRank> contestRanks { get; set; }
        public DbSet<ExampleInputOutput> ExampleInputOutputs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new ContestConfiguration());
            modelBuilder.ApplyConfiguration(new SubmissionConfiguration());
            modelBuilder.ApplyConfiguration(new ResultConfiguration());
            modelBuilder.ApplyConfiguration(new ContestParticipantConfiguration());
            modelBuilder.ApplyConfiguration(new ProblemConfiguration());
            modelBuilder.ApplyConfiguration(new BlogConfiguration());
            modelBuilder.ApplyConfiguration(new BlogCommentConfiguration());
            modelBuilder.ApplyConfiguration(new ContestProblemConfiguration());
            modelBuilder.ApplyConfiguration(new ProblemUserConfiguration());
            modelBuilder.ApplyConfiguration(new ExampleInputOutputConfiguration());
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }
    }
}
