using FU.OJ.Server.DTOs;using FU.OJ.Server.DTOs.Blog.Request;using FU.OJ.Server.Infra.Const.Route;using FU.OJ.Server.Service;using Microsoft.AspNetCore.Authorization;using Microsoft.AspNetCore.Mvc;namespace FU.OJ.Server.Controllers{
    [Route(BlogRoute.INDEX)]
    [ApiController]
    public class BlogController : BaseController
    {
        private readonly IBlogService _blogService;

        public BlogController(IBlogService blogService, ILogger<BlogController> logger) : base(logger)
        {
            _blogService = blogService;
        }

        [HttpPost(BlogRoute.Action.Create)]
        //[Authorize(Roles = RoleAuthorize.AdminManager)]
        public async Task<IActionResult> CreateBlogAsync([FromBody] CreateBlogRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var blogId = await _blogService.CreateAsync(request);
                return CreatedAtAction(nameof(GetBlogByIdAsync), new { id = blogId }, new { id = blogId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating a blog.");
                return StatusCode(500, "An error occurred while creating the blog.");
            }
        }

        [HttpGet(BlogRoute.Action.GetDetails)]
        [AllowAnonymous]
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

        [HttpPut(BlogRoute.Action.Update)]
        //[Authorize(Roles = RoleAuthorize.AdminManager)]
        public async Task<IActionResult> UpdateBlogAsync(string id, [FromBody] UpdateBlogRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _blogService.UpdateAsync(id, request);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while updating blog with ID {id}.");
                return StatusCode(500, "An error occurred while updating the blog.");
            }
        }

        [HttpDelete(BlogRoute.Action.Delete)]
        //[Authorize(Roles = RoleAuthorize.AdminManager)]
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
    }}