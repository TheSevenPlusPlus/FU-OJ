using FU.OJ.Server.DTOs;using FU.OJ.Server.DTOs.Submission.Request;using FU.OJ.Server.DTOs.Submission.Response;using FU.OJ.Server.Infra.Const.Route;using FU.OJ.Server.Service;using Microsoft.AspNetCore.Authorization;using Microsoft.AspNetCore.Mvc;

namespace FU.OJ.Server.Controllers{    [Route(SubmissionRoute.INDEX)]
    [ApiController]
    public class SubmissionController : AuthorizeController
    {
        private readonly ISubmissionService _submissionService;
        public SubmissionController(ISubmissionService submissionService, ILogger<ProblemController> logger) : base(logger)
        {
            _submissionService = submissionService;
        }        [HttpPost(SubmissionRoute.Action.Create)]
        public async Task<IActionResult> SubmitCode([FromBody] CreateSubmissionRequest request, bool base64Encoded = false, bool wait = true)
        {
            try
            {
                return Ok(await _submissionService.CreateAsync(UserHeader.UserId, request, base64Encoded, wait));
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
        [AllowAnonymous]        [HttpGet(SubmissionRoute.Action.Get)]
        public async Task<IActionResult> GetSubmissionDetails([FromRoute] string id)
        {
            try
            {
                SubmissionView submission = await _submissionService.GetByIdAsync(UserHeader.UserId, id);
                return Ok(submission);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
        [AllowAnonymous]        [HttpGet(SubmissionRoute.Action.GetAll)]
        public async Task<IActionResult> GetAllSubmissions([FromQuery] Paging query, [FromQuery] string? problemCode, [FromQuery] bool? isMine = false)
        {
            try
            {
                // Gọi dịch vụ để lấy danh sách submissions và tổng số trang
                var (submissions, totalPages) = await _submissionService.GetAllSubmissionsAsync(query, problemCode, UserHeader.UserId, isMine);
                // Trả về kết quả dưới dạng JSON
                return Ok(new { submissions, totalPages });
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
    }}