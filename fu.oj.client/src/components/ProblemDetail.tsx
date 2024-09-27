import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getProblemByCode } from '../api/problem'; // Ensure this function is correctly imported
import { Problem } from '../models/ProblemModel';

const ProblemDetail: React.FC = () => {
    const { problemCode } = useParams<{ problemCode: string }>();
    const [problem, setProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await getProblemByCode(problemCode);
                setProblem(response.data);
            } catch (err) {
                setError('Failed to fetch problem details');
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [problemCode]);

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

    if (!problem) {
        return <div className="container mx-auto py-8">Problem not found</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">{problem.title}</CardTitle>
                    <CardDescription>
                        <Badge
                            variant={
                                problem.difficulty === 'Easy' ? 'default' :
                                    problem.difficulty === 'Medium' ? 'secondary' : 'destructive'
                            }
                        >
                            {problem.difficulty || "Unknown"}
                        </Badge>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Description */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Description</h2>
                            <p>{problem.description}</p>
                        </div>

                        {/* Example Input/Output */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Example</h2>
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border">Input</th>
                                        <th className="px-4 py-2 border">Output</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2 border">{problem.exampleInput}</td>
                                        <td className="px-4 py-2 border">{problem.exampleOutput}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Constraints */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Constraints</h2>
                            <p>{problem.constraints}</p>
                        </div>

                        {/* Time and Memory Limits */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Limits</h2>
                            <ul className="list-disc list-inside">
                                <li>Time Limit: {problem.timeLimit} seconds</li>
                                <li>Memory Limit: {problem.memoryLimit} KB</li>
                            </ul>
                        </div>

                        {/* Progress Bar */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Progress</h2>
                            <p>Tests passed: {problem.acQuantity ?? 0}/{problem.totalTests ?? 0}</p>
                            <Progress value={((problem.acQuantity ?? 0) / (problem.totalTests ?? 1)) * 100} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    {/* Submit Solution Button */}
                    <Link to={`/problem/${problem.code}/submit`}>
                        <Button>Submit Solution</Button>
                    </Link>

                    {/* View Submissions Button */}
                    <Link to={`/problem/${problem.code}/submissions`}>
                        <Button variant="secondary">View Submissions</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ProblemDetail;
