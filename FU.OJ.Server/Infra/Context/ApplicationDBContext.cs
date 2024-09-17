using FU.OJ.Server.Infra.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System;
using System.Linq.Expressions;
using System.Reflection.Emit;

namespace FU.OJ.Server.Infra.Context
{
    public class ApplicationDBContext : DbContext
    {
        private readonly IConfiguration _config;
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options, IConfiguration config) : base(options)
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
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

    }
}