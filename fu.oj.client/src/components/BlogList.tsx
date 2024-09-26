import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllBlogs } from '../api/blog';

interface Blog {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    userName: string;
}

export default function BlogList() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await getAllBlogs();
                setBlogs(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching blogs:', error);
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold mb-8 text-center text-black dark:text-white">Latest Blog Posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>
        </div>
    );
}

function BlogCard({ blog }: { blog: Blog }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/blog/${blog.id}`);
    };

    return (
        <Card className="flex flex-col h-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black overflow-hidden">
            <CardHeader className="bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
                <CardTitle className="text-xl font-bold text-black dark:text-white">{blog.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow py-4">
                <p className="text-gray-700 dark:text-gray-300 line-clamp-4">{blog.content}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between bg-gray-200 dark:bg-gray-800 px-4 py-3">
                <div className="flex items-center space-x-2">
                    <Avatar className="border-2 border-gray-300 dark:border-gray-700">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${blog.userName}&backgroundColor=b6b6b6`} />
                        <AvatarFallback>{blog.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-black dark:text-white">{blog.userName}</span>
                </div>
                <button
                    onClick={handleClick}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-md hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                >
                    Read More
                </button>


            </CardFooter>
        </Card>
    );
}
