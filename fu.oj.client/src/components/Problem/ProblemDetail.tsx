import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getProblemByCode } from "../../api/problem"; // Ensure this function is correctly imported
import { Problem } from "../../models/ProblemModel";
import TextWithNewLines from "../TextWithNewLines/TextWithNewLines";
import { getContestByCode, registerContest, isRegisteredContest, getContestProblems } from "../../api/contest";  // Import the isRegisteredContest API
import { ContestView } from "../../models/ContestModel";
import { ContestNavbar } from "../Contest/ContestNavbar";

export default function ProblemDetail() {
    const { problemCode } = useParams<{ problemCode: string }>();
    const [problem, setProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [contestCode, setContestCode] = useState<string | null>(null);
    const [contest, setContest] = useState<ContestView | null>(null);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);
    const [searchParams] = useSearchParams();


    useEffect(() => {
        const fetchContestProblems = async () => {
            setLoading(true);
            try {
                const contestCode = searchParams.get("contestCode");
                setContestCode(contestCode);

                const _response = await getContestByCode(contestCode);
                setContest(_response.data);

                const registeredResponse = await isRegisteredContest(contestCode);
                setIsRegistered(registeredResponse.data);  // Assuming API returns { isRegistered: boolean }
            } catch (err) {
                setError("Failed to fetch problems.");
            } finally {
                setLoading(false);
            }
        };

        fetchContestProblems();
    }, [contestCode, searchParams]);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await getProblemByCode(problemCode);
                setProblem(response.data);
            } catch (err) {
                setError("Failed to fetch problem details");
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

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Easy":
                return "text-green-500";
            case "Medium":
                return "text-yellow-500";
            case "Hard":
                return "text-red-500";
            default:
                return "text-gray-500";
        }
    };

    return (
        <>
        {isRegistered && <ContestNavbar />}

        {/* Contest title section */}
        <div className="bg-white border-b border-gray-200 py-4 sticky top-10 z-10">
            <h1 className="text-3xl font-extrabold text-center text-gray-800">{contest.name}</h1>
        </div>
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">{problem.title}</CardTitle>
                    <CardDescription className={getDifficultyColor(problem.difficulty)}>
                        <Badge
                            variant={
                                problem.difficulty === "Easy"
                                    ? "accepted"
                                    : problem.difficulty === "Medium"
                                        ? "timeLimitExceeded"
                                        : "destructive"
                            }
                        >
                            {problem.difficulty || "Unknown"}
                        </Badge>
                    </CardDescription>

                    <Progress
                        value={
                            ((problem.passedTestCount ?? 0) / (problem.totalTests ?? 1)) * 100
                        }
                    />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Description */}
                        <div>
                            <TextWithNewLines text={problem.description} />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-2">Input</h2>
                            <hr className="my-4" />
                            <TextWithNewLines text={problem.input} />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-2">Output</h2>
                            <hr className="my-4" />
                            <TextWithNewLines text={problem.output} />
                        </div>

                        {/* Example Input/Output */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Example</h2>
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border border-b border-gray-300 bg-black text-white font-bold">Input</th>
                                        <th className="px-4 py-2 border border-b border-gray-300 bg-black text-white font-bold">Output</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2 border">
                                            {problem.exampleInput}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {problem.exampleOutput}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Constraints */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Constraints</h2>
                            <hr className="my-4" />
                            <TextWithNewLines text={problem.constraints} />
                        </div>

                        {/* Time and Memory Limits */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Limits</h2>
                            <hr className="my-4" />
                            <ul className="list-disc list-inside">
                                <li>Time Limit: {problem.timeLimit} seconds</li>
                                <li>Memory Limit: {Math.floor(problem.memoryLimit / 1024)} MB</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    {/* Submit Solution Button */}
                    <Link to={`/problem/${problemCode}/submit`}>
                        <Button>Submit Solution</Button>
                    </Link>

                    <div className="space-x-2">
                        {/* View All Submissions Button */}
                        <Link to={`/submissions/all?problemCode=${problemCode}`}>
                            <Button variant="secondary">View all submissions</Button>
                        </Link>

                        {/* View My Submissions Button */}
                        <Link to={`/submissions/all?isMine=${true}&problemCode=${problemCode}`}>
                            <Button variant="secondary">View my submissions</Button>
                        </Link>
                    </div>
                </CardFooter>
            </Card>
            </div>
        </>
    );
}
