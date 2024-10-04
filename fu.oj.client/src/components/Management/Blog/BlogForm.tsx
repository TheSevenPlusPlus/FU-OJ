import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BlogDetail, CreateBlogRequest, UpdateBlogRequest } from '../../../models/BlogDTO';
import { createBlog, updateBlog, getBlogById } from '../../../api/blog';
import { useToast } from '../../../hooks/use-toast';

interface BlogFormProps {
    blog?: BlogDetail | null;
}

export default function BlogForm({ blog: initialBlog }: BlogFormProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [blog, setBlog] = useState<BlogDetail | null>(initialBlog || null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();
    const { blogId } = useParams<{ blogId: string }>();

    useEffect(() => {
        const fetchBlog = async () => {
            if (blogId) {
                setIsLoading(true);
                try {
                    const response = await getBlogById(blogId);
                    const fetchedBlog = response.data;
                    setBlog(fetchedBlog);
                    setTitle(fetchedBlog.title);
                    setContent(fetchedBlog.content);
                } catch (error) {
                    toast({
                        title: "Error",
                        description: "Failed to fetch blog data. Please try again.",
                        variant: "destructive",
                    });
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchBlog();
    }, [blogId, toast]);

    useEffect(() => {
        if (blog) {
            setTitle(blog.title);
            setContent(blog.content);
        }
    }, [blog]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (title.length < 3 || title.length > 100) {
            toast({
                title: "Validation Error",
                description: "Title must be between 3 and 100 characters.",
                variant: "destructive",
            });
            return;
        }

        if (content.length < 10) {
            toast({
                title: "Validation Error",
                description: "Content must be at least 10 characters long.",
                variant: "destructive",
            });
            return;
        }

        try {
            const userString = localStorage.getItem('user');
            if (!userString) {
                throw new Error('User not found in localStorage');
            }
            const user = JSON.parse(userString);
            const userName = user.userName;

            if (blog) {
                const updateData: UpdateBlogRequest = {
                    id: blog.id,
                    title,
                    content,
                };
                await updateBlog(updateData);
                toast({
                    title: "Success",
                    description: "Blog updated successfully.",
                });
            } else {
                const createData: CreateBlogRequest = {
                    title,
                    content,
                    userName: userName,
                };
                await createBlog(createData);
                toast({
                    title: "Success",
                    description: "Blog created successfully.",
                });
            }
            navigate('/manager/blogs');
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to ${blog ? 'update' : 'create'} blog. Please try again.`,
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return <div className="mt-8 flex justify-center">Loading...</div>;
    }

    return (
        <div className="mt-8 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-center mb-6">{blog ? 'Edit Blog' : 'Create New Blog'}</h2>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        minLength={3}
                        maxLength={100}
                        className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Title must be between 3 and 100 characters.
                    </p>
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                    </label>
                    <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={10}
                        className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Content must be at least 10 characters long.
                    </p>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => navigate('/manager/blogs')}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {blog ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </div>
    );
}