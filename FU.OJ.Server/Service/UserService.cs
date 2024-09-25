using FU.OJ.Server.DTOs.User.Request;
using FU.OJ.Server.Infra.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Service
{
    public interface IUserService
    {
        Task<List<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(string userId);
        Task<User> UpdateUserAsync(string userId, CreateUserRequest user);
        Task<bool> DeleteUserAsync(string userId);
    }

    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;

        public UserService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _userManager.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            return await _userManager.FindByIdAsync(userId);
        }

        public async Task<User> UpdateUserAsync(string userId, CreateUserRequest updatedUser)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                user.Email = updatedUser.Email;
                user.UserName = updatedUser.UserName;
                user.Fullname = updatedUser.Fullname;
                user.City = updatedUser.City;
                user.Description = updatedUser.Description;
                user.FacebookLink = updatedUser.FacebookLink;
                user.GithubLink = updatedUser.GithubLink;
                user.Slogan = updatedUser.Slogan;

                var result = await _userManager.UpdateAsync(user);
                if (result.Succeeded) return user;
            }

            return null;
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                var result = await _userManager.DeleteAsync(user);
                return result.Succeeded;
            }

            return false;
        }
    }
}
