import React, { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useSearchParams,
    useParams,
} from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getAllSubmissions } from "../api/submission";
import { Submission } from "../models/SubmissionModel";

export default function SubmissionList() {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchParams] = useSearchParams();
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = userData?.userName;

    const username = searchParams.get("username") || null;
    const problemCode = searchParams.get("problemCode") || null;

    useEffect(() => {
        const index = searchParams.get("pageIndex");
        const size = searchParams.get("pageSize");
        if (index) setPageIndex(Number(index));
        if (size) setPageSize(Number(size));
    }, [searchParams]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                console.log("pageIndex: ", pageIndex);
                console.log("pageSize: ", pageSize);
                console.log("username: ", username);
                console.log("problemCode: ", problemCode);
                const response = await getAllSubmissions(
                    pageIndex,
                    pageSize,
                    username,
                    problemCode,
                );
                const { submissions, totalPages } = response.data;
                setSubmissions(submissions);
                setTotalPages(totalPages);

                setLoading(false);
            } catch (err) {
                setError("Failed to fetch submissions.");
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [pageIndex, pageSize, username, problemCode]);

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
            navigate(
                `/submissions/all?pageIndex=${newPageIndex}&pageSize=${pageSize}`,
            );
        }
    };

    const renderPagination = () => {
        const paginationItems = [];
        const maxPagesToShow = 5;
        const startPage = Math.max(
            1,
            pageIndex - Math.floor(maxPagesToShow / 2),
        );
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (startPage > 1) {
            paginationItems.push(
                <Button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    variant="outline"
                    size="sm"
                >
                    1
                </Button>,
            );
            if (startPage > 2) {
                paginationItems.push(
                    <Button
                        key="ellipsis-start"
                        variant="outline"
                        size="sm"
                        disabled
                    >
                        ...
                    </Button>,
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationItems.push(
                <Button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    variant={i === pageIndex ? "default" : "outline"}
                    size="sm"
                >
                    {i}
                </Button>,
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationItems.push(
                    <Button
                        key="ellipsis-end"
                        variant="outline"
                        size="sm"
                        disabled
                    >
                        ...
                    </Button>,
                );
            }
            paginationItems.push(
                <Button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    variant="outline"
                    size="sm"
                >
                    {totalPages}
                </Button>,
            );
        }

        return paginationItems;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                <p className="text-center text-lg mt-2">
                    Loading submissions...
                </p>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">All Submissions</h1>
                <Button
                    onClick={() =>
                        navigate(
                            `/submissions/all?username=${userName}&pageIndex=${1}&pageSize=${10}`,
                        )
                    }
                    variant="secondary"
                    size="sm"
                >
                    View my submissions
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Problem</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead className="text-right">
                            Submitted At
                        </TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                            <TableCell>
                                {submission.userName ? (
                                    <Link
                                        to={`/user/${submission.userId}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {submission.userName}
                                    </Link>
                                ) : (
                                    "Anonymous"
                                )}
                            </TableCell>
                            <TableCell>
                                <Link
                                    to={`/problem/${submission.problemName}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {submission.problemName}
                                </Link>
                            </TableCell>
                            <TableCell>{submission.status}</TableCell>
                            <TableCell>{submission.languageName}</TableCell>
                            <TableCell className="text-right">
                                {formatDate(submission.submittedAt)}
                            </TableCell>
                            <TableCell className="text-center">
                                <Button
                                    onClick={() =>
                                        navigate(
                                            `/submissions/${submission.id}`,
                                        )
                                    }
                                    variant="secondary"
                                    size="sm"
                                >
                                    View Detail
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-2">
                <Button
                    onClick={() => handlePageChange(pageIndex - 1)}
                    disabled={pageIndex === 1}
                    variant="outline"
                    size="sm"
                >
                    Previous
                </Button>
                {renderPagination()}
                <Button
                    onClick={() => handlePageChange(pageIndex + 1)}
                    disabled={pageIndex === totalPages}
                    variant="outline"
                    size="sm"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
