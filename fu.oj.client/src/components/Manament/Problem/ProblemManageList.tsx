import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllProblems, deleteProblem } from '../../../api/problem';

interface Problem {
    id: string;
    code: string;
    title: string;
    description: string;
    constraints: string;
    exampleInput: string;
    exampleOutput: string;
    timeLimit: number;
    memoryLimit: number;
    difficulty: string;
    hasSolution: string;
}

const ProblemManageList: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadProblems();
    }, [currentPage, itemsPerPage]);

    const loadProblems = async () => {
        try {
            setLoading(true);
            const response = await getAllProblems(currentPage, itemsPerPage);
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
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1); // Reset to first page when changing items per page
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
                    <span className="mr-2">Items per page:</span>
                    <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                        <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder={itemsPerPage.toString()} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Has Solution</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {problems.map((problem) => (
                        <TableRow key={problem.id}>
                            <TableCell>{problem.code}</TableCell>
                            <TableCell>{problem.title}</TableCell>
                            <TableCell>{problem.difficulty}</TableCell>
                            <TableCell>{problem.hasSolution}</TableCell>
                            <TableCell>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link to={`/problems/edit/${problem.id}`}>
                                                <Button variant="outline" size="sm" className="mr-2">
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
                                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleDelete(problem.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Delete Problem</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link to={`/problems/${problem.code}`}>
                                                <Button variant="outline" size="sm">
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
            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                                onClick={() => handlePageChange(index + 1)}
                                isActive={currentPage === index + 1}
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default ProblemManageList;