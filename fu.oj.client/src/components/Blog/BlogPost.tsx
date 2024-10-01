"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, MoreVertical } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import {
    getBlogCommentById,
    createBlogComment,
    getLastUserComment,
    deleteBlogComment,
    updateBlogComment,
} from "../../api/blogComment";
import { getBlogById } from "../../api/blog";

interface BlogPost {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    userName: string;
}

interface Comment {
    id: string;
    content: string;
    userName: string;
    createdAt: string;
}

export default function BlogPost() {
    const { blog_id } = useParams<{ blog_id: string }>();
    const navigate = useNavigate();
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalCommentPages, setTotalCommentPages] = useState<number>(0);
    const [showAlert, setShowAlert] = useState(false);
    const { toast } = useToast();
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = userData?.userName;

    useEffect(() => {
        const fetchBlogPost = async () => {
            try {
                const response = await getBlogById(blog_id);
                setBlogPost(response.data);

                const commentsResponse = await getBlogCommentById(
                    blog_id,
                    pageIndex,
                    pageSize,
                );
                setComments(commentsResponse.data.comments);
                setTotalCommentPages(commentsResponse.data.totalPages);
            } catch (err) {
                console.error("Failed to fetch blog post or comments", err);
                toast({
                    title: "Error",
                    description: "Failed to fetch blog post or comments",
                    variant: "destructive",
                });
            }
        };

        fetchBlogPost();
    }, [blog_id, pageIndex, pageSize, toast]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const handleCommentSubmit = async () => {
        try {
            const lastCommentResponse = await getLastUserComment(blog_id, userName);
            const oneMinute = 60 * 1000;
            const currentTime = new Date().getTime();

            if (lastCommentResponse && lastCommentResponse.data.createdAt) {
                const lastCommentTime = new Date(lastCommentResponse.data.createdAt).getTime();

                if (currentTime - lastCommentTime < oneMinute) {
                    setShowAlert(true);
                    return;
                }
            }

            if (newComment.trim()) {
                const createResponse = await createBlogComment({
                    content: newComment,
                    username: userName,
                    blogId: blog_id,
                });

                const newCommentData: Comment = {
                    id: createResponse.data, // Use the ID from the response
                    content: newComment,
                    userName: userName || "CurrentUser",
                    createdAt: new Date().toISOString(),
                };

                setComments((prevComments) => [...prevComments, newCommentData]);
                setNewComment("");
                toast({
                    title: "Success",
                    description: "Comment submitted successfully",
                });
            }
        } catch (error) {
            console.error("Failed to submit comment", error);
            toast({
                title: "Error",
                description: "Failed to submit comment",
                variant: "destructive",
            });
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteBlogComment(commentId);
            setComments((prevComments) =>
                prevComments.filter((comment) => comment.id !== commentId)
            );
            toast({
                title: "Success",
                description: "Comment deleted successfully",
            });
        } catch (error) {
            console.error("Failed to delete comment", error);
            toast({
                title: "Error",
                description: "Failed to delete comment",
                variant: "destructive",
            });
        }
    };


    const handleUpdateComment = async (
        commentId: string,
        updatedContent: string,
    ) => {
        try {
            await updateBlogComment({ content: updatedContent, username: userName, commentId });
            // Update the state to reflect the updated comment
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === commentId
                        ? { ...comment, content: updatedContent }
                        : comment,
                ),
            );
            toast({
                title: "Success",
                description: "Comment updated successfully",
            });
        } catch (error) {
            console.error("Failed to update comment", error);
            toast({
                title: "Error",
                description: "Failed to update comment",
                variant: "destructive",
            });
        }
    };

    const handleCommentPageChange = (newPageIndex: number) => {
        if (newPageIndex > 0 && newPageIndex <= totalCommentPages) {
            setPageIndex(newPageIndex);
            navigate(
                `/blog/${blog_id}?pageIndex=${newPageIndex}&pageSize=${pageSize}`,
            );
        }
    };

    const renderCommentPagination = () => {
        const paginationItems = [];
        const maxPagesToShow = 5;
        const startPage = Math.max(
            1,
            pageIndex - Math.floor(maxPagesToShow / 2),
        );
        const endPage = Math.min(
            totalCommentPages,
            startPage + maxPagesToShow - 1,
        );

        if (startPage > 1) {
            paginationItems.push(
                <Button
                    key={1}
                    onClick={() => handleCommentPageChange(1)}
                    variant="outline"
                    size="sm"
                >
                    1
                </Button>,
            );
            if (startPage > 2) {
                paginationItems.push(
                    <Button
                        key="ellipsis-start"
                        variant="outline"
                        size="sm"
                        disabled
                    >
                        ...
                    </Button>,
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationItems.push(
                <Button
                    key={i}
                    onClick={() => handleCommentPageChange(i)}
                    variant={i === pageIndex ? "default" : "outline"}
                    size="sm"
                >
                    {i}
                </Button>,
            );
        }

        if (endPage < totalCommentPages) {
            if (endPage < totalCommentPages - 1) {
                paginationItems.push(
                    <Button
                        key="ellipsis-end"
                        variant="outline"
                        size="sm"
                        disabled
                    >
                        ...
                    </Button>,
                );
            }
            paginationItems.push(
                <Button
                    key={totalCommentPages}
                    onClick={() => handleCommentPageChange(totalCommentPages)}
                    variant="outline"
                    size="sm"
                >
                    {totalCommentPages}
                </Button>,
            );
        }

        return paginationItems;
    };

    if (!blogPost) {
        return <div>Blog post not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex justify-center py-12">
            <div className="w-full max-w-3xl space-y-8">
                <Card className="bg-white shadow-lg">
                    <CardHeader>
                        <h1 className="text-3xl font-bold">{blogPost.title}</h1>
                        <p className="text-sm text-gray-500">
                            By {blogPost.userName} on{" "}
                            {formatDate(blogPost.createdAt)}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">
                            {blogPost.content}
                        </p>
                    </CardContent>
                </Card>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold mb-4">Comments</h2>

                {comments.map((comment) => (
                    <Card key={comment.id} className="mb-4">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Avatar className="w-8 h-8 mr-2">
                                        <AvatarImage
                                            src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.userName}`}
                                        />
                                        <AvatarFallback>
                                            {comment.userName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">
                                            {comment.userName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(comment.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                            <span className="sr-only">
                                                More options
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => {
                                                const newContent = prompt(
                                                    "Update your comment:",
                                                    comment.content,
                                                );
                                                if (
                                                    newContent &&
                                                    newContent.trim()
                                                ) {
                                                    handleUpdateComment(
                                                        comment.id,
                                                        newContent.trim(),
                                                    );
                                                }
                                            }}
                                        >
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleDeleteComment(comment.id)
                                            }
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{comment.content}</p>
                        </CardContent>
                    </Card>
                ))}

                <div className="flex justify-center mt-4 space-x-2">
                    <Button
                        onClick={() => handleCommentPageChange(pageIndex - 1)}
                        disabled={pageIndex === 1}
                        variant="outline"
                        size="sm"
                    >
                        Previous
                    </Button>
                    {renderCommentPagination()}
                    <Button
                        onClick={() => handleCommentPageChange(pageIndex + 1)}
                        disabled={pageIndex === totalCommentPages}
                        variant="outline"
                        size="sm"
                    >
                        Next
                    </Button>
                </div>

                {showAlert && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            To prevent spam, you can only comment once per
                            minute. Please try again later.
                        </AlertDescription>
                    </Alert>
                )}

                <Card className="mt-8">
                    <CardHeader>
                        <h3 className="text-xl font-semibold">Add a Comment</h3>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Write your comment here..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handleCommentSubmit}
                            className="w-full"
                        >
                            Submit Comment
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
