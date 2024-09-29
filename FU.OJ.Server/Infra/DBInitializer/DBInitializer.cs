using FU.OJ.Server.Infra.Const.Authorize;using FU.OJ.Server.Infra.Context;using FU.OJ.Server.Infra.Models;using Microsoft.AspNetCore.Identity;using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Infra.DBInitializer{    public interface IDbInitializer
    {
        void Initialize();
    }
    public class DbInitializer : IDbInitializer
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _db;
        public DbInitializer(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, ApplicationDbContext db)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _db = db;
        }
        public void Initialize()
        {
            string adminGuid = Guid.NewGuid().ToString();
            // Migrate the database
            try
            {
                if (_db.Database.GetPendingMigrations().Any())
                {
                    _db.Database.Migrate();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            // Create roles if they don't exist
            if (!_roleManager.RoleExistsAsync(RoleStatic.RoleUser).GetAwaiter().GetResult())
            {
                _roleManager.CreateAsync(new IdentityRole(RoleStatic.RoleAdmin)).GetAwaiter().GetResult();
                _roleManager.CreateAsync(new IdentityRole(RoleStatic.RoleManager)).GetAwaiter().GetResult();
                _roleManager.CreateAsync(new IdentityRole(RoleStatic.RoleUser)).GetAwaiter().GetResult();
                // Create admin user
                _userManager.CreateAsync(new User
                {
                    Id = adminGuid,
                    UserName = "admin",
                    Email = "admin@gmail.com",
                    FullName = "Admin",
                    PhoneNumber = "1234567890",
                    City = "City",
                }, "Abcd1234@@").GetAwaiter().GetResult();
                var adminUser = _db.Users.FirstOrDefault(u => u.UserName == "admin");
                _userManager.AddToRoleAsync(adminUser, RoleStatic.RoleAdmin).GetAwaiter().GetResult();
            }
            // Add problems to the database if none exist
            if (!_db.Problems.Any())
            {
                var problems = new List<Problem>
                {                    new Problem                    {                        Code = "P001",                        Title = "Sum of Two Numbers",                        Description =
                            "Write a program that takes two integers and returns their sum.",
                        Constraints = "Both integers should be between -10^9 and 10^9.",                        ExampleInput = "3 5",                        ExampleOutput = "8",                        TimeLimit = 1.0,                        MemoryLimit = 128.0,                        CreatedAt = DateTime.UtcNow,                        UserId = adminGuid,                        Difficulty = "Easy",                        HasSolution = "Yes",
                    },                    new Problem                    {                        Code = "P002",                        Title = "Prime Numbers",                        Description = "Write a program that checks if a number is prime.",                        Constraints = "The number should be a positive integer less than 10^6.",                        ExampleInput = "7",                        ExampleOutput = "Yes",                        TimeLimit = 1.0,                        MemoryLimit = 128.0,                        CreatedAt = DateTime.UtcNow,                        UserId = adminGuid,                        Difficulty = "Medium",                        HasSolution = "Yes",
                    },                    new Problem                    {                        Code = "P003",                        Title = "Factorial",                        Description =
                            "Write a program to calculate the factorial of a given number.",
                        Constraints =
                            "The number should be a non-negative integer less than or equal to 20.",
                        ExampleInput = "5",                        ExampleOutput = "120",                        TimeLimit = 1.0,                        MemoryLimit = 128.0,                        CreatedAt = DateTime.UtcNow,                        UserId = adminGuid,                        Difficulty = "Easy",                        HasSolution = "Yes",
                    },
                };                _db.Problems.AddRange(problems);
                _db.SaveChanges();
            }
            // Add additional users
            var users = new List<User>
            {                new User
                {
                    UserName = "user1",
                    Email = "user1@gmail.com",
                    FullName = "User One",
                    PhoneNumber = "1111111111",
                    City = "City",
                },
                new User
                {
                    UserName = "user2",
                    Email = "user2@gmail.com",
                    FullName = "User Two",
                    PhoneNumber = "2222222222",
                    City = "City",
                },
                new User
                {
                    UserName = "user3",
                    Email = "user3@gmail.com",
                    FullName = "User Three",
                    PhoneNumber = "3333333333",
                    City = "City",
                },
                new User
                {
                    UserName = "user4",
                    Email = "user4@gmail.com",
                    FullName = "User Four",
                    PhoneNumber = "4444444444",
                    City = "City",
                },
                new User
                {
                    UserName = "user5",
                    Email = "user5@gmail.com",
                    FullName = "User Five",
                    PhoneNumber = "5555555555",
                    City = "City",
                },
            };            foreach (var user in users)
            {
                var result = _userManager.CreateAsync(user, "Password123!").GetAwaiter().GetResult();
                if (result.Succeeded)
                {
                    _userManager.AddToRoleAsync(user, RoleStatic.RoleUser).GetAwaiter().GetResult();
                }
            }
            // Add blog posts about algorithms if none exist
            if (!_db.Blogs.Any())
            {
                var blogs = new List<Blog>
                {                    new Blog
                    {
                        Title = "Introduction to Algorithms",
                        Content = "This blog discusses the basics of algorithms.",
                        UserId = adminGuid,
                    },
                    new Blog
                    {
                        Title = "Sorting Algorithms",
                        Content = "An overview of various sorting algorithms.",
                        UserId = adminGuid,
                    },
                    new Blog
                    {
                        Title = "Dynamic Programming",
                        Content = "Understanding dynamic programming and its applications.",
                        UserId = adminGuid,
                    },
                    new Blog
                    {
                        Title = "Graph Algorithms",
                        Content = "Exploring common graph algorithms.",
                        UserId = adminGuid,
                    },
                    new Blog
                    {
                        Title = "Complexity Analysis",
                        Content = "How to analyze the complexity of algorithms.",
                        UserId = adminGuid,
                    },
                };                _db.Blogs.AddRange(blogs);
                _db.SaveChanges();
            }
        }

    }}