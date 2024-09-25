using FU.OJ.Server.DTOs.Blog.Request;
using FU.OJ.Server.Infra.Const.Route;
using FU.OJ.Server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FU.OJ.Server.Controllers
{
    [Route(BlogRoute.INDEX)]
    [ApiController]
    public class BlogController : BaseController
    {
        private readonly IBlogService _blogService;

        public BlogController(IBlogService blogService, ILogger<BlogController> logger) : base(logger)
        {
            _blogService = blogService;
        }

        // Create a new blog
        [HttpPost(BlogRoute.Action.Create)]
        //[Authorize(Roles = RoleAuthorize.AdminManager)]
        public async Task<IActionResult> Create([FromBody] CreateBlogRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var blogId = await _blogService.createAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = blogId }, new { id = blogId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating a blog");
                return StatusCode(500, "An error occurred while creating the blog.");
            }
        }

        // Get blog by id
        [HttpGet(BlogRoute.Action.GetDetails)]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var blog = await _blogService.getByIdAsync(id);
                if (blog == null)
                {
                    return NotFound("Blog not found.");
                }

                return Ok(blog);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while fetching blog with ID {id}");
                return StatusCode(500, "An error occurred while retrieving the blog.");
            }
        }

        // Update a blog
        [HttpPut(BlogRoute.Action.Update)]
        //[Authorize(Roles = RoleAuthorize.AdminManager)]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateBlogRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _blogService.updateAsync(id, request);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while updating blog with ID {id}");
                return StatusCode(500, "An error occurred while updating the blog.");
            }
        }

        // Delete a blog
        [HttpDelete(BlogRoute.Action.Delete)]
        //[Authorize(Roles = RoleAuthorize.AdminManager)]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var blog = await _blogService.getByIdAsync(id);
                if (blog == null)
                {
                    return NotFound("Blog not found.");
                }

                await _blogService.deleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while deleting blog with ID {id}");
                return StatusCode(500, "An error occurred while deleting the blog.");
            }
        }
    }
}
