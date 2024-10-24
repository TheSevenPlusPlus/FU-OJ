import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getAllBlogs } from "../../api/blog";
import Pagination from '../Pagination/Pagination';
import ItemsPerPageSelector from '../Pagination/ItemsPerPageSelector';
import { UserView } from "../../models/UserDTO";
import { getProfile } from "../../api/profile";
import { Helmet } from "react-helmet-async";
import Loading from "../Loading";

interface Blog {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    userName: string;
}

export default function BlogList() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const index = searchParams.get("pageIndex");
        const size = searchParams.get("pageSize");
        if (index) setPageIndex(Number(index));
        if (size) setPageSize(Number(size));
    }, [searchParams]);

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const response = await getAllBlogs(pageIndex, pageSize);
                setBlogs(response.data.blogs);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            } catch (error) {
                setError("Error fetching blogs");
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [pageIndex, pageSize]);

    const handlePageChange = (newPageIndex: number) => {
        if (newPageIndex > 0 && newPageIndex <= totalPages) {
            setPageIndex(newPageIndex);
            navigate(`/blog?pageIndex=${newPageIndex}&pageSize=${pageSize}`);
        }
    };

    const handleItemsPerPageChange = (newSize: number) => {
        setPageSize(newSize);
        setPageIndex(1);
        navigate(`/blog?pageIndex=1&pageSize=${newSize}`);
    };

    if (loading) {
        return < Loading />;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <Helmet>
                <title>Blogs</title>
                <meta name="description" content="Blog for everyone" />
            </Helmet>

            <h1 className="text-4xl font-bold mb-8 text-center">
                Latest Blog Posts
            </h1>
            <div className="space-y-8">
                {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} userName={blog.userName} />
                ))}
            </div>

            <br/>
            <div className="mb-6">
                <ItemsPerPageSelector itemsPerPage={pageSize} onItemsPerPageChange={handleItemsPerPageChange} />
            </div>

            <div className="mt-8">
                <Pagination
                    currentPage={pageIndex}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}

function BlogCard({ blog, userName }: { blog: Blog; userName: string }) {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserView | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const fetchedUser = await getProfile(userName);
            setUser(fetchedUser);
        };

        fetchUser();
    }, [userName]);

    const handleClick = () => {
        navigate(`/blog/${blog.id}`);
    };

    return (
        <Card className="w-full border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden transition-shadow duration-300 hover:shadow-lg">
            <CardHeader className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <CardTitle className="text-2xl font-bold">{blog.title}</CardTitle>
            </CardHeader>
            <CardContent className="py-6">
                <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                    {blog.content}
                </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 px-6 py-4">
                <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border-2 border-gray-300 dark:border-gray-700">
                        <AvatarImage
                            src={user?.avatarUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD3OGZfe1nXAqGVpizYHrprvILILEvv1AyEA&s"}
                            alt={userName}
                        />
                        <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">{user ? user.userName : userName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(blog.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <Button onClick={handleClick} variant="outline">
                    Read More
                </Button>
            </CardFooter>
        </Card>
    );
}