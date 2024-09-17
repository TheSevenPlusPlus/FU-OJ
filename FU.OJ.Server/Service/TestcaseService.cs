using FU.OJ.Server.DTOs.Problem.Request;
using FU.OJ.Server.DTOs.Testcase.Request;
using FU.OJ.Server.Infra.Const;
using FU.OJ.Server.Infra.Context;
using FU.OJ.Server.Infra.Models;
using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Service
{
    public interface ITestcaseService
    {
        public Task<TestCase?> getByIdAsync(string id);
        public Task<string> createAsync(CreateTestcaseRequest request);
    }
    public class TestcaseService : ITestcaseService
    {
        private readonly ApplicationDBContext _context;
        private readonly IProblemService _problemService;

        public TestcaseService(ApplicationDBContext context, IProblemService problemService)
        {
            _context = context;
            _problemService = problemService;
        }

        public async Task<TestCase?> getByIdAsync(string id)
        {
            var testcase = await _context.TestCases.AsNoTracking()
                .FirstOrDefaultAsync(p => p.id == id);

            return testcase;
        }

        public async Task<string> createAsync(CreateTestcaseRequest request)
        {
            var problem = await _problemService.getByIdAsync(request.problem_id);
            if (problem == null) 
                throw new Exception(ErrorMessage.NotFound);

            var new_testcase = new TestCase
            {
                problem_id = request.problem_id,
                folder_path = request.folder_path
            };

            problem.test_case_id = new_testcase.id;
            _context.Problems.Update(problem);
            _context.TestCases.Add(new_testcase);
            await _context.SaveChangesAsync();

            return new_testcase.id;
        }
    }
}
