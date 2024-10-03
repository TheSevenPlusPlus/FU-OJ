// CreateBlogRequest DTO
export interface CreateBlogRequest {
    title: string;
    content: string;
    userName: string;
}

export interface BlogDetail {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    userName: string;
}

// UpdateBlogRequest DTO
export interface UpdateBlogRequest {
    id: string;
    title: string;
    content: string;
}

// Paging DTO for paginated results
export interface Paging {
    pageIndex: number;
    pageSize: number;
}

// API response for GetAllBlogs
export interface GetAllBlogsResponse {
    blogs: BlogDetail[];
    totalPages: number;
}
