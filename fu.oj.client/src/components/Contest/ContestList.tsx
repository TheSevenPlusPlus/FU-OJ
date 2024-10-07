import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Pagination from '../Pagination/Pagination';
import ItemsPerPageSelector from '../Pagination/ItemsPerPageSelector';
import { getAllContests, deleteContest } from "../../api/contest"; // Import API methods
import { ContestView } from "../../models/ContestModel"
import { Helmet } from "react-helmet-async";

const ContestList: React.FC = () => {
    const navigate = useNavigate();
    const [contests, setContests] = useState<ContestView[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadContests();
    }, [pageIndex, pageSize]);

    const loadContests = async () => {
        try {
            setLoading(true);
            const response = await getAllContests(pageIndex, pageSize, false); // Call API
            setContests(response.data.contests); // Map the API response to the local state
            setTotalPages(response.data.totalPages); // Set total pages for pagination
        } catch (err) {
            setError("Failed to load contests");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this contest?")) {
            try {
                await deleteContest(id); // Call delete API
                await loadContests(); // Reload the current page after deletion
            } catch (err) {
                setError("Failed to delete contest");
            }
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setPageIndex(page);
        }
    };

    const handleItemsPerPageChange = (newSize: number) => {
        setPageSize(newSize);
        setPageIndex(1);
        navigate(`/manager/contests?pageIndex=1&pageSize=${newSize}`);
    };

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <Helmet>
                <title> Contests </title>
                <meta name="description" content="A list of contests" />
            </Helmet>

            <h1 className="text-2xl font-bold mb-4">All contest</h1>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <ItemsPerPageSelector itemsPerPage={pageSize} onItemsPerPageChange={handleItemsPerPageChange} />
                </div>
            </div>
            <Table className="border border-gray-300">
                <TableHeader>
                    <TableRow className="border-b border-gray-300 bg-black">
                        <TableHead className="border border-gray-300 text-white font-bold">Code</TableHead>
                        <TableHead className="border border-gray-300 text-white font-bold">Name</TableHead>
                        <TableHead className="border border-gray-300 text-white font-bold">Start Time</TableHead>
                        <TableHead className="border border-gray-300 text-white font-bold">End Time</TableHead>
                        <TableHead className="border border-gray-300 text-white font-bold">Organizer</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contests.map((contest) => (
                        <TableRow key={contest.id} className="border-b border-gray-300 hover:bg-gray-100 transition duration-200">
                            <TableCell className="border border-gray-300">{contest.code}</TableCell>
                            <TableCell className="border border-gray-300">
                                <Link to={`/contests/${contest.code}`} className="text-blue-600 hover:underline">
                                    {contest.name}
                                </Link>
                            </TableCell>
                            <TableCell className="border border-gray-300">{formatDate(contest.startTime)}</TableCell>
                            <TableCell className="border border-gray-300">{formatDate(contest.endTime)}</TableCell>
                            <TableCell className="border border-gray-300">
                                <Link
                                    to={`/Profile/${contest.organizationName}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {contest.organizationName || "Anonymous"}
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination
                currentPage={pageIndex}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ContestList;
