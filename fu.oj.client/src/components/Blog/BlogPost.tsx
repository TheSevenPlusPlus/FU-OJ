"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import { getBlogCommentById } from "../../api/blogComment";
import { getBlogById } from "../../api/blog";
import { getProfile } from "../../api/profile";
import BlogPostHeader from "./BlogPostHeader";
import CommentList from "./CommentList";
import AddCommentForm from "./AddCommentForm";
import { UserView } from "../../models/UserDTO";
import { BlogDetail } from "../../models/BlogDTO";
import ItemsPerPageSelector from '../Pagination/ItemsPerPageSelector';
import Pagination from '../Pagination/Pagination';

export default function BlogPost() {
    const { blog_id } = useParams<{ blog_id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserView | null>(null);
    const [blogPost, setBlogPost] = useState<BlogDetail | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);  // Show loading spinner
            try {
                // Fetch the blog details first
                const blogResponse = await getBlogById(blog_id);
                const blogData = blogResponse.data;
                setBlogPost(blogData);

                // Now fetch the user profile based on the blog's `userName`
                const fetchedProfile = await getProfile(blogData.userName);
                setUser(fetchedProfile);

                // Fetch the comments for the blog post with pagination
                const commentsResponse = await getBlogCommentById(blog_id, pageIndex, pageSize);
                setComments(commentsResponse.data.comments);
                setTotalPages(commentsResponse.data.totalPages);

            } catch (err) {
                setError("Failed to load data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        // Fetch data when blog_id, pageIndex, or pageSize change
        fetchData();
    }, [blog_id, pageIndex, pageSize]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!blogPost) return <div>Blog post not found</div>;

    const handlePageChange = (newPageIndex: number) => {
        if (newPageIndex > 0 && newPageIndex <= totalPages) {
            setPageIndex(newPageIndex);
            navigate(`/blog/${blog_id}?pageIndex=${newPageIndex}&pageSize=${pageSize}`);
        }
    };

    const handleItemsPerPageChange = (newSize: number) => {
        setPageSize(newSize);
        setPageIndex(1);
        navigate(`/blog/${blog_id}?pageIndex=1&pageSize=${newSize}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex justify-center py-12">
            <div className="w-full max-w-3xl space-y-8">
                <BlogPostHeader blogPost={blogPost} />
                <Separator className="my-8" />
                <h2 className="text-2xl font-bold mb-4">Comments</h2>
                <ItemsPerPageSelector itemsPerPage={pageSize} onItemsPerPageChange={handleItemsPerPageChange} />
                <CommentList comments={comments} user={user} setComments={setComments} />
                <Pagination
                    currentPage={pageIndex}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
                <AddCommentForm blogId={blog_id} setComments={setComments} />
            </div>
        </div>
    );
}