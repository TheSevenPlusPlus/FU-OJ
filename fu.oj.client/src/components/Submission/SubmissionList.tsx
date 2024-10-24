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
import { Search } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Loading from "../Loading"

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
    const [problemCode, setProblemCode] = useState<string | null>(null);
    const [isMine, setIsMine] = useState<string>(null);
    const [contest, setContest] = useState<ContestView | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const index = searchParams.get("pageIndex");
            const size = searchParams.get("pageSize");
            const isMine = searchParams.get("isMine");
            const contestCode = searchParams.get("contestCode");
            const problemCode = searchParams.get("problemCode");

            if (index) setPageIndex(Number(index));
            if (size) setPageSize(Number(size));
            // Chuyển đổi giá trị chuỗi sang boolean
            if (isMine != null) {
                setIsMine(isMine);
                //console.log("isMine: ", _isMine);
            }

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

            if (problemCode != null) setProblemCode(problemCode);

            try {
                setLoading(true);
                const response = await getAllSubmissions(
                    pageIndex,
                    pageSize,
                    isMine,
                    problemCode,
                    contestCode
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

        fetchData();
    }, [searchParams, pageIndex, pageSize, problemCode, isMine]);

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
                if (isMine == null) {
                    navigate(
                        `/submissions/all?pageIndex=${newPageIndex}&pageSize=${pageSize}`,
                    );
                }
                else {
                    navigate(
                        `/submissions/all?pageIndex=${newPageIndex}&pageSize=${pageSize}&isMine=${isMine}`,
                    );
                }
            }
            else {
                if (isMine == null) {
                    navigate(
                        `/submissions/all?contestCode=${contestCode}&pageIndex=${newPageIndex}&pageSize=${pageSize}`,
                    );
                }
                else {
                    navigate(
                        `/submissions/all?contestCode=${contestCode}&pageIndex=${newPageIndex}&pageSize=${pageSize}&isMine=${isMine}`,
                    );
                }
            }
        }
    };

    const handleItemsPerPageChange = (newSize: number) => {
        setPageSize(newSize);
        setPageIndex(1);
        if (contestCode == null) {
            if (isMine == null) {
                navigate(`/submissions/all?pageIndex=1&pageSize=${newSize}`);
            }
            else {
                navigate(`/submissions/all?pageIndex=1&pageSize=${newSize}&isMine=${isMine}`);
            }
        }
        else {
            if (isMine == null) {
                navigate(`/submissions/all?contestCode=${contestCode}&pageIndex=1&pageSize=${newSize}`);
            }
            else {
                navigate(`/submissions/all?contestCode=${contestCode}&pageIndex=1&pageSize=${newSize}&isMine=${isMine}`);
            }
        }
    };

    if (loading) {
        return < Loading />;
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
