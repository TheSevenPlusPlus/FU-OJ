import apiClient from './client';

export const getBlogById = async (id : string) => {
    return await apiClient.get(`/blogs/get/${id}`);
};

export const getAllBlogs = async (pageIndex: number, pageSize: number) => {
    return await apiClient.get(`/blogs/get`, {
        params: {pageIndex, pageSize}
    });
};