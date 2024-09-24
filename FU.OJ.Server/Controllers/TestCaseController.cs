using FU.OJ.Server.DTOs.Testcase.Request;
using FU.OJ.Server.Infra.Const.Route;
using FU.OJ.Server.Service;
using Microsoft.AspNetCore.Mvc;

namespace FU.OJ.Server.Controllers
{
    [ApiController]
    [Route(TestcaseRoute.INDEX)]
    public class TestCaseController : BaseController
    {
        public readonly ITestcaseService _service;
        public TestCaseController(ITestcaseService service, ILogger<TestCaseController> logger) : base(logger)
        {
            _service = service;
        }

        [HttpPost(TestcaseRoute.Action.Create)]
        public async Task<IActionResult> createTestcaseAsync([FromForm] CreateTestcaseRequest request)
        {
            try
            {
                if (request.testcase_file == null)
                    return BadRequest("File is missing.");
                if (string.IsNullOrEmpty(request.problem_code))
                {
                    return BadRequest(new { message = "Problem Code is required." });
                }
                return Ok(await _service.createAsync(request));
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpDelete("{problem_code}")]
        public async Task<IActionResult> deleteTestCase(string problem_code)
        {
            try
            {

                await _service.deleteAsync(problem_code);
                return Ok("Delete success");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut(TestcaseRoute.Action.Update)]
        public async Task<IActionResult> updateTestCase([FromForm] CreateTestcaseRequest request)
        {
            try
            {
                if (request.testcase_file == null)
                    return BadRequest("File is missing.");
                if (string.IsNullOrEmpty(request.problem_code))
                {
                    return BadRequest(new { message = "Problem Code is required." });
                }
                await _service.updateAsync(request);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
