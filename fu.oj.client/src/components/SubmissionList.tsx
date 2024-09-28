import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button"; // Giả sử bạn có button component riêng
import { getAllSubmissions } from '../api/submission';
import { Submission } from '../models/SubmissionModel';

const SubmissionList: React.FC = () => {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const index = searchParams.get('pageIndex');
        const size = searchParams.get('pageSize');
        if (index) setPageIndex(Number(index));
        if (size) setPageSize(Number(size));
    }, [searchParams]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                const response = await getAllSubmissions(pageIndex, pageSize);
                const { submissions, totalPages } = response.data;
                setSubmissions(submissions);
                setTotalPages(totalPages);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch submissions.');
                setLoading(false);
            }
        };

        fetchSubmissions();
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
            navigate(`/submissions?pageIndex=${newPageIndex}&pageSize=${pageSize}`);
        }
    };

    const renderPagination = () => {
        const paginationItems = [];
        const maxPagesToShow = 5; // Adjust this for how many page numbers to show
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
                    className={`bg-gray-700 text-white ${i === pageIndex ? 'font-bold bg-blue-500' : ''}`} // Highlight current page
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
                <p className="text-center text-lg mt-2">Loading submissions...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">All Submissions</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Problem</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead className="text-right">Submitted At</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                            <TableCell>
                                {submission.userName ? (
                                    <Link to={`/user/${submission.userId}`} className="text-blue-600 hover:underline">
                                        {submission.userName}
                                    </Link>
                                ) : 'Anonymous'}
                            </TableCell>
                            <TableCell>
                                <Link to={`/problem/${submission.problemName}`} className="text-blue-600 hover:underline">
                                    {submission.problemName}
                                </Link>
                            </TableCell>
                            <TableCell>
                                {submission.status}
                            </TableCell>
                            <TableCell>{submission.languageName}</TableCell>
                            <TableCell className="text-right">{formatDate(submission.submittedAt)}</TableCell>
                            <TableCell className="text-center">
                                <Link to={`/submissions/${submission.id}`}>
                                    <Button
                                        className="bg-black text-white hover:bg-gray-800 py-2 px-4 rounded-md"
                                    >
                                        View Detail
                                    </Button>
                                </Link>
                            </TableCell>
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

export default SubmissionList;
