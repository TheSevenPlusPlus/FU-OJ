using FU.OJ.Server.DTOs.General.Respond;
using FU.OJ.Server.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Service
{
    public interface IGeneralService
    {

        Task<PaginatedRepond<UserRankRespond>> GetUserRankingsAsync(int page, int pageSize);
    }
    public class GeneralService : IGeneralService
    {
        private readonly ApplicationDbContext _context;

        public GeneralService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Lấy danh sách xếp hạng người dùng có phân trang
        public async Task<PaginatedRepond<UserRankRespond>> GetUserRankingsAsync(int page, int pageSize)
        {
            var totalUsers = await _context.Users.CountAsync();

            // Lấy danh sách người dùng cùng với số lượng bài tập giải đúng (AC)
            var usersWithAcProblems = await _context.Users
                .Select(user => new UserRankRespond
                {
                    UserName = user.UserName,
                    // Tính số lượng bài giải đúng của người dùng
                    AcProblems = user.Submissions.Count(s => s.status == "AC")
                })
                .OrderByDescending(u => u.AcProblems) // Sắp xếp theo số lượng bài giải đúng (AC) giảm dần
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Gán hạng cho mỗi người dùng dựa trên số lượng bài giải đúng
            for (int i = 0; i < usersWithAcProblems.Count; i++)
            {
                usersWithAcProblems[i].Rank = (page - 1) * pageSize + i + 1;
            }

            // Trả về dữ liệu có phân trang
            return new PaginatedRepond<UserRankRespond>
            {
                TotalItems = totalUsers,
                Items = usersWithAcProblems
            };
        }
    }
}

