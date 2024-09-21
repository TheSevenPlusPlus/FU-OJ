using FU.OJ.Server.DTOs.Problem.Request;
using FU.OJ.Server.Infra.Const;
using FU.OJ.Server.Infra.Context;
using FU.OJ.Server.Infra.Models;
using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Service
{
    public interface IProblemService
    {
        public Task<string> createAsync(CreateProblemRequest request);
        public Task<Problem?> getByIdAsync(string id);
        public Task<Problem?> getByCodeAsync(string code);
        public Task<List<Problem>> getAllAsync(); // Đổi tên phương thức thành getAllAsync
        public Task<bool> updateAsync(string id, UpdateProblemRequest request); // Thêm phương thức updateAsync
        public Task<bool> deleteAsync(string id); // Thêm phương thức deleteAsync
    }

    public class ProblemService : IProblemService
    {
        private readonly ApplicationDBContext _context;

        public ProblemService(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Problem?> getByCodeAsync(string code)
        {
            var problem = await _context.Problems.AsNoTracking()
                .FirstOrDefaultAsync(p => p.code == code);

            return problem;
        }

        public async Task<Problem?> getByIdAsync(string id)
        {
            var problem = await _context.Problems.AsNoTracking()
                .FirstOrDefaultAsync(p => p.id == id);

            return problem;
        }

        public async Task<string> createAsync(CreateProblemRequest request)
        {
            var problem = await getByCodeAsync(request.code);

            if (problem != null)
                throw new Exception(ErrorMessage.CodeExisted);

            var new_problem = new Problem
            {
                code = request.code,
                title = request.title,
                description = request.description,
                constraints = request.constraints,
                example_input = request.example_input,
                example_output = request.example_output,
                time_limit = request.time_limit,
                memory_limit = request.memory_limit,
                create_at = request.create_at
            };

            _context.Problems.Add(new_problem);
            await _context.SaveChangesAsync();

            return new_problem.code;
        }

        public async Task<List<Problem>> getAllAsync() // Đổi tên phương thức thành getAllAsync
        {
            var problems = await _context.Problems.ToListAsync();

            return problems;
        }

        public async Task<bool> updateAsync(string id, UpdateProblemRequest request)
        {
            var problem = await _context.Problems.FirstOrDefaultAsync(p => p.id == id);

            if (problem == null)
                return false;

            problem.title = request.title;
            problem.description = request.description;
            problem.constraints = request.constraints;
            problem.example_input = request.example_input;
            problem.example_output = request.example_output;
            problem.time_limit = request.time_limit;
            problem.memory_limit = request.memory_limit;

            _context.Problems.Update(problem);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> deleteAsync(string id)
        {
            var problem = await _context.Problems.FirstOrDefaultAsync(p => p.id == id);

            if (problem == null)
                return false;

            _context.Problems.Remove(problem);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
