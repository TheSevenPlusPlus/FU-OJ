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
import * as Yup from "yup";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { UserView } from "../../models/UserDTO";
import { getProfile } from "../../api/profile";
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
    const [user, setUser] = useState < UserView | null> (null);
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

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // New state for update and delete dialogs
    const [showUpdateDialog, setShowUpdateDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
    const [updatedContent, setUpdatedContent] = useState("")

    // New state for validation errors
    const [newCommentError, setNewCommentError] = useState(false)
    const [updateCommentError, setUpdateCommentError] = useState(false)

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const fetchedProfile = await getProfile(userName);
                if (!fetchedProfile) {
                    setLoading(false);
                    return;
                }

                setUser(fetchedProfile);
            } catch (err) {
                setError("Failed to load profile data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);


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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

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

    // Create Comment Validation Schema
    const createCommentSchema = Yup.object().shape({
        content: Yup.string()
            .required("Comment content is required")
            .min(3, "Comment must be at least 3 characters long"),
        username: Yup.string().required("Username is required"),
        blogId: Yup.string().required("Blog ID is required"),
    });

    // Update Comment Validation Schema
    const updateCommentSchema = Yup.object().shape({
        content: Yup.string()
            .required("Updated content is required")
            .min(3, "Comment must be at least 3 characters long"),
        username: Yup.string().required("Username is required"),
        commentId: Yup.string().required("Comment ID is required"),
    });

    const handleCommentSubmit = async () => {
        try {
            const lastCommentResponse = await getLastUserComment(blog_id);
            const oneMinute = 60 * 1000;
            const currentTime = new Date().getTime();

            if (lastCommentResponse && lastCommentResponse.data.createdAt) {
                const lastCommentTime = new Date(lastCommentResponse.data.createdAt).getTime();
                if (currentTime - lastCommentTime < oneMinute) {
                    setShowAlert(true);
                    return;
                }
            }

            // Validate new comment
            const validComment = await createCommentSchema.validate({
                content: newComment,
                username: userName,
                blogId: blog_id,
            });

            // Ensure that only the required properties are passed to createBlogComment
            const createResponse = await createBlogComment({
                content: validComment.content,
                blogId: validComment.blogId,
            });

            const newCommentData: Comment = {
                id: createResponse.data,
                content: newComment,
                userName: userName || "CurrentUser",
                createdAt: new Date().toISOString(),
            };

            setComments((prevComments) => [...prevComments, newCommentData]);
            setNewComment("");
            setNewCommentError(false);
            setShowAlert(false);
            toast({
                title: "Success",
                description: "Comment submitted successfully",
            });
        } catch (error) {
            if (error.name === "ValidationError") {
                setNewCommentError(true);
                toast({
                    title: "Validation Error",
                    description: error.message,
                    variant: "destructive",
                });
            } else {
                console.error("Failed to submit comment", error);
                toast({
                    title: "Error",
                    description: "Failed to submit comment",
                    variant: "destructive",
                });
            }
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
            setShowDeleteDialog(false);
        } catch (error) {
            console.error("Failed to delete comment", error);
            toast({
                title: "Error",
                description: "Failed to delete comment",
                variant: "destructive",
            });
        }
    };


    const handleUpdateComment = async (commentId: string, updatedContent: string) => {
        try {
            // Validate updated comment
            const validUpdate = await updateCommentSchema.validate({
                content: updatedContent,
                username: userName,
                commentId,
            });

            // Proceed with API call if validation succeeds
            await updateBlogComment({
                content: validUpdate.content,
                username: validUpdate.username,
                commentId: validUpdate.commentId
            });
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
            setShowUpdateDialog(false);
            setUpdateCommentError(false);
            setShowAlert(false);
        } catch (error) {
            if (error.name === "ValidationError") {
                setUpdateCommentError(true);
                toast({
                    title: "Validation Error",
                    description: error.message,
                    variant: "destructive",
                });
            } else {
                console.error("Failed to update comment", error);
                toast({
                    title: "Error",
                    description: "Failed to update comment",
                    variant: "destructive",
                });
            }
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
                                            src={
                                                user.avatarUrl ||
                                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD3OGZfe1nXAqGVpizYHrprvILILEvv1AyEA&s"
                                            }
                                            alt={user.fullName}
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
                                                setSelectedComment(comment)
                                                setUpdatedContent(comment.content)
                                                setShowUpdateDialog(true)
                                            }}
                                        >
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setSelectedComment(comment)
                                                setShowDeleteDialog(true)
                                            }}
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

                {newCommentError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Comment must be at least 3 characters long
                        </AlertDescription>
                    </Alert>
                )}

                {updateCommentError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Comment must be at least 3 characters long
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

                {/* Update Dialog */}
                <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Comment</DialogTitle>
                            <DialogDescription>
                                Edit your comment below. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <Textarea
                            value={updatedContent}
                            onChange={(e) => setUpdatedContent(e.target.value)}
                            className="min-h-[100px]"
                        />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => handleUpdateComment(selectedComment!.id, updatedContent)}>
                                Save
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Comment</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this comment? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={() => handleDeleteComment(selectedComment!.id)}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
