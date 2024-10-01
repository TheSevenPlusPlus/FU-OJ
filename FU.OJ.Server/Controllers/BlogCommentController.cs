using FU.OJ.Server.DTOs;using FU.OJ.Server.DTOs.BlogComment.Request;using FU.OJ.Server.Infra.Const.Authorize;using FU.OJ.Server.Service;using Microsoft.AspNetCore.Authorization;using Microsoft.AspNetCore.Mvc;
namespace FU.OJ.Server.Controllers{    [ApiController]
    [Route(BlogCommentRoute.INDEX)]
    public class BlogCommentController : AuthorizeController
    {
        private readonly IBlogCommentService _service;
        public BlogCommentController(IBlogCommentService service, ILogger<BlogCommentController> logger) : base(logger)
        {
            _service = service;
        }
        [Authorize]        [HttpPost(BlogCommentRoute.Action.Create)]
        public async Task<IActionResult> CreateBlogCommentAsync([FromBody] CreateBlogCommentRequest request)
        {
            try
            {
                var commentId = await _service.CreateAsync(request);
                return Ok(commentId);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [Authorize(Roles = RoleAuthorize.AnyRole)]        [HttpPut(BlogCommentRoute.Action.Update)]
        public async Task<IActionResult> UpdateBlogCommentAsync(string id, [FromBody] UpdateBlogCommentRequest request)
        {
            try
            {
                var updated = await _service.UpdateAsync(id, request);
                if (!updated)
                    return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
        [Authorize(Roles = RoleAuthorize.AnyRole)]        [HttpDelete(BlogCommentRoute.Action.Delete)]
        public async Task<IActionResult> DeleteBlogCommentAsync(string id)
        {
            try
            {
                var deleted = await _service.DeleteAsync(id);
                if (!deleted)
                    return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
        [AllowAnonymous]        [HttpGet(BlogCommentRoute.Action.GetByBlogId)]
        public async Task<IActionResult> GetCommentsByBlogIdAsync([FromRoute] string blogId, [FromQuery] Paging query)
        {
            var (comments, totalPages) = await _service.GetCommentsByBlogIdAsync(blogId, query);
            return Ok(new { comments, totalPages });
        }
        [AllowAnonymous]        [HttpGet(BlogCommentRoute.Action.GetLastTime)]
        public async Task<IActionResult> getLastUserComment([FromRoute] string username, [FromQuery] string blogId)
        {
            try
            {
                var response = await _service.GetLastCommentByUserAsync(username, blogId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
        [AllowAnonymous]        [HttpGet]
        public async Task<IActionResult> GetAllBlogCommentsAsync([FromQuery] Paging query)
        {
            try
            {
                var (comments, totalPages) = await _service.GetAllAsync(query);
                return Ok(new { comments, totalPages });
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
    }}