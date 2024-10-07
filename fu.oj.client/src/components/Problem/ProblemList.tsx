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
import { getAllProblems } from "../../api/problem";
import { Problem } from "../../models/ProblemModel";
import { Badge } from "@/components/ui/badge";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Pagination from '../Pagination/Pagination';
import ItemsPerPageSelector from '../Pagination/ItemsPerPageSelector';
import { Helmet } from "react-helmet-async";

export default function ProblemList() {
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
                const response = await getAllProblems(pageIndex, pageSize, null);
                const { problems, totalPages } = response.data;
                //console.log("Data:  ", response.data);
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
        setPageIndex(1);
        navigate(`/problems?pageIndex=1&pageSize=${newSize}`);
    };

    const getStatusIcon = (passTestCount: number, totalTests: number) => {
        if (passTestCount == null || totalTests == null ||
            passTestCount === 0 || totalTests === 0) return null;

        if (passTestCount === totalTests)
            return <i className="fa fa-check-circle text-green-500"></i>;

        return <i className="fas fa-frown text-yellow-500"></i>;
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case "easy":
                return "bg-green-500";
            case "hard":
                return "bg-red-500";
            case "medium":
                return "bg-yellow-500";
            default:
                return "bg-gray-500";
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
            <Helmet>
                <title> Problem List</title> 
            </Helmet>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">All Problems</h1>
                <ItemsPerPageSelector itemsPerPage={pageSize} onItemsPerPageChange={handleItemsPerPageChange} />
            </div>

            <Table className="border border-gray-300">
                <TableHeader>
                    <TableRow className="border-b border-gray-300 bg-black">
                        <TableHead className="w-[50px] border border-gray-300 text-white font-bold">Status</TableHead>
                        <TableHead className="w-[80px] border border-gray-300 text-white font-bold">Difficulty</TableHead>
                        <TableHead className="w-[100px] border border-gray-300 text-white font-bold">Code</TableHead>
                        <TableHead className="border border-gray-300 text-white font-bold">Title</TableHead>
                        <TableHead className="w-[120px] border border-gray-300 text-white font-bold">Time Limit</TableHead>
                        <TableHead className="w-[120px] border border-gray-300 text-white font-bold">Memory (MB)</TableHead>
                        <TableHead className="w-[150px] border border-gray-300 text-white font-bold">Created at</TableHead>
                        <TableHead className="w-[100px] border border-gray-300 text-white font-bold">Has Solution</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {problems.map((problem) => (
                        <TableRow
                            key={problem.code}
                            className="border-b border-gray-300 hover:bg-gray-100 transition duration-200"
                        >
                            <TableCell className="flex items-center justify-center">
                                {getStatusIcon(problem.passedTestCount, problem.totalTests)}
                            </TableCell>

                            <TableCell className="border border-gray-300">
                                <Badge
                                    className={`font-medium text-white ${getDifficultyColor(problem.difficulty)}`}
                                    variant={
                                        problem.difficulty === "Easy"
                                            ? "default"
                                            : problem.difficulty === "Medium"
                                                ? "secondary"
                                                : "destructive"
                                    }
                                >
                                    {problem.difficulty || "Unknown"}
                                </Badge>
                            </TableCell>

                            <TableCell className="font-medium border border-gray-300">{problem.code}</TableCell>
                            <TableCell className="border border-gray-300">
                                <Link to={`/problem/${problem.code}`} className="text-blue-600 hover:underline">
                                    {problem.title}
                                </Link>
                            </TableCell>
                            <TableCell className="font-medium border border-gray-300">
                                {problem.timeLimit === 0 ? 1 : problem.timeLimit}s
                            </TableCell>
                            <TableCell className="font-medium border border-gray-300">{Math.floor(problem.memoryLimit / 1024)} MB</TableCell>
                            <TableCell className="font-medium border border-gray-300">
                                {formatDate(problem.createdAt)}
                            </TableCell>
                            <TableCell className="flex items-center justify-center">
                                {getSolutionIcon(problem.hasSolution)}
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
}