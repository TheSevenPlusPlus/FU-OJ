using FU.OJ.Server.DTOs;using FU.OJ.Server.DTOs.BlogComment.Request;using FU.OJ.Server.DTOs.BlogComment.Response;using FU.OJ.Server.Infra.Const;using FU.OJ.Server.Infra.Context;using FU.OJ.Server.Infra.Models;using Microsoft.EntityFrameworkCore;namespace FU.OJ.Server.Service{    public interface IBlogCommentService
    {
        Task<string> CreateAsync(string userId, CreateBlogCommentRequest request);
        Task<(List<BlogComment> comments, int totalPages)> GetAllAsync(Paging query);
        Task<(List<BlogCommentResponse> comments, int totalPages)> GetCommentsByBlogIdAsync(string blogId, Paging query); // New method for paginated comments by blog ID
        Task<bool> UpdateAsync(string userId, UpdateBlogCommentRequest request);
        Task<bool> DeleteAsync(string userId, string id);
        Task<BlogComment?> GetLastCommentByUserAsync(string userId, string blogId);
    }
    public class BlogCommentService : IBlogCommentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;
        public BlogCommentService(ApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }
        public async Task<string> CreateAsync(string userId, CreateBlogCommentRequest request)
        {            var newComment = new BlogComment
            {
                Content = request.Content,
                UserId = userId,
                BlogId = request.BlogId,
                CreatedAt = DateTime.UtcNow
            };
            _context.BlogComments.Add(newComment);
            await _context.SaveChangesAsync();
            return newComment.Id;
        }
        public async Task<(List<BlogComment> comments, int totalPages)> GetAllAsync(Paging query)
        {
            int totalItems = await _context.BlogComments.CountAsync();
            int totalPages = (int)Math.Ceiling((double)totalItems / query.pageSize);
            var comments = await _context.BlogComments
                .AsNoTracking()
                .Include(c => c.User) // Optional: Include user details
                .Include(c => c.Blog) // Optional: Include blog details
                .OrderByDescending(c => c.CreatedAt)
                .Skip((query.pageIndex - 1) * query.pageSize)
                .Take(query.pageSize)
                .ToListAsync();
            return (comments, totalPages);
        }
        public async Task<(List<BlogCommentResponse> comments, int totalPages)> GetCommentsByBlogIdAsync(string blogId, Paging query)
        {
            // Get total count of comments for the specific blog
            int totalItems = await _context.BlogComments.CountAsync(c => c.BlogId == blogId);
            int totalPages = (int)Math.Ceiling((double)totalItems / query.pageSize);
            var comments = await _context.BlogComments
                .AsNoTracking()
                .Where(c => c.BlogId == blogId)
                .Select(c => new BlogCommentResponse
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    UserName = c.User.UserName
                })
                .OrderByDescending(c => c.CreatedAt)
                .Skip((query.pageIndex - 1) * query.pageSize)
                .Take(query.pageSize)
                .ToListAsync();
            return (comments, totalPages);
        }
        public async Task<bool> UpdateAsync(string userId, UpdateBlogCommentRequest request)
        {
            var comment = await _context.BlogComments.FirstOrDefaultAsync(c => c.Id == request.CommentId && c.UserId == userId);
            if (comment == null)
                throw new Exception(ErrorMessage.NotFound);
            comment.Content = request.Content; // Assume only content can be updated
            _context.BlogComments.Update(comment);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteAsync(string userId, string id)
        {
            var comment = await _context.BlogComments.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
            if (comment == null)
                return false;
            _context.BlogComments.Remove(comment);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<BlogComment?> GetLastCommentByUserAsync(string userId, string blogId)
        {            return await _context.BlogComments
                .Where(c => c.UserId == userId && c.BlogId == blogId)
                .OrderByDescending(c => c.CreatedAt)
                .FirstOrDefaultAsync();
        }

    }}