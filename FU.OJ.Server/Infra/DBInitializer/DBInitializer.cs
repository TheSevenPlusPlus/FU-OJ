using FU.OJ.Server.Infra.Const;
using FU.OJ.Server.Infra.Context;
using FU.OJ.Server.Infra.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


namespace FU.OJ.Server.Infra.DBInitializer
{
    public interface IDBInitializer
    {
        void Initialize();
    }
    public class DBInitializer : IDBInitializer
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _db;

        public DBInitializer(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, ApplicationDbContext db)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _db = db;
        }

        public void Initialize()
        {
            string guid = Guid.NewGuid().ToString();
            // Migrate
            try
            {
                if (_db.Database.GetPendingMigrations().Count() > 0)
                {
                    _db.Database.Migrate();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            // Create roles
            if (!_roleManager.RoleExistsAsync(RoleStatic.Role_User).GetAwaiter().GetResult())
            {
                _roleManager.CreateAsync(new IdentityRole(RoleStatic.Role_Admin)).GetAwaiter().GetResult();
                _roleManager.CreateAsync(new IdentityRole(RoleStatic.Role_Manager)).GetAwaiter().GetResult();
                _roleManager.CreateAsync(new IdentityRole(RoleStatic.Role_User)).GetAwaiter().GetResult();

                // Create admin user

                _userManager.CreateAsync(new User
                {
                    Id = guid,
                    UserName = "admin",
                    Email = "admin@gmail.com",
                    Fullname = "Admin",
                    PhoneNumber = "1234567890",
                    City = "City",
                }, "Abcd1234@@").GetAwaiter().GetResult();

                User user = _db.Users.FirstOrDefault(u => u.UserName == "admin");
                _userManager.AddToRoleAsync(user, RoleStatic.Role_Admin).GetAwaiter().GetResult();
            }

            // Add problems to the database
            if (!_db.Problems.Any())
            {
                var problems = new List<Problem>
            {
                new Problem
                {
                    code = "P001",
                    title = "Sum of Two Numbers",
                    description = "Write a program that takes two integers and returns their sum.",
                    constraints = "Both integers should be between -10^9 and 10^9.",
                    example_input = "3 5",
                    example_output = "8",
                    time_limit = 1.0,
                    memory_limit = 128.0,
                    create_at = DateTime.UtcNow,
                    user_id = guid,
                    difficulty = "Easy",
                    hasSolution = "Yes"
                },
                new Problem
                {
                    code = "P002",
                    title = "Prime Numbers",
                    description = "Write a program that checks if a number is prime.",
                    constraints = "The number should be a positive integer less than 10^6.",
                    example_input = "7",
                    example_output = "Yes",
                    time_limit = 1.0,
                    memory_limit = 128.0,
                    create_at = DateTime.UtcNow,
                    user_id = guid,
                    difficulty = "Medium",
                    hasSolution = "Yes"
                },
                new Problem
                {
                    code = "P003",
                    title = "Factorial",
                    description = "Write a program to calculate the factorial of a given number.",
                    constraints = "The number should be a non-negative integer less than or equal to 20.",
                    example_input = "5",
                    example_output = "120",
                    time_limit = 1.0,
                    memory_limit = 128.0,
                    create_at = DateTime.UtcNow,
                    user_id = guid,
                    difficulty = "Easy",
                    hasSolution = "Yes"
                    }
                };

                _db.Problems.AddRange(problems);
                _db.SaveChanges();
            }

            return;
        }

    }
}
