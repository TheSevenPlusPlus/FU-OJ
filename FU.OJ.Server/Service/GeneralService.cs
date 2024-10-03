using FU.OJ.Server.DTOs.General.Response;using FU.OJ.Server.Infra.Context;using FU.OJ.Server.Infra.Models;using Microsoft.AspNetCore.Identity;using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Service{    public interface IGeneralService
    {
        Task<PaginatedResponse<UserRankResponse>> GetUserRankingsAsync(int page, int pageSize);
        Task<(string UserName, string Role)> GetUserRoleAsync(string userId);

    }
    public class GeneralService : IGeneralService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        public GeneralService(ApplicationDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        // Get paginated user rankings
        public async Task<PaginatedResponse<UserRankResponse>> GetUserRankingsAsync(int page, int pageSize)
        {
            var totalUsers = await _context.Users.CountAsync();

            // Get users along with the count of accepted submissions (AC)
            var usersWithAcProblems = await _context.Users
               .Select(user => new UserRankResponse
               {
                   UserName = user.UserName,
                   AcProblems = user.Submissions
                       .Where(s => s.Status == "Accepted")
                       .Select(s => s.ProblemId) // Giả sử có thuộc tính ProblemId trong Submission
                       .Distinct() // Lấy các ProblemId duy nhất
                       .Count() // Đếm số lượng bài toán duy nhất mà người dùng đã nộp thành công
               })
               .OrderByDescending(u => u.AcProblems)
               .Skip((page - 1) * pageSize)
               .Take(pageSize)
               .ToListAsync();

            // Assign ranks to each user based on the number of accepted submissions
            for (int i = 0; i < usersWithAcProblems.Count; i++)
            {
                usersWithAcProblems[i].Rank = (page - 1) * pageSize + i + 1;
            }
            // Return paginated data
            return new PaginatedResponse<UserRankResponse>
            {
                TotalItems = totalUsers,
                Items = usersWithAcProblems
            };
        }

        public async Task<(string UserName, string Role)> GetUserRoleAsync(string userId)
        {
            // Tìm user dựa vào username
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) throw new Exception("User not found");

            // Lấy vai trò duy nhất của user
            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Count == 0) return (user.UserName, "No Role");
            if (roles.Count > 1) throw new InvalidOperationException("User has multiple roles, but only one role is allowed.");

            return (user.UserName, roles.FirstOrDefault());
        }
    }
}