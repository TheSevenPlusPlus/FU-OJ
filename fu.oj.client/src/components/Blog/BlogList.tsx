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
import Pagination from '../Pagination/Pagination'; // Adjust the path as needed
import ItemsPerPageSelector from '../Pagination/ItemsPerPageSelector'; // Import the new component
import { UserView } from "../../models/UserDTO";
import { getProfile } from "../../api/profile";

interface Blog {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    userName: string;
}

export default function BlogList() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserView | null>(null);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10); // Define page size
    const [searchParams] = useSearchParams();
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = userData?.userName;

    useEffect(() => {
        const index = searchParams.get("pageIndex");
        const size = searchParams.get("pageSize");
        if (index) setPageIndex(Number(index));
        if (size) setPageSize(Number(size));
    }, [searchParams]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const fetchedProfile = await getProfile(userName);
                if (!fetchedProfile) {
                    setLoading(false);
                    return;
                }

                setUser(fetchedProfile);
                console.log(user);
            } catch (err) {
                setError("Failed to load profile data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    // Fetch blogs with pagination
    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const response = await getAllBlogs(pageIndex, pageSize);
                setBlogs(response.data.blogs); // Assuming API returns { blogs, totalPages }
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
        setPageIndex(1); // Reset to first page when changing items per page
        navigate(`/blog?pageIndex=1&pageSize=${newSize}`); // Update URL for new page size
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="spinner"></div>
                <p className="text-center text-lg mt-2">Loading blogs...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold mb-8 text-center text-black dark:text-white">
                Latest Blog Posts
            </h1>
            <ItemsPerPageSelector itemsPerPage={pageSize} onItemsPerPageChange={handleItemsPerPageChange} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} user={user} />
                ))}
            </div>

            {/* Pagination Component */}
            <Pagination
                currentPage={pageIndex}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

function BlogCard({ blog, user }: { blog: Blog, user: UserView }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/blog/${blog.id}`);
    };

    return (
        <Card className="flex flex-col h-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black overflow-hidden">
            <CardHeader className="bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
                <CardTitle className="text-xl font-bold text-black dark:text-white">
                    {blog.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow py-4">
                <p className="text-gray-700 dark:text-gray-300 line-clamp-4">
                    {blog.content}
                </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between bg-gray-200 dark:bg-gray-800 px-4 py-3">
                <div className="flex items-center space-x-2">
                    <Avatar className="border-2 border-gray-300 dark:border-gray-700">
                        <AvatarImage
                            src={
                                user.avatarUrl ||
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD3OGZfe1nXAqGVpizYHrprvILILEvv1AyEA&s"
                            }
                            alt={user.fullName}
                        />
                        <AvatarFallback>
                            {blog.userName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-black dark:text-white">
                        {blog.userName}
                    </span>
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
