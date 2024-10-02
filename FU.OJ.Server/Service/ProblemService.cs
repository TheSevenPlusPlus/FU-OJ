using FU.OJ.Server.DTOs;using FU.OJ.Server.DTOs.Problem.Request;using FU.OJ.Server.Infra.Const;using FU.OJ.Server.Infra.Context;using FU.OJ.Server.Infra.Models;using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
namespace FU.OJ.Server.Service{    public interface IProblemService
    {
        Task<string> CreateAsync(string userId, CreateProblemRequest request);
        Task<Problem?> GetByIdAsync(string id);
        Task<Problem?> GetByCodeAsync(string code);
        Task<(List<Problem> problems, int totalPages)> GetAllAsync(Paging query, string userId, bool? isMine = false);
        Task<bool> UpdateAsync(string userId, UpdateProblemRequest request);
        Task<bool> DeleteAsync(string userId, string id);
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
        public async Task<Problem?> GetByCodeAsync(string code)
        {
            return await _context.Problems.AsNoTracking()
                .FirstOrDefaultAsync(p => p.Code == code);
        }
        public async Task<Problem?> GetByIdAsync(string id)
        {
            return await _context.Problems.AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);
        }
        public async Task<string> CreateAsync(string userId, CreateProblemRequest request)
        {
            var problem = await GetByCodeAsync(request.Code);
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
        public async Task<(List<Problem> problems, int totalPages)> GetAllAsync(Paging query, string userId, bool? isMine = false)
        {
            // Đếm tổng số submissions
            int totalItems = await _context.Problems.CountAsync();
            // Tính toán tổng số trang
            int totalPages = (int)Math.Ceiling((double)totalItems / query.pageSize);
            var problems = await _context.Problems.AsNoTracking()
                .Where(p => isMine == false || p.UserId == userId)
                .OrderByDescending(c => c.CreatedAt)
                .Skip((query.pageIndex - 1) * query.pageSize) // Bỏ qua các phần tử của trang trước
                .Take(query.pageSize) // Lấy số lượng phần tử của trang hiện tại
                .ToListAsync();
            return (problems, totalPages);
        }
        public async Task<bool> UpdateAsync(string userId, UpdateProblemRequest request)
        {
            if (request.Code == null) throw new Exception("Problem Code isn's existed");
            var problem = await GetByCodeAsync(request.Code);
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
    }
}