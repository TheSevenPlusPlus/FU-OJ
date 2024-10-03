// UpdateCommentDialog.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { updateBlogComment } from "../../api/blogComment";
import * as Yup from "yup";

export default function UpdateCommentDialog({ isOpen, onClose, comment, setComments }) {
    const [updatedContent, setUpdatedContent] = useState(comment.content);

    const updateCommentSchema = Yup.object().shape({
        content: Yup.string()
            .required("Updated content is required")
            .min(3, "Comment must be at least 3 characters long"),
        username: Yup.string().required("Username is required"),
        commentId: Yup.string().required("Comment ID is required"),
    });

    const handleUpdateComment = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            const userName = userData?.userName;

            const validUpdate = await updateCommentSchema.validate({
                content: updatedContent,
                username: userName,
                commentId: comment.id,
            });

            await updateBlogComment({
                content: validUpdate.content,
                username: validUpdate.username,
                commentId: validUpdate.commentId
            });

            setComments((prevComments) =>
                prevComments.map((c) =>
                    c.id === comment.id ? { ...c, content: updatedContent } : c
                )
            );

            onClose();
        } catch (error) {
            if (error.name === "ValidationError") {
                toast.error("Comment must be at least 3 characters long")
            } else {
                toast.error("An error occurred while submitting your comment. Please try again.");
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
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
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateComment}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}