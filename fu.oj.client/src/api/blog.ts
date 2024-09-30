import { CreateBlogRequest, UpdateBlogRequest } from "../models/BlogDTO";
import apiClient from "./client";

// API to create a blog
export const createBlog = async (blogData: CreateBlogRequest) => {
    return await apiClient.post('/blogs/create', blogData);
};

// API to get a blog by ID
export const getBlogById = async (id: string) => {
    return await apiClient.get(`/blogs/get/${id}`);
};

// API to get all blogs with pagination
export const getAllBlogs = async (pageIndex: number, pageSize: number) => {
    return await apiClient.get(`/blogs/get`, {
        params: { pageIndex, pageSize },
    });
};

// API to update a blog
export const updateBlog = async (blogData: UpdateBlogRequest) => {
    return await apiClient.put(`/blogs/update`, blogData);
};

// API to delete a blog by ID
export const deleteBlog = async (id: string) => {
    return await apiClient.delete(`/blogs/delete/${id}`);
};
