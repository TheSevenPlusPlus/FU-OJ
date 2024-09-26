﻿using FU.OJ.Server.DTOs.Blog.Request;
using FU.OJ.Server.DTOs.Blog.Response;
using FU.OJ.Server.Infra.Context;
using FU.OJ.Server.Infra.Models;
using Microsoft.EntityFrameworkCore;

namespace FU.OJ.Server.Service
{
    public interface IBlogService
    {
        Task<string> CreateAsync(CreateBlogRequest request);
        Task<BlogView?> GetByIdAsync(string id);
        Task UpdateAsync(string id, UpdateBlogRequest request);
        Task DeleteAsync(string id);
        Task<List<BlogView>> GetAllBlogsAsync();
    }

    public class BlogService : IBlogService
    {
        private readonly ApplicationDbContext _context;

        public BlogService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Create a new blog
        public async Task<string> CreateAsync(CreateBlogRequest request)
        {
            var blog = new Blog
            {
                Title = request.Title,
                Content = request.Content,
                UserId = request.UserId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            return blog.Id; // Return the generated blog ID
        }

        // Get a blog by ID
        public async Task<BlogView?> GetByIdAsync(string id)
        {
            return await _context.Blogs
                .Where(blog => blog.Id == id)
                .Select(blog => new BlogView
                {
                    Id = blog.Id,
                    Title = blog.Title,
                    Content = blog.Content,
                    CreatedAt = blog.CreatedAt,
                    UserId = blog.UserId,
                    UserName = blog.User.UserName
                }).FirstOrDefaultAsync();
        }

        public async Task<List<BlogView>> GetAllBlogsAsync()
        {
            return await _context.Blogs.Select(blog => new BlogView
            {
                Id = blog.Id,
                Title = blog.Title,
                Content = blog.Content,
                CreatedAt = blog.CreatedAt,
                UserId = blog.UserId,
                UserName = blog.User.UserName
            }).ToListAsync();
        }

        // Update a blog
        public async Task UpdateAsync(string id, UpdateBlogRequest request)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(b => b.Id == id);
            if (blog != null)
            {
                blog.Title = request.Title;
                blog.Content = request.Content;

                _context.Blogs.Update(blog);
                await _context.SaveChangesAsync();
            }
        }

        // Delete a blog
        public async Task DeleteAsync(string id)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(b => b.Id == id);
            if (blog != null)
            {
                _context.Blogs.Remove(blog);
                await _context.SaveChangesAsync();
            }
        }
    }
}
