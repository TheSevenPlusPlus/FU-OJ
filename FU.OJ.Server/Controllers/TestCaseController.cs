using FU.OJ.Server.DTOs.Testcase.Request;using FU.OJ.Server.Infra.Const.Authorize;using FU.OJ.Server.Infra.Const.Route;using FU.OJ.Server.Service;using Microsoft.AspNetCore.Authorization;using Microsoft.AspNetCore.Mvc;

namespace FU.OJ.Server.Controllers{    [ApiController]
    [Route(TestcaseRoute.INDEX)]
    public class TestCaseController : AuthorizeController
    {
        private readonly ITestcaseService _service;
        public TestCaseController(ITestcaseService service, ILogger<TestCaseController> logger) : base(logger)
        {
            _service = service;
        }
        [Authorize(Roles = RoleAuthorize.AdminManager)]        [HttpPost(TestcaseRoute.Action.Create)]
        public async Task<IActionResult> CreateTestcaseAsync([FromForm] CreateTestcaseRequest request)
        {
            try
            {
                if (request.TestcaseFile == null)
                    return BadRequest("File is missing.");
                if (string.IsNullOrEmpty(request.ProblemCode))
                {
                    return BadRequest(new { message = "Problem Code is required." });
                }
                return Ok(await _service.CreateAsync(UserHeader.UserId, request));
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
        [Authorize(Roles = RoleAuthorize.AdminManager)]        [HttpDelete("{problemCode}")]
        public async Task<IActionResult> DeleteTestCase(string problemCode)
        {
            try
            {
                bool isDeleted = await _service.DeleteAsync(UserHeader.UserId, problemCode);
                if (isDeleted) return Ok("Delete success");
                else return BadRequest(new { message = "Delete not succcess" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize(Roles = RoleAuthorize.AdminManager)]        [HttpPut(TestcaseRoute.Action.Update)]
        public async Task<IActionResult> UpdateTestCase([FromForm] CreateTestcaseRequest request)
        {
            try
            {
                if (request.TestcaseFile == null)
                    return BadRequest("File is missing.");
                if (string.IsNullOrEmpty(request.ProblemCode))
                {
                    return BadRequest(new { message = "Problem Code is required." });
                }
                await _service.UpdateAsync(request);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}