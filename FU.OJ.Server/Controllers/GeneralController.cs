using FU.OJ.Server.Controllers;using FU.OJ.Server.Infra.Const.Route;using FU.OJ.Server.Service;using Microsoft.AspNetCore.Mvc;[Route(GeneralRoute.INDEX)][ApiController]public class GeneralController : BaseController{
    private readonly IGeneralService _generalService;

    public GeneralController(IGeneralService generalService, ILogger<GeneralController> logger) : base(logger)
    {
        _generalService = generalService;
    }

    [HttpGet(GeneralRoute.Action.Rank)]
    public async Task<IActionResult> GetUserRankingsAsync([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (page <= 0 || pageSize <= 0)
        {
            return BadRequest("Page and pageSize must be greater than 0.");
        }

        var result = await _generalService.GetUserRankingsAsync(page, pageSize);
        return Ok(result);
    }}