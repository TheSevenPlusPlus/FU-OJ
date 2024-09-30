import React from 'react';
import { Button } from "@/components/ui/button";
import { BlogView as BlogViewType } from '../../../models/BlogDTO';

interface BlogViewProps {
    blog: BlogViewType;
    onClose: () => void;
}

const BlogDetail: React.FC<BlogViewProps> = ({ blog, onClose }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">{blog.title}</h2>
            <p className="text-sm text-gray-500">
                By {blog.userName} on {new Date(blog.createdAt).toLocaleDateString()}
            </p>
            <div className="prose max-w-none">
                {blog.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
            <Button onClick={onClose}>Back to List</Button>
        </div>
    );
};

export default BlogDetail;