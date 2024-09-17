using FU.OJ.Server.DTOs.Problem.Request;
using FU.OJ.Server.Infra.Const.Route;
using FU.OJ.Server.Service;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Reflection.Metadata;

namespace FU.OJ.Server.Controllers
{
    [ApiController]
    [Route(ProblemRoute.INDEX)]
    public class ProblemController : BaseController
    {
        public readonly IProblemService _service;
        public ProblemController(IProblemService service, ILogger<ProblemController> logger) : base(logger)
        {
            _service = service;
        }

        [HttpPost(ProblemRoute.Action.Create)]
        public async Task<IActionResult> createProblemAsync([FromBody] CreateProblemRequest request)
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
