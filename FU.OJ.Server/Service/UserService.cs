using FU.OJ.Server.DTOs;
using FU.OJ.Server.DTOs.User.Request;using FU.OJ.Server.DTOs.User.Respond;using FU.OJ.Server.Infra.Models;using Microsoft.AspNetCore.Identity;using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Service{    public interface IUserService
    {
        Task<User> CreateUserAsync(CreateUserRequest userRequest);
        Task<(List<UserView> users, int totalPages)> GetAllUsersAsync(Paging query);
        Task<User> GetUserByIdAsync(string userId);
        Task<User> GetUserByUsernameAsync(string userName); // Added Async suffix for consistency
        Task<User> UpdateUserAsync(UpdateUserRequest user);
        Task<bool> DeleteUserAsync(string userName);
        Task<bool> EditUserRoleAsync(string userName, string role);
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
                PhoneNumber = userRequest.PhoneNumber,
                FullName = userRequest.FullName,
                City = userRequest.City,
                Description = userRequest.Description,
                FacebookLink = userRequest.FacebookLink,
                GithubLink = userRequest.GithubLink,
                CreatedAt = DateTime.UtcNow,
                AvatarUrl = userRequest.AvatarUrl,
                School = userRequest.School,
            };
            var result = await _userManager.CreateAsync(user, userRequest.Password);
            if (result.Succeeded) return user;
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"User creation failed: {errors}");
        }
        public async Task<(List<UserView> users, int totalPages)> GetAllUsersAsync(Paging query)
        {
            // Đếm tổng số users
            int totalItems = await _userManager.Users.CountAsync();

            // Tính toán tổng số trang
            int totalPages = (int)Math.Ceiling((double)totalItems / query.pageSize);

            // Lấy danh sách users đã phân trang
            var users = await _userManager.Users
                .Skip((query.pageIndex - 1) * query.pageSize) // Bỏ qua các phần tử của trang trước
                .Take(query.pageSize) // Lấy số lượng phần tử của trang hiện tại
                .Select(u => new UserView
                {
                    UserName = u.UserName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    FullName = u.FullName,
                    City = u.City,
                    Description = u.Description,
                    FacebookLink = u.FacebookLink,
                    GithubLink = u.GithubLink,
                    School = u.School,
                    AvatarUrl = u.AvatarUrl,
                    CreatedAt = u.CreatedAt,
                })
                .ToListAsync();

            // Trả về cả danh sách users và tổng số trang
            return (users, totalPages);
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User isn't exist");
            }
            return user;
        }
        public async Task<User> GetUserByUsernameAsync(string userName) // Added Async suffix for consistency
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
            {
                throw new Exception("User isn't exist");
            }
            return user;
        }
        //Don't allow change UserName
        public async Task<User> UpdateUserAsync(UpdateUserRequest updatedUser)
        {
            var user = await _userManager.FindByNameAsync(updatedUser.UserName);
            if (user != null)
            {
                user.Email = updatedUser.Email;
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
            throw new Exception("User isn't exist");
        }
        public async Task<bool> DeleteUserAsync(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user != null)
            {
                var result = await _userManager.DeleteAsync(user);
                return result.Succeeded;
            }
            throw new Exception("User isn't exist");

        }

        public async Task<bool> EditUserRoleAsync(string userName, string role)
        {
            if (!(role == "Admin" || role == "User" || role == "Manager"))
            {
                throw new ArgumentException("Invalid role");
            }

            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
            {
                throw new Exception("User isn't exist");
            }

            var currentRoles = await _userManager.GetRolesAsync(user);

            // Xóa vai trò hiện tại của người dùng
            var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeRolesResult.Succeeded)
            {
                throw new InvalidOperationException("Failed to remove current role");
            }

            // Thêm vai trò mới
            var addRoleResult = await _userManager.AddToRoleAsync(user, role);
            if (!addRoleResult.Succeeded)
            {
                throw new InvalidOperationException("Failed to assign new role");
            }

            return true;
        }
    }
}