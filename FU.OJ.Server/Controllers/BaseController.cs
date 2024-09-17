﻿using Microsoft.AspNetCore.Mvc;
using System.Data.Common;
using TaxNet_Common.Exceptions;

namespace FU.OJ.Server.Controllers
{
    [ApiController]
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
    }
}
