using FU.OJ.Server.DTOs.Submission.Request;
using FU.OJ.Server.DTOs.Submission.Response;
using FU.OJ.Server.Infra.Const;
using FU.OJ.Server.Infra.Context;
using FU.OJ.Server.Infra.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;

namespace FU.OJ.Server.Service
{
    public interface ISubmissionService
    {
        Task<string> CreateAsync(CreateSubmissionRequest request, bool base64Encoded, bool wait); //
        Task<SubmissionView> GetByIdAsync(string id);//
        Task<SubmissionView?> GetByIdWithoutResultAsync(string id);//
        Task<List<SubmissionView>> GetAllSubmissionsAsync();//
        Task<List<SubmissionView>> GetAllSubmissionsBelongsUserAsync(string userId);
        Task<string> GetByTokenAsync(string token, bool base64Encoded = false, string fields = "stdout,time,memory,stderr,token,compile_output,message,status");
        Task<Submission?> getByIdWithoutResult(string id); // Trả về Submission mà không kèm Result
        Task<Submission?> getById(string id); // Trả về Submission kèm theo Result
    }

    public class SubmissionService : ISubmissionService
    {
        private readonly string _judgeServerUrl;
        private readonly HttpClient _httpClient;
        private readonly IProblemService _problemService;
        private readonly ITestcaseService _testcaseService;
        private readonly ApplicationDbContext _context;

        public SubmissionService(HttpClient httpClient, IProblemService problemService, ITestcaseService testcaseService, ApplicationDbContext context, IConfiguration configuration)
        {
            _judgeServerUrl = configuration.GetValue<string>("JudgeServerUrl")!;
            _httpClient = httpClient;
            _problemService = problemService;
            _testcaseService = testcaseService;
            _context = context;
        }

        public async Task<string> CreateAsync(CreateSubmissionRequest request, bool base64Encoded, bool wait)
        {
            var problem = await _problemService.GetByCodeAsync(request.ProblemCode);
            if (problem == null)
                throw new Exception(ErrorMessage.NotFound);

            if (problem.TestCaseId == null)
                throw new Exception(ErrorMessage.NotHaveTest);

            var testcase = await _testcaseService.GetByIdAsync(problem.TestCaseId);
            if (testcase == null)
                throw new Exception(ErrorMessage.NotFound);

            var submission = new Submission
            {
                ProblemId = request.ProblemId,
                ProblemCode = request.ProblemCode,
                SourceCode = request.SourceCode,
                LanguageName = request.LanguageName,
                SubmittedAt = DateTime.UtcNow
            };

            _context.Submissions.Add(submission);

            var tokenList = new List<string>();
            var testFolders = Directory.GetDirectories(testcase.FolderPath);
            string url = $"{_judgeServerUrl}/submissions/?base64_encoded={base64Encoded.ToString().ToLower()}&wait={wait.ToString().ToLower()}";

            foreach (var testFolder in testFolders)
            {
                var inputFilePath = Path.Combine(testFolder, $"{problem.Code}.inp");
                var outputFilePath = Path.Combine(testFolder, $"{problem.Code}.out");

                if (File.Exists(inputFilePath) && File.Exists(outputFilePath))
                {
                    string inputContent = await File.ReadAllTextAsync(inputFilePath);
                    string outputContent = await File.ReadAllTextAsync(outputFilePath);

                    var submissionRequest = new SubmissionRequest
                    {
                        source_code = request.SourceCode,
                        language_id = request.LanguageId,
                        stdin = inputContent,
                        expected_output = outputContent,
                        cpu_time_limit = problem.TimeLimit,
                        memory_limit = problem.MemoryLimit > 256000 ? problem.MemoryLimit : 256000
                    };

                    var jsonContent = new StringContent(JsonSerializer.Serialize(submissionRequest), Encoding.UTF8, "application/json");
                    HttpResponseMessage response = await _httpClient.PostAsync(url, jsonContent);

                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    Console.WriteLine(jsonResponse);
                    var token = JsonDocument.Parse(jsonResponse).RootElement.GetProperty("token").GetString();

                    tokenList.Add(token!);
                }
            }

            string status = "Accepted";
            var resultList = new List<Result>();
            foreach (var token in tokenList)
            {
                var tokenResult = await GetByTokenAsync(token);
                if (JsonDocument.Parse(tokenResult).RootElement.GetProperty("status").GetProperty("description").GetString() == "Compilation Error")
                {
                    var _newResult = new Result
                    {
                        SubmissionId = submission.Id,
                        StatusDescription = "Compilation Error",
                        Time = "0.001s",
                        Memory = 0.0
                    };

                    status = "Compilation Error";
                    _context.Results.Add(_newResult);
                    resultList.Add(_newResult);

                    continue;
                }

                var newResult = new Result
                {
                    SubmissionId = submission.Id,
                    StatusDescription = JsonDocument.Parse(tokenResult).RootElement.GetProperty("status").GetProperty("description").GetString(),
                    Time = JsonDocument.Parse(tokenResult).RootElement.GetProperty("time").GetString(),
                    Memory = JsonDocument.Parse(tokenResult).RootElement.TryGetProperty("memory", out JsonElement memoryElement) && memoryElement.ValueKind == JsonValueKind.Number
                        ? memoryElement.GetDouble()
                        : 262144
                };

                if (JsonDocument.Parse(tokenResult).RootElement.GetProperty("status").GetProperty("description").GetString() != "Accepted")
                {
                    if (status == "Accepted")
                        status = JsonDocument.Parse(tokenResult).RootElement.GetProperty("status").GetProperty("description").GetString()!;
                }

                _context.Results.Add(newResult);
                resultList.Add(newResult);
            }

            submission.Status = status;
            submission.Results = resultList;
            await _context.SaveChangesAsync();
            return submission.Id;
        }

        public async Task<string> GetByTokenAsync(string token, bool base64Encoded = true, string fields = "stdout,time,memory,stderr,token,compile_output,message,status")
        {
            string url = $"{_judgeServerUrl}/submissions/{token}?base64_encoded={base64Encoded.ToString().ToLower()}&fields={fields}";
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

        public async Task<Submission?> getByIdWithoutResult(string id)
        {
            var submission = await _context.Submissions.AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);

            return submission;
        }

        public async Task<SubmissionView?> GetByIdWithoutResultAsync(string id)
        {
            var submission = await _context.Submissions.AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);

            if (submission == null)
                throw new Exception(ErrorMessage.NotFound);

            return new SubmissionView
            {
                Id = submission.Id,
                ProblemId = submission.ProblemId,
                ProblemName = submission.ProblemCode,
                SourceCode = submission.SourceCode,
                LanguageName = submission.LanguageName,
                SubmittedAt = submission.SubmittedAt,
                UserId = submission.UserId,
                UserName = submission.UserName,
                Status = submission.Status
            };
        }

        public async Task<Submission?> getById(string id)
        {
            var submission = await _context.Submissions.AsNoTracking()
                .Include(s => s.Results)
                .FirstOrDefaultAsync(s => s.Id == id);

            return submission;
        }

        public async Task<SubmissionView> GetByIdAsync(string id)
        {
            var submission = await _context.Submissions
                .Include(s => s.Results)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);

            if (submission == null)
                throw new Exception(ErrorMessage.NotFound);

            return new SubmissionView
            {
                Id = submission.Id,
                ProblemId = submission.ProblemId,
                ProblemName = submission.ProblemCode,
                SourceCode = submission.SourceCode,
                LanguageName = submission.LanguageName,
                SubmittedAt = submission.SubmittedAt,
                UserId = submission.UserId,
                UserName = submission.UserName,
                Status = submission.Status,
                Results = submission.Results.Select(result => new ResultView
                {
                    StatusDescription = result.StatusDescription,
                    Time = result.Time,
                    Memory = result.Memory
                }).ToList()
            };
        }

        public async Task<List<SubmissionView>> GetAllSubmissionsAsync()
        {
            return await _context.Submissions.AsNoTracking()
                .Select(submission => new SubmissionView
                {
                    Id = submission.Id,
                    ProblemId = submission.ProblemId,
                    ProblemName = submission.ProblemCode,
                    SourceCode = submission.SourceCode,
                    LanguageName = submission.LanguageName,
                    SubmittedAt = submission.SubmittedAt,
                    UserId = submission.UserId,
                    UserName = submission.UserName,
                    Status = submission.Status
                })
                .ToListAsync();
        }

        public async Task<List<SubmissionView>> GetAllSubmissionsBelongsUserAsync(string userId)
        {
            return await _context.Submissions.AsNoTracking()
                .Where(submission => submission.UserId == userId)
                .Select(submission => new SubmissionView
                {
                    Id = submission.Id,
                    ProblemId = submission.ProblemId,
                    ProblemName = submission.ProblemCode,
                    SourceCode = submission.SourceCode,
                    LanguageName = submission.LanguageName,
                    SubmittedAt = submission.SubmittedAt,
                    UserId = submission.UserId,
                    UserName = submission.UserName,
                    Status = submission.Status
                })
                .ToListAsync();
        }
    }
}
