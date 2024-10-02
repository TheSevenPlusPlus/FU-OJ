// CreateBlogRequest DTO
export interface CreateBlogRequest {
    title: string;
    content: string;
    userName: string;
}

// UpdateBlogRequest DTO
export interface UpdateBlogRequest {
    id: string;
    title: string;
    content: string;
}

// BlogView DTO
export interface BlogView {
    id: string;
    title: string;
    content: string;
    userName: string;
    createdAt: string;
}

// Paging DTO for paginated results
export interface Paging {
    pageIndex: number;
    pageSize: number;
}

// API response for GetAllBlogs
export interface GetAllBlogsResponse {
    blogs: BlogView[];
    totalPages: number;
}
