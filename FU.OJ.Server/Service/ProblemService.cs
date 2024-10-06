using FU.OJ.Server.DTOs;
using FU.OJ.Server.DTOs.Problem.Request;
using FU.OJ.Server.DTOs.Problem.Respond;
using FU.OJ.Server.Infra.Const;
using FU.OJ.Server.Infra.Context;
using FU.OJ.Server.Infra.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Service
{
    public interface IProblemService
    {
        Task<string> CreateAsync(string userId, CreateProblemRequest request);
        Task<ProblemView?> GetByCodeAsync(string userId, string code);
        Task<(List<ProblemView> problems, int totalPages)> GetAllAsync(Paging query, string userId, bool? isMine = false);
        Task<bool> UpdateAsync(string userId, UpdateProblemRequest request);
        Task<bool> DeleteAsync(string userId, string id);
        Task<bool> IsAccepted(string userId, string problemId);
    }

    public class ProblemService : IProblemService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;

        public ProblemService(ApplicationDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<ProblemView?> GetByCodeAsync(string userId, string code)
        {
            if (string.IsNullOrWhiteSpace(code))
                throw new ArgumentException(ErrorMessage.InvalidInput);

            var problemData = await _context.Problems.AsNoTracking()
                .Where(p => p.Code == code)
                .Select(p => new
                {
                    Problem = p,
                    ProblemUser = p.ProblemUsers.FirstOrDefault(c => c.UserId == userId && c.ProblemId == p.Id)
                })
                .FirstOrDefaultAsync();

            if (problemData == null)
                //throw new Exception(ErrorMessage.NotFound);
                return null;


            var problemView = new ProblemView
            {
                Id = problemData.Problem.Id,
                Code = problemData.Problem.Code,
                Title = problemData.Problem.Title,
                Description = problemData.Problem.Description,
                Constraints = problemData.Problem.Constraints,
                ExampleInput = problemData.Problem.ExampleInput,
                ExampleOutput = problemData.Problem.ExampleOutput,
                Input = problemData.Problem.Input,
                Output = problemData.Problem.Output,
                TimeLimit = problemData.Problem.TimeLimit,
                MemoryLimit = problemData.Problem.MemoryLimit,
                CreatedAt = problemData.Problem.CreatedAt,
                UserId = problemData.Problem.UserId,
                TestCasePath = problemData.Problem.TestCasePath,
                TotalTests = problemData.Problem.TotalTests,
                AcQuantity = problemData.Problem.AcQuantity,
                Difficulty = problemData.Problem.Difficulty,
                HasSolution = problemData.Problem.HasSolution,
                Status = problemData.ProblemUser?.Status ?? "Default",
                PassedTestCount = problemData.ProblemUser?.PassedTestCount ?? 0
            };

            return problemView;
        }

        public async Task<string> CreateAsync(string userId, CreateProblemRequest request)
        {
            if (string.IsNullOrEmpty(request.Code))
                throw new ArgumentException(ErrorMessage.InvalidInput);

            var problem = await GetByCodeAsync(userId, request.Code);

            if (problem != null)
                throw new Exception(ErrorMessage.CodeExisted);

            var newProblem = new Problem
            {
                Code = request.Code,
                Title = request.Title,
                Description = request.Description,
                Constraints = request.Constraints,
                Input = request.Input,
                Output = request.Output,
                ExampleInput = request.ExampleInput,
                ExampleOutput = request.ExampleOutput,
                TimeLimit = request.TimeLimit,
                MemoryLimit = request.MemoryLimit,
                CreatedAt = DateTime.UtcNow,
                UserId = userId,
                Difficulty = request.Difficulty
            };

            _context.Problems.Add(newProblem);
            await _context.SaveChangesAsync();

            return newProblem.Code;
        }

        public async Task<(List<ProblemView> problems, int totalPages)> GetAllAsync(Paging query, string userId, bool? isMine = false)
        {
            int totalItems = await _context.Problems.CountAsync();
            int totalPages = (int)Math.Ceiling((double)totalItems / query.pageSize);

            var problems = await _context.Problems.AsNoTracking()
                .Where(p => !isMine.Value || p.UserId == userId)
                .Include(p => p.ProblemUsers)
                .Select(p => new
                {
                    Problem = p,
                    ProblemUser = p.ProblemUsers.FirstOrDefault(c => c.UserId == userId && c.ProblemId == p.Id)
                })
                .OrderByDescending(p => p.Problem.CreatedAt)
                .Skip((query.pageIndex - 1) * query.pageSize)
                .Take(query.pageSize)
                .ToListAsync();

            var problemViews = problems.Select(p => new ProblemView
            {
                Id = p.Problem.Id,
                Code = p.Problem.Code,
                Title = p.Problem.Title,
                Description = p.Problem.Description,
                Constraints = p.Problem.Constraints,
                ExampleInput = p.Problem.ExampleInput,
                ExampleOutput = p.Problem.ExampleOutput,
                Input = p.Problem.Input,
                Output = p.Problem.Output,
                TimeLimit = p.Problem.TimeLimit,
                MemoryLimit = p.Problem.MemoryLimit,
                CreatedAt = p.Problem.CreatedAt,
                UserId = p.Problem.UserId,
                TestCasePath = p.Problem.TestCasePath,
                TotalTests = p.Problem.TotalTests,
                AcQuantity = p.Problem.AcQuantity,
                Difficulty = p.Problem.Difficulty,
                HasSolution = p.Problem.HasSolution,
                Status = p.ProblemUser?.Status ?? "Default",
                PassedTestCount = p.ProblemUser?.PassedTestCount ?? 0
            }).ToList();

            return (problemViews, totalPages);
        }

        public async Task<bool> UpdateAsync(string userId, UpdateProblemRequest request)
        {
            if (string.IsNullOrEmpty(request.Code))
                throw new ArgumentException(ErrorMessage.InvalidInput);

            var problem = await _context.Problems.FirstOrDefaultAsync(p => p.Code == request.Code);

            if (problem == null || problem.UserId != userId)
                throw new Exception(ErrorMessage.NotFound);

            problem.Title = request.Title;
            problem.Description = request.Description;
            problem.Constraints = request.Constraints;
            problem.Input = request.Input;
            problem.Output = request.Output;
            problem.ExampleInput = request.ExampleInput;
            problem.ExampleOutput = request.ExampleOutput;
            problem.TimeLimit = request.TimeLimit;
            problem.MemoryLimit = request.MemoryLimit;
            problem.Difficulty = request.Difficulty;

            _context.Problems.Update(problem);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(string userId, string id)
        {
            var problem = await _context.Problems.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

            if (problem == null)
                throw new Exception(ErrorMessage.NotFound);

            _context.Problems.Remove(problem);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> IsAccepted(string userId, string problemId)
        {
            var problemUser = await _context.ProblemUsers.AsNoTracking()
                .FirstOrDefaultAsync(pu => pu.UserId == userId && pu.ProblemId == problemId);

            if (problemUser == null)
                throw new Exception(ErrorMessage.NotFound);

            return problemUser.Status == "Accepted";
        }
    }
}
