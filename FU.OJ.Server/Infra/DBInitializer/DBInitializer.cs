using FU.OJ.Server.Infra.Const.Authorize;
using FU.OJ.Server.Infra.Context;
using FU.OJ.Server.Infra.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Infra.DBInitializer
{
    public interface IDbInitializer
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
            string managerGuid = Guid.NewGuid().ToString();
            string userGuid = Guid.NewGuid().ToString();
            const string commonPassword = "Abcd1234@@";

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
            if (!_roleManager.RoleExistsAsync(RoleStatic.RoleAdmin).GetAwaiter().GetResult())
            {
                _roleManager.CreateAsync(new IdentityRole(RoleStatic.RoleAdmin)).GetAwaiter().GetResult();
                _roleManager.CreateAsync(new IdentityRole(RoleStatic.RoleManager)).GetAwaiter().GetResult();
                _roleManager.CreateAsync(new IdentityRole(RoleStatic.RoleUser)).GetAwaiter().GetResult();
            }

            // Create admin user if it doesn't exist
            if (_db.Users.FirstOrDefault(u => u.UserName == "admin") == null)
            {
                CreateUser("admin", "admin@gmail.com", "Admin", "1234567890", "City", RoleStatic.RoleAdmin, adminGuid, commonPassword);
            }

            // Create manager user if it doesn't exist
            if (_db.Users.FirstOrDefault(u => u.UserName == "manager") == null)
            {
                CreateUser("manager", "manager@gmail.com", "Manager", "0987654321", "City", RoleStatic.RoleManager, managerGuid, commonPassword);
            }

            // Create normal user if it doesn't exist
            if (_db.Users.FirstOrDefault(u => u.UserName == "user") == null)
            {
                CreateUser("user", "user@gmail.com", "User", "1122334455", "City", RoleStatic.RoleUser, userGuid, commonPassword);
            }
        }

        private void CreateUser(string userName, string email, string fullName, string phoneNumber, string city, string role, string userId, string password)
        {
            var user = _db.Users.FirstOrDefault(u => u.UserName == userName);
            if (user == null)
            {
                _userManager.CreateAsync(new User
                {
                    Id = userId,
                    UserName = userName,
                    Email = email,
                    FullName = fullName,
                    PhoneNumber = phoneNumber,
                    City = city,
                }, password).GetAwaiter().GetResult();

                user = _db.Users.FirstOrDefault(u => u.UserName == userName);
                _userManager.AddToRoleAsync(user, role).GetAwaiter().GetResult();
            }
        }
    }
}
