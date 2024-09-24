import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Submission {
    id: number;
    problemId: number;
    problemTitle: string;
    status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
    language: string;
    submittedAt: string;
}

const submissions: Submission[] = [
    { id: 1, problemId: 1, problemTitle: "Two Sum", status: "Accepted", language: "Python", submittedAt: "2023-06-01 14:30:00" },
    { id: 2, problemId: 2, problemTitle: "Add Two Numbers", status: "Wrong Answer", language: "Java", submittedAt: "2023-06-01 15:45:00" },
    { id: 3, problemId: 3, problemTitle: "Longest Substring Without Repeating Characters", status: "Time Limit Exceeded", language: "C++", submittedAt: "2023-06-02 09:15:00" },
    { id: 4, problemId: 4, problemTitle: "Median of Two Sorted Arrays", status: "Runtime Error", language: "JavaScript", submittedAt: "2023-06-02 11:30:00" },
    { id: 5, problemId: 5, problemTitle: "Longest Palindromic Substring", status: "Accepted", language: "Go", submittedAt: "2023-06-03 10:00:00" },
];

const SubmissionList: React.FC = () => {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">All Submissions</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Problem</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead className="text-right">Submitted At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                            <TableCell className="font-medium">{submission.id}</TableCell>
                            <TableCell>
                                <Link to={`/problem/${submission.problemId}`} className="text-blue-600 hover:underline">
                                    {submission.problemTitle}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        submission.status === 'Accepted' ? 'default' :
                                            submission.status === 'Wrong Answer' ? 'destructive' :
                                                submission.status === 'Time Limit Exceeded' ? 'secondary' : 'outline'
                                    }
                                >
                                    {submission.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{submission.language}</TableCell>
                            <TableCell className="text-right">{submission.submittedAt}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default SubmissionList;