// AddCommentForm.tsx
import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { createBlogComment, getLastUserComment } from "../../api/blogComment";
import * as Yup from "yup";

export default function AddCommentForm({ blogId, setComments }) {
    const [newComment, setNewComment] = useState("");

    const createCommentSchema = Yup.object().shape({
        content: Yup.string()
            .required("Comment content is required")
            .min(3, "Comment must be at least 3 characters long"),
        username: Yup.string().required("Username is required"),
        blogId: Yup.string().required("Blog ID is required"),
    });

    const handleCommentSubmit = async () => {
        try {
            const lastCommentResponse = await getLastUserComment(blogId);
            const oneMinute = 60 * 1000;
            const currentTime = new Date().getTime();

            if (lastCommentResponse && lastCommentResponse.data.createdAt) {
                const lastCommentTime = new Date(lastCommentResponse.data.createdAt).getTime();
                if (currentTime - lastCommentTime < oneMinute) {
                    toast.error("To prevent spam, you can only comment once per minute. Please try again later.")
                    return;
                }
            }

            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            const userName = userData?.userName;

            const validComment = await createCommentSchema.validate({
                content: newComment,
                username: userName,
                blogId: blogId,
            });

            const createResponse = await createBlogComment({
                content: validComment.content,
                blogId: validComment.blogId,
            });

            const newCommentData = {
                id: createResponse.data,
                content: newComment,
                userName: userName || "CurrentUser",
                createdAt: new Date().toISOString(),
            };

            setComments((prevComments) => [...prevComments, newCommentData]);
            setNewComment("");
        } catch (error) {
            if (error.name === "ValidationError") {
                toast.error("Comment must be at least 3 characters long")
            } else {
                toast.error("An error occurred while submitting your comment. Please try again.");
            }
        }
    };

    return (
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
                <Button onClick={handleCommentSubmit} className="w-full">
                    Submit Comment
                </Button>
            </CardFooter>
        </Card>
    );
}