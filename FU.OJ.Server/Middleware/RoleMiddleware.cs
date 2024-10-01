using FU.OJ.Server.Infra.Const;
using System.Security.Claims;

namespace FU.OJ.Server.Middleware
{
    public class RoleMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RoleMiddleware> _logger;

        public RoleMiddleware(RequestDelegate next, ILogger<RoleMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            // Kiểm tra xem route hiện tại có phải là public route không
            if (PublicRoutes.Routes.Contains(context.Request.Path.ToString().ToLower()))
            {
                await _next(context);
                return; // Bỏ qua kiểm tra xác thực cho route công khai
            }

            // Kiểm tra xem người dùng đã xác thực chưa
            if (context.User.Identity.IsAuthenticated)
            {
                _logger.LogInformation("User is authenticated.");

                // Lấy vai trò từ claims
                var roles = context.User.Claims
                    .Where(c => c.Type == ClaimTypes.Role)
                    .Select(c => c.Value)
                    .ToList();

                // Thực hiện logic kiểm tra vai trò ở đây
                if (roles.Contains("Admin"))
                {
                    _logger.LogInformation("User has Admin role.");
                    await _next(context);
                    return;
                }

                // Nếu không có quyền, trả về 403 Forbidden
                _logger.LogWarning("User does not have Admin role. Returning 403 Forbidden.");
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return;
            }

            // Nếu người dùng không xác thực, trả về 401 Unauthorized
            _logger.LogWarning("User is not authenticated. Returning 401 Unauthorized.");
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        }
    }
}
