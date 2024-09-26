import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getBlogById } from '../api/blog';

interface BlogPost {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    userName: string;
}

interface Comment {
    id: number;
    content: string;
    userName: string;
    createdAt: string;
}

// Dummy initial data for demo purposes
const initialBlogPosts: BlogPost[] = [
    {
        id: 1,
        title: "The Future of AI in Web Development",
        content: "AI is revolutionizing web development...",
        createdAt: "2023-09-25T12:00:00Z",
        userName: "TechGuru"
    },
    {
        id: 2,
        title: "Understanding React Performance",
        content: "Performance optimization in React involves...",
        createdAt: "2023-09-26T12:00:00Z",
        userName: "ReactPro"
    }
];

const initialComments: Comment[] = [
    {
        id: 1,
        content: "Great insights! I'm excited to see how AI will shape our industry.",
        userName: "WebDev123",
        createdAt: "2023-09-25T14:30:00Z"
    },
    {
        id: 2,
        content: "I wonder how this will affect job prospects for junior developers.",
        userName: "NewbieCoder",
        createdAt: "2023-09-25T15:45:00Z"
    }
];

export default function BlogPost() {
    const { blog_id } = useParams<{ blog_id: string }>(); // Extract the blog_id from the URL
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState("");

    // Fetch the blog post based on the blog_id from the URL
    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await getBlogById(blog_id);
                setBlogPost(response.data);
            } catch (err) {
                throw err;
            }
        };

        fetchProblem();
    }, [blog_id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Set to true if you want 12-hour format
        });
    };

    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            const comment: Comment = {
                id: comments.length + 1,
                content: newComment,
                userName: "CurrentUser", // In a real app, this would be the logged-in user
                createdAt: new Date().toISOString()
            };
            setComments([...comments, comment]);
            setNewComment("");
        }
    };

    if (!blogPost) {
        return <div>Blog post not found</div>;
    }

    return (
        <div className="min-h-screen bg-white text-black flex justify-center py-12">
            <div className="w-full max-w-3xl">
                <Card className="bg-white border-gray-200 shadow-md">
                    <CardHeader>
                        <h1 className="text-3xl font-bold text-gray-900">{blogPost.title}</h1>
                        <p className="text-sm text-gray-600">
                            By {blogPost.userName} on {formatDate(blogPost.createdAt)}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap text-gray-800">{blogPost.content}</p>
                    </CardContent>
                </Card>

                <Separator className="my-8 bg-gray-200" />

                <h2 className="text-2xl font-bold mb-4 text-gray-900">Comments</h2>

                {comments.map((comment) => (
                    <Card key={comment.id} className="mb-4 bg-white border-gray-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center">
                                <Avatar className="w-8 h-8 mr-2">
                                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.userName}`} />
                                    <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-gray-900">{comment.userName}</p>
                                    <p className="text-xs text-gray-500">
                                        {formatDate(comment.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-800">{comment.content}</p>
                        </CardContent>
                    </Card>
                ))}

                <Card className="mt-8 bg-white border-gray-200 shadow-md">
                    <CardHeader>
                        <h3 className="text-xl font-semibold text-gray-900">Add a Comment</h3>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Write your comment here..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleCommentSubmit} className="bg-blue-600 text-white hover:bg-blue-700">
                            Submit Comment
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
