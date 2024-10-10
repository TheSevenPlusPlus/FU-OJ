using FU.OJ.Server.Controllers;
using FU.OJ.Server.Infra.Const.Route;
using FU.OJ.Server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route(GeneralRoute.INDEX)]
[ApiController]
[AllowAnonymous]
public class GeneralController : AuthorizeController
{
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
    }
    [HttpGet(GeneralRoute.Action.GetRole)]
    public async Task<IActionResult> GetUserRoleAsync(string userName)
    {
        try
        {
            var role = await _generalService.GetUserRoleAByUserNameAsync(userName);
            return Ok(new { Role = role });
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
    [Authorize]
    [HttpGet("token-info")]
    public IActionResult GetTokenInfo()
    {
        var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
        return Ok(claims); // Trả về tất cả các claims từ token
    }
}
