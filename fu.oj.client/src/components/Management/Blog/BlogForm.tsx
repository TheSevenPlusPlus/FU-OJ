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

const BlogForm: React.FC<BlogFormProps> = ({ blog: initialBlog }) => {
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

        if (title.length === 0 || title.length > 100) {
            toast({
                title: "Validation Error",
                description: "Title is required and must be less than 100 characters.",
                variant: "destructive",
            });
            return;
        }

        if (content.length < 10) {
            toast({
                title: "Validation Error",
                description: "Content is required and must be at least 10 characters long.",
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
                const response = await updateBlog(updateData);
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
                const response = await createBlog(createData);
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

    const handleViewBlog = () => {
        if (blog) {
            navigate(`/blog/${blog.id}`);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">{blog ? 'Edit Blog' : 'Create New Blog'}</h2>
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    maxLength={100}
                />
                <p className="text-sm text-gray-500 mt-1">
                    Title is required and must be less than 100 characters.
                </p>
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content
                </label>
                <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={10}
                />
                <p className="text-sm text-gray-500 mt-1">
                    Content is required and must be at least 10 characters long.
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
    );
};

export default BlogForm;