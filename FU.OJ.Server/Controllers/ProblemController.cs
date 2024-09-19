using FU.OJ.Server.DTOs.Problem.Request;
using FU.OJ.Server.Infra.Const.Route;
using FU.OJ.Server.Service;
using Microsoft.AspNetCore.Mvc;

namespace FU.OJ.Server.Controllers
{
    [ApiController]
    [Route(ProblemRoute.INDEX)]
    public class ProblemController : BaseController
    {
        private readonly IProblemService _service;

        public ProblemController(IProblemService service, ILogger<ProblemController> logger) : base(logger)
        {
            _service = service;
        }

        [HttpPost(ProblemRoute.Action.Create)]
        public async Task<IActionResult> createProblemAsync([FromBody] CreateProblemRequest request)
        {
            try
            {
                var code = await _service.createAsync(request);
                return CreatedAtAction(nameof(getProblemByCodeAsync), new { code = code }, request);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpGet("{code}")]
        public async Task<IActionResult> getProblemByCodeAsync(string code)
        {
            try
            {
                var problem = await _service.getByCodeAsync(code);

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
        public async Task<IActionResult> getAllProblemsAsync()
        {
            try
            {
                var problems = await _service.getAllAsync();
                return Ok(problems);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> updateProblemAsync(string id, [FromBody] UpdateProblemRequest request)
        {
            try
            {
                var updated = await _service.updateAsync(id, request);

                if (!updated)
                    return NotFound();

                return NoContent(); // Return 204 No Content on successful update
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> deleteProblemAsync(string id)
        {
            try
            {
                var deleted = await _service.deleteAsync(id);

                if (!deleted)
                    return NotFound();

                return NoContent(); // Return 204 No Content on successful deletion
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
    }
}
