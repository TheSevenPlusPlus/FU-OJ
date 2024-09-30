import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getAllProblems } from "../api/problem";
import { Problem } from "../models/ProblemModel";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Pagination from './Pagination/Pagination'; // Adjust the path as needed
import ItemsPerPageSelector from './Pagination/ItemsPerPageSelector'; // Import the new component

const ProblemList: React.FC = () => {
    const navigate = useNavigate();
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const index = searchParams.get("pageIndex");
        const size = searchParams.get("pageSize");
        if (index) setPageIndex(Number(index));
        if (size) setPageSize(Number(size));
    }, [searchParams]);

    useEffect(() => {
        const fetchProblems = async () => {
            setLoading(true);
            try {
                const response = await getAllProblems(pageIndex, pageSize);
                const { problems, totalPages } = response.data;
                setProblems(problems);
                setTotalPages(totalPages);
            } catch (err) {
                setError("Failed to fetch problems.");
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, [pageIndex, pageSize]);

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

    const handlePageChange = (newPageIndex: number) => {
        if (newPageIndex > 0 && newPageIndex <= totalPages) {
            setPageIndex(newPageIndex);
            navigate(`/problems?pageIndex=${newPageIndex}&pageSize=${pageSize}`);
        }
    };

    const handleItemsPerPageChange = (newSize: number) => {
        setPageSize(newSize);
        setPageIndex(1); // Reset to first page when changing items per page
        navigate(`/problems?pageIndex=1&pageSize=${newSize}`); // Update URL for new page size
    };

    const getStatusIcon = (acQuantity: number | null, totalTests: number | null) => {
        if (acQuantity === null || totalTests === null) return null;

        if (acQuantity === totalTests) {
            return <i className="fa fa-check-circle text-green-500"></i>;
        } else if (acQuantity < totalTests) {
            return <i className="fas fa-frown text-yellow-500"></i>;
        }

        return null;
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Easy":
                return "text-green-500"; // Green for Easy
            case "Medium":
                return "text-yellow-500"; // Yellow for Medium
            case "Hard":
                return "text-red-500"; // Red for Hard
            default:
                return "text-gray-500"; // Default color
        }
    };

    const getSolutionIcon = (hasSolution: string) => {
        return hasSolution ? <i className="fas fa-check-circle text-green-500"></i> : null;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="spinner"></div>
                <p className="text-center text-lg mt-2">Loading problems...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">All Problems</h1>
                {/* Items per Page Selector */}
                <ItemsPerPageSelector itemsPerPage={pageSize} onItemsPerPageChange={handleItemsPerPageChange} />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px] border-r">Status</TableHead>
                        <TableHead className="w-[80px] border-r">Difficulty</TableHead>
                        <TableHead className="w-[100px] border-r">Code</TableHead>
                        <TableHead className="border-r">Title</TableHead>
                        <TableHead className="w-[120px] border-r">Time Limit</TableHead>
                        <TableHead className="w-[120px] border-r">Memory (MB)</TableHead>
                        <TableHead className="w-[150px] border-r">Created at</TableHead>
                        <TableHead className="w-[100px]">Has Solution</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {problems.map((problem) => (
                        <TableRow key={problem.code} className="hover:bg-gray-100 transition duration-200">
                            <TableCell className="border-r">
                                {getStatusIcon(problem.acQuantity, problem.totalTests)}
                            </TableCell>
                            <TableCell className={`font-medium ${getDifficultyColor(problem.difficulty)} border-r`}>
                                {problem.difficulty}
                            </TableCell>
                            <TableCell className="font-medium border-r">{problem.code}</TableCell>
                            <TableCell className="border-r">
                                <Link to={`/problem/${problem.code}`} className="text-blue-600 hover:underline">
                                    {problem.title}
                                </Link>
                            </TableCell>
                            <TableCell className="font-medium border-r">{problem.timeLimit === 0 ? 1 : problem.timeLimit}s</TableCell>
                            <TableCell className="font-medium border-r">{problem.memoryLimit} MB</TableCell>
                            <TableCell className="font-medium border-r">{formatDate(problem.createdAt)}</TableCell>
                            <TableCell className="font-medium">{getSolutionIcon(problem.hasSolution)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Component */}
            <Pagination
                currentPage={pageIndex}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ProblemList;
