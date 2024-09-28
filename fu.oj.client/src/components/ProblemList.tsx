import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getAllProblems } from '../api/problem';
import { Problem } from '../models/ProblemModel';

const ProblemList: React.FC = () => {
    const navigate = useNavigate();
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10); // Define page size
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const index = searchParams.get('pageIndex');
        const size = searchParams.get('pageSize');
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
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch problems.');
                setLoading(false);
            }
        };

        fetchProblems();
    }, [pageIndex, pageSize]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const handlePageChange = (newPageIndex: number) => {
        if (newPageIndex > 0 && newPageIndex <= totalPages) {
            setPageIndex(newPageIndex);
            navigate(`/problems?pageIndex=${newPageIndex}&pageSize=${pageSize}`);
        }
    };

    const renderPagination = () => {
        const paginationItems = [];
        const maxPagesToShow = 5;
        const startPage = Math.max(1, pageIndex - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (startPage > 1) {
            paginationItems.push(
                <Button key={1} onClick={() => handlePageChange(1)} className="bg-gray-700 text-white">
                    1
                </Button>
            );
            if (startPage > 2) {
                paginationItems.push(
                    <Button key="ellipsis-start" className="bg-gray-700 text-white" disabled>
                        ...
                    </Button>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationItems.push(
                <Button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`bg-gray-700 text-white ${i === pageIndex ? 'font-bold bg-blue-500' : ''}`}
                >
                    {i}
                </Button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationItems.push(
                    <Button key="ellipsis-end" className="bg-gray-700 text-white" disabled>
                        ...
                    </Button>
                );
            }
            paginationItems.push(
                <Button key={totalPages} onClick={() => handlePageChange(totalPages)} className="bg-gray-700 text-white">
                    {totalPages}
                </Button>
            );
        }

        return paginationItems;
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
            <h1 className="text-3xl font-bold mb-6">All Problems</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Time Limit</TableHead>
                        <TableHead>Create At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {problems.map((problem) => (
                        <TableRow key={problem.code}>
                            <TableCell className="font-medium">{problem.code}</TableCell>
                            <TableCell>
                                <Link to={`/problem/${problem.code}`} className="text-blue-600 hover:underline">
                                    {problem.title}
                                </Link>
                            </TableCell>
                            <TableCell className="font-medium">{problem.timeLimit === 0 ? 1 : problem.timeLimit}s</TableCell>
                            <TableCell className="font-medium">{formatDate(problem.createdAt)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                <Button
                    className="mr-2 bg-gray-700 text-white font-bold"
                    onClick={() => handlePageChange(pageIndex - 1)}
                    disabled={pageIndex === 1}
                >
                    Previous
                </Button>
                {renderPagination()}
                <Button
                    className="ml-2 bg-gray-700 text-white font-bold"
                    onClick={() => handlePageChange(pageIndex + 1)}
                    disabled={pageIndex === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default ProblemList;
