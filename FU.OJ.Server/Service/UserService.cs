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
        Task<User> GetUserByUsername(string userName);

        Task<User> UpdateUserAsync(string userId, CreateUserRequest user);
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
                Fullname = userRequest.Fullname,
                City = userRequest.City,
                Description = userRequest.Description,
                FacebookLink = userRequest.FacebookLink,
                GithubLink = userRequest.GithubLink,
            };

            var result = await _userManager.CreateAsync(user, userRequest.Password);
            if (result.Succeeded) return user;

            return null; // You might want to throw an exception or handle this differently.
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _userManager.Users.ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            return await _userManager.FindByIdAsync(userId);
        }

        public async Task<User> GetUserByUsername(string userName)
        {
            return await _userManager.FindByNameAsync(userName);
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
                user.PhoneNumber = updatedUser.PhoneNumber;
                user.School = updatedUser.School;

                var result = await _userManager.UpdateAsync(user);
                if (result.Succeeded) return user;
            }

            return null;
        }

        public async Task<User> UpdateProfileAsync(UpdateUserRequest updatedUser)
        {
            var user = await _userManager.FindByNameAsync(updatedUser.UserName);
            if (user != null)
            {
                user.Email = updatedUser.Email;
                user.PhoneNumber = updatedUser.PhoneNumber;
                user.Fullname = updatedUser.Fullname;
                user.City = updatedUser.City;
                user.Description = updatedUser.Description;
                user.FacebookLink = updatedUser.FacebookLink;
                user.GithubLink = updatedUser.GithubLink;
                user.School = updatedUser.School;

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
