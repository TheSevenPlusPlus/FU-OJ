import React, { useState, useEffect } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Code, Clock, User } from "lucide-react";
import { getSubmissionById } from "../../api/submission";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism"; // Sử dụng theme "vs" của Visual Studio Code
import { Result } from "../../models/ResultModel";
import { Submission } from "../../models/SubmissionModel";
import { getContestByCode, registerContest, isRegisteredContest, getContestProblems } from "../../api/contest";  // Import the isRegisteredContest API
import { ContestView } from "../../models/ContestModel";
import { ContestNavbar } from "../Contest/ContestNavbar";
import { Helmet } from "react-helmet-async";
import Loading from "../Loading"

const SubmissionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const [contestCode, setContestCode] = useState<string | null>(null);
    const [contest, setContest] = useState<ContestView | null>(null);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserName = currentUser.userName;

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                setLoading(true);
                const response = await getSubmissionById(id);
                const contestCode = searchParams.get("contestCode");
                if (contestCode != null) {
                    const _response = await getContestByCode(contestCode);
                    setContest(_response.data);

                    const registeredResponse = await isRegisteredContest(contestCode);
                    setIsRegistered(registeredResponse.data);  // Assuming API returns { isRegistered: boolean }
                }

                //console.log("submission: ", response.data);
                setSubmission(response.data);
            } catch (err) {
                setError("Failed to fetch problem details");
            } finally {
                setLoading(false);
            }
        };

        fetchSubmission();
    }, [id, searchParams]);

    if (loading) {
        return < Loading />;
    }

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

    const showResubmitButton =
        submission &&
        submission.status.toLowerCase() !== "accepted" &&
        submission.userName === currentUserName;

    const handleResubmit = () => {
        if (submission) {
            navigate(`/problem/${submission.problemName}/submit`);
        }
    };

    return (
        <>
            {isRegistered && <ContestNavbar />}

            {isRegistered &&
                < div className="bg-white border-b border-gray-200 py-4 sticky top-10 z-10">
                    <h1 className="text-3xl font-extrabold text-center text-gray-800">{contest.name}</h1>
                </div >
            }
            <div className="container mx-auto py-8 bg-gray-100 min-h-screen">
                <Helmet>
                    <title>Submission of {submission?.problemName == null ? "problem" : submission?.problemName}</title>
                    <meta name="description" content="Submission" />
                </Helmet>

                <Card className="w-full max-w-4xl mx-auto bg-white text-black">
                    <CardHeader className="border-b border-gray-200">
                        {submission ? (
                            <CardTitle className="text-2xl font-bold">
                                {contestCode == null ?
                                    <Link
                                        to={`/problem/${submission.problemName}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {submission.problemName}
                                    </Link>
                                    :
                                    <Link
                                        to={`/problem/${submission.problemName}?contestCode=${contestCode}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {submission.problemName}
                                    </Link>
                                }
                            </CardTitle>
                        ) : (
                            <CardTitle className="text-2xl font-bold">
                                Loading...
                            </CardTitle>
                        )}
                    </CardHeader>
                    <CardContent className="pt-6">
                        {submission ? (
                            <>
                                {/* Basic Submission Info */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center">
                                        <Code className="mr-2 text-gray-600" />
                                        <span className="font-semibold">
                                            Language:
                                        </span>
                                        <span className="ml-2">
                                            {submission.languageName}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="mr-2 text-gray-600" />
                                        <span className="font-semibold">
                                            Submitted:
                                        </span>
                                        <span className="ml-2">
                                            {formatDate(submission.submittedAt)}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <User className="mr-2 text-gray-600" />
                                        <span className="font-semibold">User:</span>
                                        <span className="ml-2">
                                            <Link
                                                to={`/Profile/${submission.userName}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {submission.userName || "Anonymous"}
                                            </Link>
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Badge
                                            className={`${getStatusColor(submission.status)} text-white`}
                                        >
                                            {submission.status}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Source Code Display with Syntax Highlighting */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">
                                        Submitted Code:
                                    </h3>
                                    <SyntaxHighlighter
                                        language={submission.languageName.toLowerCase()}
                                        style={vs}
                                    >
                                        {submission.sourceCode ?? "Bạn phải vượt qua bài này để xem được code của mọi người"}
                                    </SyntaxHighlighter>
                                </div>

                                {/* Test Results Table */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        Test Results:
                                    </h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">
                                                    Test Case
                                                </TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Time</TableHead>
                                                <TableHead>Memory</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {submission.results.map(
                                                (result, index) => (
                                                    <TableRow>
                                                        <TableCell className="font-medium">
                                                            Test {index + 1}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                className={`${getStatusColor(result.statusDescription)} text-white`}
                                                            >
                                                                {
                                                                    result.statusDescription
                                                                }
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {result.time == null
                                                                ? "0"
                                                                : result.time}
                                                        </TableCell>
                                                        <TableCell>
                                                            {result.memory} KB
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        ) : (
                            <p>Loading submission details...</p>
                        )}
                    </CardContent>
                    <CardContent className="pt-6">
                        {submission ? (
                            <>
                                {/* Nội dung chi tiết bài nộp */}
                                {/* Nút Resubmit */}
                                {showResubmitButton && (
                                    <button
                                        onClick={handleResubmit}
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
                                    >
                                        Resubmit
                                    </button>
                                )}
                            </>
                        ) : (
                            <p>Loading submission details...</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default SubmissionDetail;
