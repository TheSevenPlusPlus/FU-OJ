import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAllProblems } from '../api/problem';
import { Problem } from '../models/ProblemModel';

const ProblemList: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await getAllProblems();
                setProblems(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch problems');
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="spinner"></div>
                <p className="text-center text-lg mt-2">Loading...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Set to true if you want 12-hour format
        });
    };

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
                        {/*<TableHead>Create By</TableHead>*/}

                        {/*<TableHead>Difficulty</TableHead>*/}
                        {/*<TableHead className="text-right">Solved Count</TableHead>*/}
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
                            <TableCell className="font-medium">{problem.timeLimit == 0 ? 1 : problem.timeLimit}s</TableCell>
                            <TableCell className="font-medium">{formatDate(problem.createdAt)}</TableCell>
                            {/*<TableCell className="font-medium">{}</TableCell>*/}

                            {/*<TableCell>*/}
                            {/*    <Badge variant={problem.difficulty === 'Easy' ? 'default' : problem.difficulty === 'Medium' ? 'secondary' : 'destructive'}>*/}
                            {/*        {problem.difficulty}*/}
                            {/*    </Badge>*/}
                            {/*</TableCell>*/}
                            {/*<TableCell className="text-right">{problem.solvedCount.toLocaleString()}</TableCell>*/}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ProblemList;
