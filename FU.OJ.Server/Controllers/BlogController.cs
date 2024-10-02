using FU.OJ.Server.Controllers;
using FU.OJ.Server.DTOs;
using FU.OJ.Server.DTOs.Blog.Request;
using FU.OJ.Server.Infra.Const.Authorize;
using FU.OJ.Server.Infra.Const.Route;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route(BlogRoute.INDEX)]
[ApiController]
public class BlogController : AuthorizeController
{
    private readonly IBlogService _blogService;

    public BlogController(IBlogService blogService, ILogger<BlogController> logger) : base(logger)
    {
        _blogService = blogService;
    }
    [Authorize(Roles = RoleAuthorize.AdminManager)]
    [HttpPost(BlogRoute.Action.Create)]
    public async Task<IActionResult> CreateBlogAsync([FromBody] CreateBlogRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var blogId = await _blogService.CreateAsync(request);
            return Ok(blogId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating a blog.");
            return StatusCode(500, "An error occurred while creating the blog.");
        }
    }
    [AllowAnonymous]
    [HttpGet(BlogRoute.Action.GetDetails)]
    public async Task<IActionResult> GetBlogByIdAsync(string id)
    {
        try
        {
            var blog = await _blogService.GetByIdAsync(id);
            if (blog == null)
            {
                return NotFound("Blog not found.");
            }

            return Ok(blog);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error occurred while fetching blog with ID {id}.");
            return StatusCode(500, "An error occurred while retrieving the blog.");
        }
    }
    [AllowAnonymous]
    [HttpGet(BlogRoute.Action.GetAll)]
    public async Task<IActionResult> GetAllBlogsAsync([FromQuery] Paging query)
    {
        try
        {
            var (blogs, totalPages) = await _blogService.GetAllBlogsAsync(query);
            return Ok(new { blogs, totalPages });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching blogs.");
            return StatusCode(500, "An error occurred while retrieving the blogs.");
        }
    }
    [AllowAnonymous]
    [HttpPut(BlogRoute.Action.Update)]
    public async Task<IActionResult> UpdateBlogAsync([FromBody] UpdateBlogRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            await _blogService.UpdateAsync(request);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error occurred while updating blog with ID {request.Id}.");
            return StatusCode(500, "An error occurred while updating the blog.");
        }
    }

    [HttpDelete(BlogRoute.Action.Delete)]
    public async Task<IActionResult> DeleteBlogAsync(string id)
    {
        try
        {
            var blog = await _blogService.GetByIdAsync(id);
            if (blog == null)
            {
                return NotFound("Blog not found.");
            }

            await _blogService.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error occurred while deleting blog with ID {id}.");
            return StatusCode(500, "An error occurred while deleting the blog.");
        }
    }
}
