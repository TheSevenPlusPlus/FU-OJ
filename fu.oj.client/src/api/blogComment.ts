import apiClient from "./client";

export const getAllBlogComments = async (
    pageCommentIndex: number,
    pageCommentSize: number,
) => {
    return await apiClient.get("/blog-comment", {
        params: { pageCommentIndex, pageCommentSize }, // Th�m query params cho ph�n trang
    });
};

export const getBlogCommentById = async (
    blogId: string,
    pageIndex: number,
    pageSize: number,
) => {
    return await apiClient.get(`/blog-comment/${blogId}`, {
        params: { pageIndex, pageSize }, // Th�m query params cho ph�n trang
    });
};

export const createBlogComment = async (data: {
    content: string;
    blogId: string;
}) => {
    return await apiClient.post("/blog-comment/create", data);
};

export const updateBlogComment = async (
    data: { content: string, username: string, commentId: string },
) => {
    return await apiClient.put(`/blog-comment`, data);
};

export const deleteBlogComment = async (id: string) => {
    return await apiClient.delete(`/blog-comment/${id}`);
};

export const getLastUserComment = async (blogId: string) => {
    return await apiClient.get(`/blog-comment/last-time/${blogId}`);
};
