using FU.OJ.Server.DTOs.User.Request;
using FU.OJ.Server.DTOs.User.Respond;
using FU.OJ.Server.Infra.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Service
{
    public interface IUserService
    {
        Task<User> CreateUserAsync(CreateUserRequest userRequest);
        Task<List<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(string userId);
        Task<User> GetUserByUsernameAsync(string userName); // Added Async suffix for consistency
        Task<User> UpdateUserAsync(string userId, UpdateUserRequest user);
        Task<User> UpdateProfileAsync(UpdateUserRequest user);
        Task<bool> DeleteUserAsync(string userId);
    }

    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;

        public UserService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<User> CreateUserAsync(CreateUserRequest userRequest)
        {
            var user = new User
            {
                UserName = userRequest.UserName,
                Email = userRequest.Email,
                FullName = userRequest.FullName,
                City = userRequest.City,
                Description = userRequest.Description,
                FacebookLink = userRequest.FacebookLink,
                GithubLink = userRequest.GithubLink,
                CreatedAt = DateTime.UtcNow,
            };

            var result = await _userManager.CreateAsync(user, userRequest.Password);
            if (result.Succeeded) return user;

            return user; // Consider throwing an exception or handling this differently.
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _userManager.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            return await _userManager.FindByIdAsync(userId);
        }

        public async Task<User> GetUserByUsernameAsync(string userName) // Added Async suffix for consistency
        {
            return await _userManager.FindByNameAsync(userName);
        }

        public async Task<User> UpdateUserAsync(string userId, UpdateUserRequest updatedUser)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                user.Email = updatedUser.Email;
                user.UserName = updatedUser.UserName;
                user.FullName = updatedUser.FullName;
                user.City = updatedUser.City;
                user.Description = updatedUser.Description;
                user.FacebookLink = updatedUser.FacebookLink;
                user.GithubLink = updatedUser.GithubLink;
                user.PhoneNumber = updatedUser.PhoneNumber;
                user.School = updatedUser.School;
                user.AvatarUrl = updatedUser.AvatarUrl;

                var result = await _userManager.UpdateAsync(user);
                if (result.Succeeded) return user;
            }

            return user;
        }

        public async Task<User> UpdateProfileAsync(UpdateUserRequest updatedUser)
        {
            var user = await _userManager.FindByNameAsync(updatedUser.UserName);
            if (user != null)
            {
                user.Email = updatedUser.Email;
                user.PhoneNumber = updatedUser.PhoneNumber;
                user.FullName = updatedUser.FullName;
                user.City = updatedUser.City;
                user.Description = updatedUser.Description;
                user.FacebookLink = updatedUser.FacebookLink;
                user.GithubLink = updatedUser.GithubLink;
                user.School = updatedUser.School;
                user.AvatarUrl = updatedUser.AvatarUrl;

                var result = await _userManager.UpdateAsync(user);
                if (result.Succeeded) return user;
            }

            return user;
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
