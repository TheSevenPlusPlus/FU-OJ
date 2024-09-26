using FU.OJ.Server.DTOs.Problem.Request;
using FU.OJ.Server.Infra.Const;
using FU.OJ.Server.Infra.Context;
using FU.OJ.Server.Infra.Models;
using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Service
{
    public interface IProblemService
    {
        Task<string> CreateAsync(CreateProblemRequest request);
        Task<Problem?> GetByIdAsync(string id);
        Task<Problem?> GetByCodeAsync(string code);
        Task<List<Problem>> GetAllAsync();
        Task<bool> UpdateAsync(string id, UpdateProblemRequest request);
        Task<bool> DeleteAsync(string id);
    }

    public class ProblemService : IProblemService
    {
        private readonly ApplicationDbContext _context;

        public ProblemService(ApplicationDbContext context)
        {
            _context = context;
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

            var newProblem = new Problem
            {
                Code = request.Code,
                Title = request.Title,
                Description = request.Description,
                Constraints = request.Constraints,
                ExampleInput = request.ExampleInput,
                ExampleOutput = request.ExampleOutput,
                TimeLimit = request.TimeLimit,
                MemoryLimit = request.MemoryLimit,
                CreatedAt = request.CreatedAt
            };

            _context.Problems.Add(newProblem);
            await _context.SaveChangesAsync();

            return newProblem.Code;
        }

        public async Task<List<Problem>> GetAllAsync()
        {
            return await _context.Problems.ToListAsync();
        }

        public async Task<bool> UpdateAsync(string id, UpdateProblemRequest request)
        {
            var problem = await _context.Problems.FirstOrDefaultAsync(p => p.Id == id);

            if (problem == null)
                return false;

            problem.Title = request.Title;
            problem.Description = request.Description;
            problem.Constraints = request.Constraints;
            problem.ExampleInput = request.ExampleInput;
            problem.ExampleOutput = request.ExampleOutput;
            problem.TimeLimit = request.TimeLimit;
            problem.MemoryLimit = request.MemoryLimit;

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
