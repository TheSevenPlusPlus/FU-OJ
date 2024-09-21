using FU.OJ.Server.Infra.Const;
using FU.OJ.Server.Infra.Const.Route;
using FU.OJ.Server.Infra.Context;
using FU.OJ.Server.Service;
using Microsoft.AspNetCore.Mvc;
using FU.OJ.Server.DTOs.Submission.Request;

namespace FU.OJ.Server.Controllers
{
    [Route(SubmissionRoute.INDEX)]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly string _judgeServerUrl;
        private readonly HttpClient _httpClient;
        private readonly ApplicationDBContext _context;
        private readonly ISubmissionService _submissionService;

        public SubmissionController(HttpClient httpClient, IConfiguration configuration, ApplicationDBContext context, ISubmissionService submissionService)
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
                throw;
            }
        }

        [HttpGet(SubmissionRoute.Action.Get)]
        public async Task<IActionResult> GetSubmissionDetails([FromRoute] string id)
        {
            try
            {
                return Ok(await _submissionService.getByIdAsync(id));
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet(SubmissionRoute.Action.GetWithoutResult)]
        public async Task<IActionResult> GetSubmissionWithoutResultDetails([FromRoute] string id)
        {
            try
            {
                return Ok(await _submissionService.getByIdWithoutResultAsync(id));
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpGet(SubmissionRoute.Action.GetAll)]
        public async Task<IActionResult> GetAllSubmissions()
        {
            try
            {
                return Ok(await _submissionService.getAllSubmissionsAsync());
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}