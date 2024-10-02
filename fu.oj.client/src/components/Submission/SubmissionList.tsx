import React, { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useSearchParams,
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
import { getAllSubmissions } from "../../api/submission";
import { Submission } from "../../models/SubmissionModel";
import Pagination from '../Pagination/Pagination';
import ItemsPerPageSelector from '../Pagination/ItemsPerPageSelector';
import { Badge } from "@/components/ui/badge"; // Import Badge for status colors

const SubmissionList = () => {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchParams] = useSearchParams();
    const problemCode = searchParams.get("problemCode") || null;
    const [isMine, setIsMine] = useState<boolean>(false);

    useEffect(() => {
        const index = searchParams.get("pageIndex");
        const size = searchParams.get("pageSize");
        const isMine = searchParams.get("isMine");

        if (index) setPageIndex(Number(index));
        if (size) setPageSize(Number(size));
        // Chuyển đổi giá trị chuỗi sang boolean
        if (isMine != null) setIsMine(isMine === "true");
    }, [searchParams]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                const response = await getAllSubmissions(
                    pageIndex,
                    pageSize,
                    problemCode,
                    isMine
                );
                const { submissions, totalPages } = response.data;
                setSubmissions(submissions);
                setTotalPages(totalPages);
            } catch (err) {
                setError("Failed to fetch submissions.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [pageIndex, pageSize, problemCode, isMine]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "accepted":
                return "bg-green-500";
            case "wrong answer":
                return "bg-red-500";
            case "time limit exceeded":
                return "bg-yellow-500";
            default:
                return "bg-gray-500";
        }
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

    const handlePageChange = (newPageIndex: number) => {
        if (newPageIndex > 0 && newPageIndex <= totalPages) {
            setPageIndex(newPageIndex);
            navigate(
                `/submissions/all?pageIndex=${newPageIndex}&pageSize=${pageSize}&isMine=${isMine}`,
            );
        }
    };

    const handleItemsPerPageChange = (newSize: number) => {
        setPageSize(newSize);
        setPageIndex(1);
        navigate(`/submissions/all?pageIndex=1&pageSize=${newSize}&isMine=${isMine}`);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                <p className="text-center text-lg mt-2">Loading submissions...</p>
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
                <ItemsPerPageSelector itemsPerPage={pageSize} onItemsPerPageChange={handleItemsPerPageChange} />
            </div>
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
                                    <Link to={`/Profile/${submission.userName}`} className="text-blue-600 hover:underline">
                                        {submission.userName}
                                    </Link>
                                ) : (
                                    "Anonymous"
                                )}
                            </TableCell>
                            <TableCell>
                                <Link to={`/problem/${submission.problemName}`} className="text-blue-600 hover:underline">
                                    {submission.problemName}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Badge className={`${getStatusColor(submission.status)} text-white`}>
                                    {submission.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{submission.languageName}</TableCell>
                            <TableCell className="text-right">
                                {formatDate(submission.submittedAt)}
                            </TableCell>
                            <TableCell className="text-center">
                                <Button onClick={() => navigate(`/submissions/${submission.id}`)} variant="secondary" size="sm">
                                    View Detail
                                </Button>
                            </TableCell>
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

export default SubmissionList;
