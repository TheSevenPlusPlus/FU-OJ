using FU.OJ.Server.DTOs;using FU.OJ.Server.DTOs.Blog.Request;using FU.OJ.Server.DTOs.Blog.Response;using FU.OJ.Server.Infra.Context;using FU.OJ.Server.Infra.Models;using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
public interface IBlogService
{
    Task<string> CreateAsync(CreateBlogRequest request);
    Task<BlogView?> GetByIdAsync(string id);
    Task<bool> UpdateAsync(UpdateBlogRequest request);
    Task<bool> DeleteAsync(string id);
    Task<(List<BlogView> blogs, int totalPages)> GetAllBlogsAsync(Paging query);
}
public class BlogService : IBlogService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    public BlogService(ApplicationDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }
    // Create a new blog
    public async Task<string> CreateAsync(CreateBlogRequest request)
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(request.Title) || request.Title.Length > 100)
            throw new ArgumentException("Title is required and must be less than 100 characters.");

        if (string.IsNullOrWhiteSpace(request.Content) || request.Content.Length < 10)
            throw new ArgumentException("Content is required and must be at least 10 characters long.");

        var user = await _userManager.FindByNameAsync(request.UserName);
        if (user == null)
            throw new Exception("User doesn't exist"); // Ném ngoại lệ nếu người dùng không tồn tại

        var blog = new Blog
        {
            Title = request.Title,
            Content = request.Content,
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow
        };
        _context.Blogs.Add(blog);
        await _context.SaveChangesAsync();
        return blog.Id; // Return the generated blog ID
    }

    // Get a blog by ID
    public async Task<BlogView?> GetByIdAsync(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            throw new ArgumentException("Blog ID is required.");

        return await _context.Blogs
            .Where(blog => blog.Id == id)
            .Select(blog => new BlogView
            {
                Id = blog.Id,
                Title = blog.Title,
                Content = blog.Content,
                CreatedAt = blog.CreatedAt,
                UserName = blog.User.UserName
            }).FirstOrDefaultAsync();
    }

    public async Task<(List<BlogView> blogs, int totalPages)> GetAllBlogsAsync(Paging query)
    {
        if (query.pageIndex < 1)
            throw new ArgumentException("Page index must be greater than 0.");
        if (query.pageSize < 1 || query.pageSize > 100)
            throw new ArgumentException("Page size must be between 1 and 100.");

        var totalItems = await _context.Blogs.CountAsync();            int totalPages = (int)Math.Ceiling((double)totalItems / query.pageSize);
            var blogs = await _context.Blogs.Select(blog => new BlogView
            {
                Id = blog.Id,
                Title = blog.Title,
                Content = blog.Content,
                CreatedAt = blog.CreatedAt,
                UserId = blog.UserId,
                UserName = blog.User.UserName
            })
            .OrderByDescending(c => c.CreatedAt)
            .Skip((query.pageIndex - 1) * query.pageSize) // Bỏ qua các phần tử của trang trước
                                                                                          .Take(query.pageSize) // Lấy số lượng phần tử của trang hiện tại
                                                                                                    .ToListAsync();
        return (blogs, totalPages);
    }

    // Update a blog
    public async Task<bool> UpdateAsync(UpdateBlogRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Id))
            throw new ArgumentException("Blog ID is required.");

        if (string.IsNullOrWhiteSpace(request.Title) || request.Title.Length > 100)
            throw new ArgumentException("Title is required and must be less than 100 characters.");

        if (string.IsNullOrWhiteSpace(request.Content) || request.Content.Length < 10)
            throw new ArgumentException("Content is required and must be at least 10 characters long.");

        var blog = await _context.Blogs.FirstOrDefaultAsync(b => b.Id == request.Id);
        if (blog == null)
        {
            return false; // Trả về false nếu không tìm thấy blog
        }

        blog.Title = request.Title;
        blog.Content = request.Content;
        _context.Blogs.Update(blog);
        await _context.SaveChangesAsync();

        return true; // Trả về true nếu cập nhật thành công
    }

    // Delete a blog
    public async Task<bool> DeleteAsync(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            throw new ArgumentException("Blog ID is required.");

        var blog = await _context.Blogs.FirstOrDefaultAsync(b => b.Id == id);
        if (blog == null)
        {
            return false; // Trả về false nếu không tìm thấy blog
        }

        _context.Blogs.Remove(blog);
        await _context.SaveChangesAsync();

        return true; // Trả về true nếu xóa thành công
    }

}
