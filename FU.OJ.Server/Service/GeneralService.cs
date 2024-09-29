using FU.OJ.Server.DTOs.General.Response;
using FU.OJ.Server.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Service
{
    public interface IGeneralService
    {
        Task<PaginatedResponse<UserRankResponse>> GetUserRankingsAsync(int page, int pageSize);
    }

    public class GeneralService : IGeneralService
    {
        private readonly ApplicationDbContext _context;

        public GeneralService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get paginated user rankings
        public async Task<PaginatedResponse<UserRankResponse>> GetUserRankingsAsync(
            int page,
            int pageSize
        )
        {
            var totalUsers = await _context.Users.CountAsync();

            // Get users along with the count of accepted submissions (AC)
            var usersWithAcProblems = await _context
                .Users.Select(user => new UserRankResponse
                {
                    UserName = user.UserName,
                    AcProblems = user.Submissions.Count(s => s.Status == "AC"),
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
                Items = usersWithAcProblems,
            };
        }
    }
}
