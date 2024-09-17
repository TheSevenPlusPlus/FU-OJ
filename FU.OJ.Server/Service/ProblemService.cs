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
                create_at = request.create_at,
                user_id = request.user_id
            };

            _context.Problems.Add(new_problem);
            await _context.SaveChangesAsync();

            return new_problem.code;
        }
    }
}
