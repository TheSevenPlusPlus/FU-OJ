using FU.OJ.Server.DTOs;using FU.OJ.Server.DTOs.Problem.Request;using FU.OJ.Server.Infra.Const;using FU.OJ.Server.Infra.Context;using FU.OJ.Server.Infra.Models;using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
namespace FU.OJ.Server.Service{    public interface IProblemService
    {
        Task<string> CreateAsync(CreateProblemRequest request);
        Task<Problem?> GetByIdAsync(string id);
        Task<Problem?> GetByCodeAsync(string code);
        Task<(List<Problem> problems, int totalPages)> GetAllAsync(Paging query);
        Task<bool> UpdateAsync(UpdateProblemRequest request);
        Task<bool> DeleteAsync(string id);
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
        public async Task<string> CreateAsync(CreateProblemRequest request)
        {
            var problem = await GetByCodeAsync(request.Code);
            if (problem != null)
                throw new Exception(ErrorMessage.CodeExisted);
            var user = await _userManager.FindByNameAsync(request.UserName);
            if (user == null) throw new Exception(ErrorMessage.UserNotFound);

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
                UserId = user.Id,
                Difficulty = request.Difficulty
            };
            _context.Problems.Add(newProblem);
            await _context.SaveChangesAsync();
            return newProblem.Code;
        }
        public async Task<(List<Problem> problems, int totalPages)> GetAllAsync(Paging query)
        {
            // Đếm tổng số submissions
            int totalItems = await _context.Problems.CountAsync();
            // Tính toán tổng số trang
            int totalPages = (int)Math.Ceiling((double)totalItems / query.pageSize);
            var problems = await _context.Problems.AsNoTracking()
                .OrderByDescending(c => c.CreatedAt)
                .Skip((query.pageIndex - 1) * query.pageSize) // Bỏ qua các phần tử của trang trước
                                                                                              .Take(query.pageSize) // Lấy số lượng phần tử của trang hiện tại
                                                                                                        .ToListAsync();
            return (problems, totalPages);
        }
        public async Task<bool> UpdateAsync(UpdateProblemRequest request)
        {
            if (request.Code == null) throw new Exception("Problem Code isn's existed");
            var problem = await GetByCodeAsync(request.Code);
            if (problem == null)
                return false;
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
        public async Task<bool> DeleteAsync(string id)
        {
            var problem = await _context.Problems.FirstOrDefaultAsync(p => p.Id == id);
            if (problem == null)
                return false;
            _context.Problems.Remove(problem);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}