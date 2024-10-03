// CommentList.tsx
import CommentItem from "./CommentItem";

export default function CommentList({ comments, user, setComments }) {
    return (
        <>
            {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} user={user} setComments={setComments} />
            ))}
        </>
    );
}