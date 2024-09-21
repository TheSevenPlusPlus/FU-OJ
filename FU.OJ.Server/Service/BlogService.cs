using FU.OJ.Server.DTOs.Blog.Request;
using FU.OJ.Server.Infra.Context;
using FU.OJ.Server.Infra.Models;
using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Service
{
    public interface IBlogService
    {
        Task<string> createAsync(CreateBlogRequest request);
        public Task<Blog?> getByIdAsync(string id);
        Task updateAsync(string id, UpdateBlogRequest request);
        Task deleteAsync(string id);
    }
    public class BlogService : IBlogService
    {
        private readonly ApplicationDBContext _context;

        public BlogService(ApplicationDBContext context)
        {
            _context = context;
        }

        // Create a new blog
        public async Task<string> createAsync(CreateBlogRequest request)
        {
            var blog = new Blog
            {
                title = request.title,
                content = request.content,
                user_id = request.user_id,
                create_at = DateTime.UtcNow
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            return blog.id; // Return the generated blog ID
        }

        // Get a blog by ID
        public async Task<Blog?> getByIdAsync(string id)
        {
            return await _context.Blogs
                .Include(b => b.user)
                .FirstOrDefaultAsync(b => b.id == id);
        }

        // Update a blog
        public async Task updateAsync(string id, UpdateBlogRequest request)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(b => b.id == id);
            if (blog != null)
            {
                blog.title = request.title;
                blog.content = request.content;

                _context.Blogs.Update(blog);
                await _context.SaveChangesAsync();
            }
        }

        // Delete a blog
        public async Task deleteAsync(string id)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(b => b.id == id);
            if (blog != null)
            {
                _context.Blogs.Remove(blog);
                await _context.SaveChangesAsync();
            }
        }

    }
}
