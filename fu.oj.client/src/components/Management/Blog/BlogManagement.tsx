"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BlogList } from "./BlogList";
import { Pagination } from "./Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toast } from "./Toast";
import { getAllBlogs, deleteBlog } from "../../../api/blog";
import { BlogDetail, GetAllBlogsResponse } from "../../../models/BlogDTO";
import { Helmet } from "react-helmet-async";

export default function BlogManagement() {
    const [blogs, setBlogs] = useState<BlogDetail[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const navigate = useNavigate();
    const pageSize: number = 10;

    useEffect(() => {
        fetchBlogs();
    }, [currentPage]);

    const showToast = (message: string, type: "success" | "error"): void => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchBlogs = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await getAllBlogs(currentPage, pageSize);
            const data = response.data as GetAllBlogsResponse;
            setBlogs(data.blogs);
            setTotalPages(data.totalPages);
        } catch (err) {
            showToast("Failed to fetch blogs. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteBlog = async (id: string): Promise<void> => {
        try {
            await deleteBlog(id);
            fetchBlogs();
            showToast("Blog deleted successfully.", "success");
        } catch (err) {
            showToast("Failed to delete blog. Please try again.", "error");
        }
    };

    const handleViewBlog = (id: string): void => {
        navigate(`/blog/${id}`);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <Helmet>
                <title> Blog Management </title>
                <meta name="description" content="" />
            </Helmet>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Blog Management
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Button onClick={() => navigate("/manager/blogs/create")}>
                        Add New Blog
                    </Button>
                </div>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <BlogList
                            blogs={blogs}
                                onEdit={(blog: BlogDetail) =>
                                navigate(`/manager/blogs/update/${blog.id}`)
                            }
                            onDelete={handleDeleteBlog}
                            onView={handleViewBlog}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
                {toast && <Toast message={toast.message} type={toast.type} />}
            </CardContent>
        </Card>
    );
}