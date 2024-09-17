using FU.OJ.Server.Infra.Context;
using System.Text.Json;
using System.Text;
using FU.OJ.Server.Infra.Const;
using FU.OJ.Server.DTOs.Submission.Request;
using Microsoft.Extensions.Configuration;
using FU.OJ.Server.Infra.Models;

namespace FU.OJ.Server.Service
{
    public interface ISubmissionService
    {
        public Task<List<string>> createAsync(CreateSubmissionRequest request, bool base64_encoded, bool wait);
    }
    public class SubmissionService : ISubmissionService
    {
        private readonly string _judgeServerUrl;
        private readonly HttpClient _httpClient;
        private readonly IProblemService _problemService;
        private readonly ITestcaseService _testcaseService;
        private readonly ApplicationDBContext _context;

        public SubmissionService(HttpClient httpClient, IProblemService problemService, ITestcaseService testcaseService, ApplicationDBContext context, IConfiguration configuration)
        {
            _judgeServerUrl = configuration.GetValue<string>("JudgeServerUrl")!;
            _httpClient = httpClient;
            _problemService = problemService;
            _testcaseService = testcaseService;
            _context = context;
        }

        public async Task<List<string>> createAsync(CreateSubmissionRequest request, bool base64_encoded, bool wait)
        {
            var problem = await _problemService.getByCodeAsync(request.problem_code);
            if (problem == null)
                throw new Exception(ErrorMessage.NotFound);

            if (problem.test_case_id == null)
                throw new Exception(ErrorMessage.NotHaveTest);

            var testcase = await _testcaseService.getByIdAsync(problem.test_case_id);
            if (testcase == null)
                throw new Exception(ErrorMessage.NotFound);

            var folderPath = testcase.folder_path;
            var testFolders = Directory.GetDirectories(folderPath);
            string url = $"{_judgeServerUrl}/submissions/?base64_encoded={base64_encoded.ToString().ToLower()}&wait={wait.ToString().ToLower()}";

            var resultList = new List<string>();
            foreach (var testFolder in testFolders)
            {
                var inputFilePath = Path.Combine(testFolder, $"{problem.code}.inp");
                var outputFilePath = Path.Combine(testFolder, $"{problem.code}.out");

                if (File.Exists(inputFilePath) && File.Exists(outputFilePath))
                {
                    string inputContent = await File.ReadAllTextAsync(inputFilePath);
                    string outputContent = await File.ReadAllTextAsync(outputFilePath);

                    var submissionRequest = new SubmissionRequest
                    {
                        source_code = request.source_code,
                        language_id = request.language_id,
                        problem_code = request.problem_code,
                        stdin = inputContent,
                        stdout = outputContent,
                        cpu_time_limit = problem.time_limit,
                        memory_limit = problem.memory_limit
                    };

                    var jsonContent = new StringContent(JsonSerializer.Serialize(submissionRequest), Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await _httpClient.PostAsync(url, jsonContent);

                    var token = await response.Content.ReadAsStringAsync();
                    resultList.Add(token);
                }
            }

            return resultList;
        }
    }
}
