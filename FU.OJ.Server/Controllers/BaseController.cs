using Exceptions;
using FU.OJ.Server.Infra.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
namespace FU.OJ.Server.Controllers{    [ApiController]
    public class BaseController : Controller
    {
        protected ILogger _logger;
        protected ActionResult HandleException(Exception ex)
        {
            _logger.LogError(HttpContext.Request.Path + ": " + ex.Message + "\nStackTrace: " + ex.StackTrace);
            if (ex is ForbiddenException)
            {
                return Forbid(ex.Message);
            }
            if (ex is NotFoundException)
            {
                return NotFound(((NotFoundException)ex).Message);
            }
            if (ex is BadException)
            {
                return BadRequest(((BadException)ex).Message);
            }
            return Problem(detail: ex.Message, statusCode: 500);
        }
        public BaseController(ILogger logger)
        {
            _logger = logger;
        }
    }    public class AuthorizeController : BaseController
    {
        public AuthorizeController(ILogger logger) : base(logger)
        {
        }

        // Property to extract user information from token
        protected UserHeader UserHeader
        {
            get
            {
                try
                {
                    var userHeader = new UserHeader
                    {
                        UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty,  // UserID from claims
                        UserName = User.FindFirst(ClaimTypes.GivenName)?.Value ?? string.Empty,       // UserName from claims
                        Email = User.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty,             // Email from claims
                        Role = User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty               // Role from claims
                    };
                    return userHeader;
                }
                catch
                {
                    return new UserHeader();
                }
            }
        }
    }
}