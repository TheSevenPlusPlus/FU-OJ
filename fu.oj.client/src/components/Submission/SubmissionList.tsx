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
import { getContestByCode, registerContest, isRegisteredContest, getContestProblems } from "../../api/contest";  // Import the isRegisteredContest API
import { Submission } from "../../models/SubmissionModel";
import { ContestView } from "../../models/ContestModel";
import { ContestNavbar } from "../Contest/ContestNavbar";
import Pagination from '../Pagination/Pagination';
import ItemsPerPageSelector from '../Pagination/ItemsPerPageSelector';
import { Badge } from "@/components/ui/badge"; // Import Badge for status colors
import { Helmet } from "react-helmet-async";

const SubmissionList = () => {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [contestCode, setContestCode] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const [isRegistered, setIsRegistered] = useState<boolean>(false);
    const problemCode = searchParams.get("problemCode") || null;
    const [isMine, setIsMine] = useState<boolean>(false);
    const [contest, setContest] = useState<ContestView | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const index = searchParams.get("pageIndex");
            const size = searchParams.get("pageSize");
            const isMine = searchParams.get("isMine");
            const contestCode = searchParams.get("contestCode");

            if (index) setPageIndex(Number(index));
            if (size) setPageSize(Number(size));
            // Chuyển đổi giá trị chuỗi sang boolean
            if (isMine != null) setIsMine(isMine === "true");

            if (contestCode != null) {
                setContestCode(contestCode);
                try {
                    const _response = await getContestByCode(contestCode);
                    setContest(_response.data);

                    const registeredResponse = await isRegisteredContest(contestCode);
                    setIsRegistered(registeredResponse.data);  // Assuming API returns { isRegistered: boolean }
                } catch (error) {
                    console.error("Error fetching registration status", error);
                }
            }
        };

        fetchData();
    }, [searchParams]);


    useEffect(() => {
        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                const response = await getAllSubmissions(
                    pageIndex,
                    pageSize,
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
            if (contestCode == null) {
                navigate(
                    `/submissions/all?pageIndex=${newPageIndex}&pageSize=${pageSize}&isMine=${isMine}`,
                );
            }
            else {
                navigate(
                    `/submissions/all?contestCode=${contestCode}&pageIndex=${newPageIndex}&pageSize=${pageSize}&isMine=${isMine}`,
                );
            }
        }
    };

    const handleItemsPerPageChange = (newSize: number) => {
        setPageSize(newSize);
        setPageIndex(1);
        if (contestCode == null) {
            navigate(`/submissions/all?pageIndex=1&pageSize=${newSize}&isMine=${isMine}`);
        }
        else {
            navigate(`/submissions/all?contestCode=${contestCode}&pageIndex=1&pageSize=${newSize}&isMine=${isMine}`);
        }
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
        <>
            {isRegistered && <ContestNavbar />}

            {isRegistered &&
                < div className="bg-white border-b border-gray-200 py-4 sticky top-10 z-10">
                    <h1 className="text-3xl font-extrabold text-center text-gray-800">{contest.name}</h1>
                </div >
            }

            <div className="container mx-auto py-8">
                <Helmet>
                    <title> {problemCode ? `Submission List of ${problemCode}` : 'Submission List'} </title>
                </Helmet>


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
                                    {contestCode == null ?
                                        <Link to={`/problem/${submission.problemName}`} className="text-blue-600 hover:underline">
                                            {submission.problemName}
                                        </Link>
                                        :
                                        <Link to={`/problem/${submission.problemName}?contestCode=${contestCode}`} className="text-blue-600 hover:underline">
                                            {submission.problemName}
                                        </Link>
                                    }
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
                                    {contestCode == null ?
                                        <Button onClick={() => navigate(`/submissions/${submission.id}`)} variant="secondary" size="sm">
                                            View Detail
                                        </Button>
                                        :
                                        <Button onClick={() => navigate(`/submissions/${submission.id}?contestCode=${contestCode}`)} variant="secondary" size="sm">
                                            View Detail
                                        </Button>
                                    }
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
        </>
    );
};

export default SubmissionList;
