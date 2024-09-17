using FU.OJ.Server.DTOs.Problem.Request;
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
        public TestCaseController(ITestcaseService service, ILogger <TestCaseController> logger) : base(logger)
        {
            _service = service;
        }

        [HttpPost(TestcaseRoute.Action.Create)]
        public async Task<IActionResult> createTestcaseAsync([FromBody] CreateTestcaseRequest request)
        {
            try
            {
                return Ok(await _service.createAsync(request));
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
    }
}
