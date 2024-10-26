using FU.OJ.Server.DTOs;
using FU.OJ.Server.DTOs.Problem.Request;
using FU.OJ.Server.Infra.Const.Authorize;
using FU.OJ.Server.Infra.Const.Route;
using FU.OJ.Server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FU.OJ.Server.Controllers
{
    [ApiController]
    [Route(ProblemRoute.INDEX)]
    public class ProblemController : AuthorizeController
    {
        private readonly IProblemService _service;
        private readonly ITestcaseService _testcaseService;


        public ProblemController(IProblemService service, ILogger<ProblemController> logger, ITestcaseService testcaseService) : base(logger)
        {
            _service = service;
            _testcaseService = testcaseService;

        }
        [Authorize(Roles = RoleAuthorize.AdminManager)]
        [HttpPost(ProblemRoute.Action.Create)]
        public async Task<IActionResult> CreateProblemAsync([FromBody] CreateProblemRequest request)
        {
            try
            {
                var code = await _service.CreateAsync(UserHeader.UserId, request);
                return Ok(code);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
        [AllowAnonymous]
        [HttpGet(ProblemRoute.Action.GetProblemByCodeAsync)]
        public async Task<IActionResult> GetProblemByCodeAsync(string code)
        {
            try
            {
                var problem = await _service.GetByCodeAsync(UserHeader.UserId, code);

                if (problem == null)
                    return NotFound();

                return Ok(problem);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
        [AllowAnonymous]
        [HttpGet(ProblemRoute.Action.GetAllProblemsAsync)]
        public async Task<IActionResult> GetAllProblemsAsync([FromQuery] Paging query, bool? isMine = false)
        {
            try
            {
                if (UserHeader.Role == RoleStatic.RoleAdmin) isMine = false;
                var (problems, totalPages) = await _service.GetAllAsync(query, UserHeader.UserId, isMine);
                return Ok(new { problems, totalPages });
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
        [Authorize(Roles = RoleAuthorize.AdminManager)]
        [HttpPut(ProblemRoute.Action.Update)]
        public async Task<IActionResult> UpdateProblemAsync([FromBody] UpdateProblemRequest request)
        {
            try
            {
                if (UserHeader.Role == RoleStatic.RoleManager)
                {
                    var problem = await _service.GetByCodeAsync(UserHeader.UserId, request.Code);
                    if (problem == null) return NotFound();
                    if (problem.UserId != UserHeader.UserId)
                    {
                        return Unauthorized();
                    }
                }
                var updated = await _service.UpdateAsync(UserHeader.UserId, request);

                if (!updated)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
        [Authorize(Roles = RoleAuthorize.AdminManager)]
        [HttpDelete(ProblemRoute.Action.Delete)]
        public async Task<IActionResult> DeleteProblemAsync(string id)
        {
            try
            {
                if (UserHeader.Role == RoleStatic.RoleManager)
                {
                    var problem = await _service.GetByIdAsync(id);
                    if (problem == null) return NotFound();
                    if (problem.UserId != UserHeader.UserId)
                    {
                        return Unauthorized();
                    }
                }
                await _testcaseService.DeleteAsync(id);
                await _service.DeleteAsync(id);

                return NoContent();
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
    }
}
