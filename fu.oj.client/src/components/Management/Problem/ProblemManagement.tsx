import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Plus,
    Pencil,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getAllProblems, deleteProblem } from "../../../api/problem";
import Pagination from '../../Pagination/Pagination';
import ItemsPerPageSelector from '../../Pagination/ItemsPerPageSelector';
import { Badge } from "@/components/ui/badge";
interface Problem {
    id: string;
    code: string;
    title: string;
    description: string;
    constraints: string;
    input: string;
    output: string;
    exampleInput: string;
    exampleOutput: string;
    timeLimit: number;
    memoryLimit: number;
    difficulty: string;
    hasSolution: string;
}

const ProblemManagement: React.FC = () => {
    const navigate = useNavigate();
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadProblems();
    }, [pageIndex, pageSize]);

    const loadProblems = async () => {
        try {
            setLoading(true);
            const response = await getAllProblems(pageIndex, pageSize, true);
            setProblems(response.data.problems);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError("Failed to load problems");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this problem?")) {
            try {
                await deleteProblem(id);
                await loadProblems(); // Reload the current page after deletion
            } catch (err) {
                setError("Failed to delete problem");
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
        navigate(`/manager/problems?pageIndex=1&pageSize=${newSize}`);
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Problem Management</h1>
            <div className="flex justify-between items-center mb-4">
                <Link to="/manager/problems/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add New Problem
                    </Button>
                </Link>
                <div className="flex items-center">
                    <ItemsPerPageSelector itemsPerPage={pageSize} onItemsPerPageChange={handleItemsPerPageChange} />
                </div>
            </div>
            <Table className="border border-gray-300">
                <TableHeader>
                    <TableRow className="border-b border-gray-300 bg-black">
                        <TableHead className="border border-gray-300 text-white font-bold">Code</TableHead>
                        <TableHead className="border border-gray-300 text-white font-bold">Title</TableHead>
                        <TableHead className="border border-gray-300 text-white font-bold">Difficulty</TableHead>
                        <TableHead className="border border-gray-300 text-white font-bold">Has Solution</TableHead>
                        <TableHead className="border border-gray-300 text-white font-bold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {problems.map((problem) => (
                        <TableRow key={problem.id} className="border-b border-gray-300 hover:bg-gray-100 transition duration-200">
                            <TableCell className="border border-gray-300">{problem.code}</TableCell>
                            <TableCell className="border border-gray-300">{problem.title}</TableCell>
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
                            <TableCell className="border border-gray-300">{problem.hasSolution}</TableCell>
                            <TableCell>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                to={`/manager/problems/update/${problem.code}`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mr-2"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit Problem</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mr-2"
                                                onClick={() =>
                                                    handleDelete(problem.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Delete Problem</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                to={`/problem/${problem.code}`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>View Problem Details</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
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

export default ProblemManagement;
