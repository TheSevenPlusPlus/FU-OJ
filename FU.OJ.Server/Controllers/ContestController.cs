using FU.OJ.Server.Controllers;
using FU.OJ.Server.DTOs;
using FU.OJ.Server.DTOs.Blog.Request;
using FU.OJ.Server.DTOs.Contest.Request;
using FU.OJ.Server.Infra.Const.Authorize;
using FU.OJ.Server.Infra.Const.Route;
using FU.OJ.Server.Infra.Models;
using FU.OJ.Server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route(ContestRoute.INDEX)]
[ApiController]
public class ContestController : AuthorizeController
{
    private readonly IContestService _contestService;

    public ContestController(IContestService contestService, ILogger<ContestController> logger) : base(logger)
    {
        _contestService = contestService;
    }

    [HttpPost(ContestRoute.Action.Create)]
    [Authorize(Roles = RoleAuthorize.AdminManager)]
    public async Task<IActionResult> CreateContestAsync([FromBody] CreateContestRequest request)
    {
        try
        {
            var contestId = await _contestService.CreateContestAsync(UserHeader.UserId, request);
            return Ok(contestId);
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    [HttpGet(ContestRoute.Action.GetByCode)]
    public async Task<IActionResult> GetContestByCodeAsync([FromRoute] string contestCode)
    {
        try
        {
            var contest = await _contestService.GetContestInfoAsync(contestCode);
            return Ok(contest);
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    [HttpPost(ContestRoute.Action.SubmitCode)]
    public async Task<IActionResult> SubmitCode([FromBody] SubmitCodeContestProblemRequest request)
    {
        try
        {
            var result = await _contestService.SubmitCode(UserHeader.UserId, request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    [HttpPost(ContestRoute.Action.RegisterContest)]
    public async Task<IActionResult> RegisterContest([FromRoute] string contestCode)
    {
        try
        {
            var result = await _contestService.RegisterContest(UserHeader.UserId, contestCode);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    [HttpGet(ContestRoute.Action.GetAll)]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllContestAsync([FromQuery] Paging query, bool? isMine = false)
    {
        try
        {
            var(contests, totalPages) = await _contestService.GetListContestsAsync(query, UserHeader.UserId, isMine);
            return Ok(new {contests, totalPages});
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    [HttpGet(ContestRoute.Action.GetContestProblem)]
    [AllowAnonymous]
    public async Task<IActionResult> GetContestProblem([FromRoute] string contestCode)
    {
        try
        {
            var list = await _contestService.GetContestProblemInfoByCodeAsync(contestCode, UserHeader.UserId);
            return Ok(list);
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    [HttpGet(ContestRoute.Action.GetContestParticipant)]
    [AllowAnonymous]
    public async Task<IActionResult> GetContestParticipant([FromRoute] string contestCode)
    {
        try
        {
            var list = await _contestService.GetContestParticipantInfoByCodeAsync(contestCode);
            return Ok(list);
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    [HttpGet(ContestRoute.Action.IsRegistered)]
    public async Task<IActionResult> IsRegistered([FromRoute] string contestCode)
    {
        try
        {
            var result = await _contestService.IsRegistered(contestCode, UserHeader.UserId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }

    [HttpGet(ContestRoute.Action.Rank)]
    public async Task<IActionResult> GetRank([FromRoute] string contestCode)
    {
        try
        {
            var result = await _contestService.GetRank(contestCode);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }
}
