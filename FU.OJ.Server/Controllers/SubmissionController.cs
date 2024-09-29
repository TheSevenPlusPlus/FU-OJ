using FU.OJ.Server.DTOs;using FU.OJ.Server.DTOs.Submission.Request;using FU.OJ.Server.DTOs.Submission.Response;using FU.OJ.Server.Infra.Const.Route;using FU.OJ.Server.Service;using Microsoft.AspNetCore.Mvc;namespace FU.OJ.Server.Controllers{
    [Route(SubmissionRoute.INDEX)]
    [ApiController]
    public class SubmissionController : BaseController
    {
        private readonly ISubmissionService _submissionService;

        public SubmissionController(ISubmissionService submissionService, ILogger<ProblemController> logger) : base(logger)
        {
            _submissionService = submissionService;
        }

        [HttpPost(SubmissionRoute.Action.Create)]
        public async Task<IActionResult> SubmitCode([FromBody] CreateSubmissionRequest request, [FromQuery] bool base64Encoded = false, [FromQuery] bool wait = true)
        {
            try
            {
                return Ok(await _submissionService.CreateAsync(request, base64Encoded, wait));
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpGet(SubmissionRoute.Action.Get)]
        public async Task<IActionResult> GetSubmissionDetails([FromRoute] string id)
        {
            try
            {
                SubmissionView submission = await _submissionService.GetByIdAsync(id);
                return Ok(submission);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpGet(SubmissionRoute.Action.GetWithoutResult)]
        public async Task<IActionResult> GetSubmissionWithoutResultDetails([FromRoute] string id)
        {
            try
            {
                SubmissionView submission = await _submissionService.GetByIdWithoutResultAsync(id);
                return Ok(submission);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpGet(SubmissionRoute.Action.GetAll)]
        public async Task<IActionResult> GetAllSubmissions([FromQuery] Paging query)
        {
            try
            {
                // Gọi dịch vụ để lấy danh sách submissions và tổng số trang
                var (submissions, totalPages) = await _submissionService.GetAllSubmissionsAsync(query);

                // Trả về kết quả dưới dạng JSON
                return Ok(new { submissions, totalPages });
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpGet(SubmissionRoute.Action.GetAllBelongUser)]
        public async Task<IActionResult> GetAllSubmissionsBelongsUser([FromQuery] Paging query, [FromRoute] string username)
        {
            try
            {
                // Gọi dịch vụ để lấy danh sách submissions và tổng số trang
                var (submissions, totalPages) = await _submissionService.GetAllSubmissionsBelongsUserAsync(query, username);

                // Trả về kết quả dưới dạng JSON
                return Ok(new { submissions, totalPages });
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

    }}