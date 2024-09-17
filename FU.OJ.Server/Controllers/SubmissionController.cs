using FU.OJ.Server.Infra.Const;
using FU.OJ.Server.Infra.Const.Route;
using FU.OJ.Server.Infra.Context;
using FU.OJ.Server.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Text;
using System.Text.Json;
using System.IO;
using System.Threading.Tasks;
using FU.OJ.Server.DTOs.Submission.Request;

namespace FU.OJ.Server.Controllers
{
    [Route(SubmissionRoute.INDEX)]
    [ApiController]
    public class SubmissionController : BaseController
    {
        private readonly string _judgeServerUrl;
        private readonly HttpClient _httpClient;
        private readonly ApplicationDBContext _context;
        private readonly ISubmissionService _submissionService;

        public SubmissionController(HttpClient httpClient, IConfiguration configuration, ApplicationDBContext context, ISubmissionService submissionService, ILogger <SubmissionController> logger) : base(logger)
        {
            _httpClient = httpClient;
            _judgeServerUrl = configuration.GetValue<string>("JudgeServerUrl") ?? throw new Exception(ErrorMessage.NotFound);
            _context = context;
            _submissionService = submissionService;
        }

        // API to submit code
        [HttpPost(SubmissionRoute.Action.Create)]
        public async Task<IActionResult> SubmitCode(
        [FromBody] CreateSubmissionRequest request,
        [FromQuery] bool base64_encoded = false,
        [FromQuery] bool wait = false)
        {
            try
            {
                return Ok(await _submissionService.createAsync(request, base64_encoded, wait));
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        // API to get submission details by token
        [HttpGet(SubmissionRoute.Action.Get)]
        public async Task<IActionResult> GetSubmissionDetails(
        [FromRoute] string token,
        [FromQuery] bool base64_encoded = false,
        [FromQuery] string fields = "stdout,time,memory,stderr,token,compile_output,message,status")
        {
            string url = $"{_judgeServerUrl}submissions/{token}?base64_encoded={base64_encoded.ToString().ToLower()}&fields={fields}";

            HttpResponseMessage response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }

            return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
        }

        // API to get multiple submissions with pagination
        [HttpGet(SubmissionRoute.Action.GetAll)]
        public async Task<IActionResult> GetSubmissions(
        [FromQuery] bool base64_encoded = false,
        [FromQuery] string fields = "status,language,time",
        [FromQuery] int page = 1,
        [FromQuery] int per_page = 20)
        {
            string url = $"{_judgeServerUrl}submissions/?base64_encoded={base64_encoded.ToString().ToLower()}&fields={fields}&page={page}&per_page={per_page}";

            HttpResponseMessage response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }

            return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
        }

        // API to delete a submission
        [HttpDelete(SubmissionRoute.Action.Delete)]
        public async Task<IActionResult> DeleteSubmission(
        [FromRoute] string token,
        [FromQuery] string fields = "stdout,stderr,status_id,language_id")
        {
            string url = $"{_judgeServerUrl}submissions/{token}?fields={fields}";

            HttpResponseMessage response = await _httpClient.DeleteAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }

            return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
        }
    }
}