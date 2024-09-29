using FU.OJ.Server.DTOs;
using FU.OJ.Server.DTOs.Problem.Request;
using FU.OJ.Server.Infra.Const.Route;
using FU.OJ.Server.Service;
using Microsoft.AspNetCore.Mvc;
namespace FU.OJ.Server.Controllers
{
    [ApiController]
    [Route(ProblemRoute.INDEX)]
    //[Authorize]
    public class ProblemController : BaseController
    {
        private readonly IProblemService _service;
        private readonly ITestcaseService _testcaseService;


        public ProblemController(IProblemService service, ILogger<ProblemController> logger, ITestcaseService testcaseService) : base(logger)
        {
            _service = service;
            _testcaseService = testcaseService;

        }

        [HttpPost(ProblemRoute.Action.Create)]
        public async Task<IActionResult> CreateProblemAsync([FromBody] CreateProblemRequest request)
        {
            try
            {
                var code = await _service.CreateAsync(request);
                return Ok(code);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpGet("{code}")]
        public async Task<IActionResult> GetProblemByCodeAsync(string code)
        {
            try
            {
                var problem = await _service.GetByCodeAsync(code);

                if (problem == null)
                    return NotFound();

                return Ok(problem);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProblemsAsync([FromQuery] Paging query)
        {
            try
            {
                var (problems, totalPages) = await _service.GetAllAsync(query);
                return Ok(new { problems, totalPages });
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateProblemAsync([FromBody] UpdateProblemRequest request)
        {
            try
            {
                var updated = await _service.UpdateAsync(request);

                if (!updated)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProblemAsync(string id)
        {
            try
            {
                var problem = await _service.GetByIdAsync(id);
                if (problem == null) return NotFound();
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