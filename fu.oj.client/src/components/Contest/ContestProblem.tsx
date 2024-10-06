import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getContestByCode, registerContest, isRegisteredContest, getContestProblems } from "../../api/contest";  // Import the isRegisteredContest API
import { ContestProblem as ContestProblemModel } from "../../models/ProblemModel";
import { Badge } from "@/components/ui/badge";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Pagination from '../Pagination/Pagination';
import ItemsPerPageSelector from '../Pagination/ItemsPerPageSelector';
import { ContestNavbar } from "./ContestNavbar";
import { ContestView } from "../../models/ContestModel";

export default function ContestProblem() {
    const navigate = useNavigate();
    const [contest, setContest] = useState<ContestView | null>(null);
    const { contestCode } = useParams<{ contestCode: string }>(); // Get the contest code from URL parameters
    const [problems, setProblems] = useState<ContestProblemModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);

    useEffect(() => {
        const fetchContestProblems = async () => {
            setLoading(true);
            try {
                const response = await getContestProblems(contestCode); // Fetch problems for the specific contest
                var problems = response.data;
                setProblems(problems);

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
    }, [contestCode]);

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

    const getStatusIcon = (passTestCount: number, totalTests: number) => {
        if (passTestCount == null || totalTests == null || passTestCount === 0 || totalTests === 0) return null;

        if (passTestCount === totalTests)
            return <i className="fa fa-check-circle text-green-500"></i>;

        return <i className="fas fa-frown text-yellow-500"></i>;
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case "easy":
                return "bg-green-500";
            case "hard":
                return "bg-red-500";
            case "medium":
                return "bg-yellow-500";
            default:
                return "bg-gray-500";
        }
    };

    const getSolutionIcon = (hasSolution: string) => {
        return hasSolution ? <i className="fas fa-check-circle text-green-500"></i> : null;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="spinner"></div>
                <p className="text-center text-lg mt-2">Loading problems...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <>
            {isRegistered && <ContestNavbar />}

            {/* Contest title section */}
            <div className="bg-white border-b border-gray-200 py-4 sticky top-10 z-10">
                <h1 className="text-3xl font-extrabold text-center text-gray-800">{contest.name}</h1>
            </div>

        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Contest Problems</h1>
            </div>

            <Table className="border border-gray-300">
                <TableHeader>
                    <TableRow className="border-b border-gray-300 bg-black">
                        <TableHead className="w-[50px] border border-gray-300 text-white font-bold">Status</TableHead>
                        <TableHead className="w-[80px] border border-gray-300 text-white font-bold">Difficulty</TableHead>
                        <TableHead className="w-[100px] border border-gray-300 text-white font-bold">Code</TableHead>
                        <TableHead className="border border-gray-300 text-white font-bold">Title</TableHead>
                        <TableHead className="w-[120px] border border-gray-300 text-white font-bold">Time Limit</TableHead>
                        <TableHead className="w-[120px] border border-gray-300 text-white font-bold">Memory (MB)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {problems.map((problem) => (
                        <TableRow
                            key={problem.problemCode}
                            className="border-b border-gray-300 hover:bg-gray-100 transition duration-200"
                        >
                            <TableCell className="flex items-center justify-center">
                                {getStatusIcon(problem.passedTestCount, problem.totalTests)}
                            </TableCell>

                            <TableCell className="border border-gray-300">
                                <Badge
                                    className={`font-medium text-white ${getDifficultyColor(problem.difficulty)}`}
                                    variant={
                                        problem.difficulty === "Easy"
                                            ? "default"
                                            : problem.difficulty === "Medium"
                                                ? "secondary"
                                                : "destructive"
                                    }
                                >
                                    {problem.difficulty || "Unknown"}
                                </Badge>
                            </TableCell>

                            <TableCell className="font-medium border border-gray-300">{problem.problemCode}</TableCell>
                            <TableCell className="border border-gray-300">
                                <Link to={`/problem/${problem.problemCode}?contestCode=${contestCode}`} className="text-blue-600 hover:underline">
                                    {problem.title}
                                </Link>
                            </TableCell>
                            <TableCell className="font-medium border border-gray-300">
                                {problem.timeLimit === 0 ? 1 : problem.timeLimit}s
                            </TableCell>
                            <TableCell className="font-medium border border-gray-300">{Math.floor(problem.memoryLimit / 1024)} MB</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        </>
    );
}
