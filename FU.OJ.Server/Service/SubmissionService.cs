using FU.OJ.Server.Infra.Context;
using System.Text.Json;
using System.Text;
using FU.OJ.Server.Infra.Const;
using FU.OJ.Server.DTOs.Submission.Request;
using Microsoft.Extensions.Configuration;
using FU.OJ.Server.Infra.Models;
using Microsoft.EntityFrameworkCore;
using FU.OJ.Server.DTOs.Submission.Response;

namespace FU.OJ.Server.Service
{
    public interface ISubmissionService
    {
        public Task<string> createAsync(CreateSubmissionRequest request, bool base64_encoded, bool wait);
        public Task<SubmissionView> getByIdAsync(string id);
        public Task<Submission?> getByIdWithoutResult(string id);
        public Task<SubmissionView> getByIdWithoutResultAsync(string id);
        public Task<List<SubmissionView>> getAllSubmissionsAsync();
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

        public async Task<string> createAsync(CreateSubmissionRequest request, bool base64_encoded, bool wait)
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

            var submission = new Submission
            {
                problem_id = request.problem_id,
                source_code = request.source_code,
                language_name = request.language_name,
                submit_at = DateTime.UtcNow
            };

            _context.Submissions.Add(submission);

            var tokenList = new List<string>();
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

                    var jsonResponse = await response.Content.ReadAsStringAsync();

                    var tokenObj = JsonSerializer.Deserialize<JsonElement>(jsonResponse);
                    var token = tokenObj.GetProperty("token").GetString();  // Lấy giá trị token

                    tokenList.Add(token!);
                }
            }

            bool ac = true;
            var resultList = new List<Result>();
            foreach (var token in tokenList)
            {
                var tokenResult = await getByTokenAsync(token);
                var newResult = new Result
                {
                    submission_id = submission.id,
                    status_description = JsonDocument.Parse(tokenResult).RootElement.GetProperty("status").GetProperty("description").GetString(),
                    time = JsonDocument.Parse(tokenResult).RootElement.GetProperty("time").GetString(),
                    memory = JsonDocument.Parse(tokenResult).RootElement.TryGetProperty("memory", out JsonElement memoryElement) && memoryElement.ValueKind == JsonValueKind.Number
                            ? memoryElement.GetDouble()
                            : 262144
                };

                if (JsonDocument.Parse(tokenResult).RootElement.GetProperty("status").GetProperty("description").GetString() != "Accepted")
                    ac = false;

                _context.Results.Add(newResult);
                resultList.Add(newResult);
            }

            submission.status = ac;
            submission.results = resultList;
            await _context.SaveChangesAsync();
            return submission.id;
        }

        public async Task<string> getByTokenAsync(string token, bool base64_encoded = false, string fields = "stdout,time,memory,stderr,token,compile_output,message,status")
        {
            string url = $"{_judgeServerUrl}/submissions/{token}?base64_encoded={base64_encoded.ToString().ToLower()}&fields={fields}";
            HttpResponseMessage response;
            string responseContent;

            while (true)
            {
                response = await _httpClient.GetAsync(url);
                responseContent = await response.Content.ReadAsStringAsync();

                var tokenResult = JsonDocument.Parse(responseContent).RootElement;
                var statusDescription = tokenResult.GetProperty("status").GetProperty("description").GetString();

                if (statusDescription != "In Queue" && statusDescription != "Processing") break;

                await Task.Delay(100);
            }

            return responseContent;
        }

        public async Task<Submission?> getById(string id)
        {
            var submission = await _context.Submissions.AsNoTracking()
                .Include(s => s.results)
                .FirstOrDefaultAsync(s => s.id == id);

            return submission;
        }

        public async Task<SubmissionView> getByIdAsync(string id)
        {
            var submission = await getById(id);

            if (submission == null)
                throw new Exception(ErrorMessage.NotFound);

            var _results = new List<Result>();
            foreach (var result in submission.results)
            {
                _results.Add(result);
            }

            return new SubmissionView
            {
                id = submission.id,
                problem_id = submission.problem_id,
                source_code = submission.source_code,
                language_name = submission.language_name,
                submit_at = submission.submit_at,
                status = submission.status,
                results = _results
            };
        }

        public async Task<Submission?> getByIdWithoutResult(string id)
        {
            var submission = await _context.Submissions.AsNoTracking()
                .FirstOrDefaultAsync(s => s.id == id);

            return submission;
        }

        public async Task<SubmissionView> getByIdWithoutResultAsync(string id)
        {
            var submission = await getById(id);

            if (submission == null)
                throw new Exception(ErrorMessage.NotFound);

            return new SubmissionView
            {
                id = submission.id,
                problem_id = submission.problem_id,
                source_code = submission.source_code,
                language_name = submission.language_name,
                submit_at = submission.submit_at,
                status = submission.status
            };
        }

        public async Task<List<SubmissionView>> getAllSubmissionsAsync()
        {
            return await _context.Submissions.AsNoTracking()
                .Select(submission => new SubmissionView
                {
                    id = submission.id,
                    problem_id = submission.problem_id,
                    source_code = submission.source_code,
                    language_name = submission.language_name,
                    submit_at = submission.submit_at,
                    status = submission.status
                })
                .ToListAsync();
        }

        public async Task<List<SubmissionView>> getAllSubmissionsBelongsUserAsync(string user_id)
        {
            return await _context.Submissions.AsNoTracking()
                .Where(submission => submission.user_id == user_id)
                .Select(submission => new SubmissionView
                {
                    id = submission.id,
                    problem_id = submission.problem_id,
                    source_code = submission.source_code,
                    language_name = submission.language_name,
                    submit_at = submission.submit_at,
                    user_id = submission.user_id,
                    user_name = submission.user_name,
                    status = submission.status
                })
                .ToListAsync();
        }
    }
}
