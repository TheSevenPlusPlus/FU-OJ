import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Giả sử bạn có button component riêng
import { getAllSubmissions } from '../api/submission';
import { Submission } from '../models/SubmissionModel';

const SubmissionList: React.FC = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await getAllSubmissions();
                console.log("respond: ", response);
                setSubmissions(response.data);
                console.log("submissions: ", submissions);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch submissions.');
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

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
                        <TableHead className="text-center">Action</TableHead> {/* Điều chỉnh căn giữa */}
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
                                <Link to={`/problem/${submission.problemId}`} className="text-blue-600 hover:underline">
                                    {submission.problemName}
                                </Link>
                            </TableCell>
                            <TableCell>
                                {/*<Badge*/}
                                {/*    variant={*/}
                                {/*        submission.status === 'Accepted' ? 'accepted' :*/}
                                {/*            submission.status === 'Wrong Answer' ? 'wrongAnswer' :*/}
                                {/*                submission.status === 'Time Limit Exceeded' || submission.status === 'Runtime Error (NZEC)' ? 'gray' :*/}
                                {/*                    submission.status === 'Memory Limit Exceeded' ? 'memoryLimitExceeded' : 'default'*/}
                                {/*    }*/}
                                {/*>*/}
                                {/*    {submission.status}*/}
                                {/*</Badge>*/}
                            </TableCell>
                            <TableCell>{submission.languageName}</TableCell>
                            <TableCell className="text-right">{formatDate(submission.submittedAt)}</TableCell>
                            <TableCell className="text-center">
                                <Link to={`/submissions/${submission.id}`}>
                                    <Button
                                        className="bg-black text-white hover:bg-gray-800 py-2 px-4 rounded-md" // Style nút với màu đen và hover xám
                                    >
                                        View Detail
                                    </Button>
                                </Link>
                            </TableCell> {/* Căn giữa nút */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default SubmissionList;
