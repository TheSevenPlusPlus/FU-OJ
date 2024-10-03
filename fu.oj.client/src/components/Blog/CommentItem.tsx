// CommentItem.tsx
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TextWithNewLines from "../TextWithNewLines/TextWithNewLines";
import UpdateCommentDialog from "./UpdateCommentDialog";
import DeleteCommentDialog from "./DeleteCommentDialog";

export default function CommentItem({ comment, user, setComments }) {
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

    return (
        <Card className="mb-4">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Avatar className="w-8 h-8 mr-2">
                            <AvatarImage
                                src={user.avatarUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD3OGZfe1nXAqGVpizYHrprvILILEvv1AyEA&s"}
                                alt={user.fullName}
                            />
                            <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{comment.userName}</p>
                            <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setShowUpdateDialog(true)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <p><TextWithNewLines text={comment.content} /></p>
            </CardContent>
            <UpdateCommentDialog
                isOpen={showUpdateDialog}
                onClose={() => setShowUpdateDialog(false)}
                comment={comment}
                setComments={setComments}
            />
            <DeleteCommentDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                commentId={comment.id}
                setComments={setComments}
            />
        </Card>
    );
}