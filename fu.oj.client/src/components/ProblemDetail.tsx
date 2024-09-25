import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
                            {problem.difficulty}
                        </Badge>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Description</h2>
                            <p>{problem.description}</p>
                        </div>
                        {/*<div>*/}
                        {/*    <h2 className="text-xl font-semibold mb-2">Examples</h2>*/}
                        {/*    {problem.examples.map((example, index) => (*/}
                        {/*        <div key={index} className="mb-4 p-4 bg-gray-100 rounded-md">*/}
                        {/*            <p><strong>Input:</strong> {example.input}</p>*/}
                        {/*            <p><strong>Output:</strong> {example.output}</p>*/}
                        {/*            {example.explanation && <p><strong>Explanation:</strong> {example.explanation}</p>}*/}
                        {/*        </div>*/}
                        {/*    ))}*/}
                        {/*</div>*/}
                        {/*<div>*/}
                        {/*    <h2 className="text-xl font-semibold mb-2">Constraints</h2>*/}
                        {/*    <ul className="list-disc list-inside">*/}
                        {/*        {problem.constraints.map((constraint, index) => (*/}
                        {/*            <li key={index}>{constraint}</li>*/}
                        {/*        ))}*/}
                        {/*    </ul>*/}
                        {/*</div>*/}
                    </div>
                </CardContent>
                <CardFooter>
                    <Link to={`/problem/${problem.code}/submit`}>
                        <Button>Submit Solution</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ProblemDetail;
