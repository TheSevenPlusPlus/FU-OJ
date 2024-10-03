import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BlogDetail } from '../../../models/BlogDTO';

interface BlogListProps {
    blogs: BlogDetail[];
    onEdit: (blog: BlogDetail) => void;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
}

export function BlogList({ blogs, onEdit, onDelete, onView }: BlogListProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {blogs.map((blog) => (
                    <TableRow key={blog.id}>
                        <TableCell>{blog.title}</TableCell>
                        <TableCell>{blog.userName}</TableCell>
                        <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Button variant="outline" size="sm" onClick={() => onView(blog.id)} className="mr-2">
                                View
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => onEdit(blog)} className="mr-2">
                                Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => onDelete(blog.id)}>
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}