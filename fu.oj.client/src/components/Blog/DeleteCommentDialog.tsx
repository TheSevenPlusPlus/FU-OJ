// DeleteCommentDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteBlogComment } from "../../api/blogComment";

export default function DeleteCommentDialog({ isOpen, onClose, commentId, setComments }) {
    const handleDeleteComment = async () => {
        try {
            await deleteBlogComment(commentId);
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
            onClose();
        } catch (error) {
            console.error("Failed to delete comment", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Comment</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this comment? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteComment}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}