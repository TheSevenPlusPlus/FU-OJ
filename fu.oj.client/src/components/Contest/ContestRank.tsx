import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRank, getContestByCode, isRegisteredContest } from "../../api/contest";
import { ContestParticipantView, ContestView } from "../../models/ContestModel";
import { ContestNavbar } from "./ContestNavbar";
import { Helmet } from "react-helmet-async";
import Loading from "../Loading"
export function ContestRank() {
    const { contestCode } = useParams<{ contestCode: string }>();
    const [rankings, setRankings] = useState<ContestParticipantView[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [problems, setProblems] = useState<string[]>([]);
    const [contest, setContest] = useState<ContestView | null>(null);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);
    const [acCounts, setAcCounts] = useState<{ [key: string]: { ac: number; total: number } }>({});

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                setLoading(true);
                const response = await getRank(contestCode);
                const data = response.data;

                // Tính toán số người AC cho từng problem
                const problemAcCounts: { [key: string]: { ac: number; total: number } } = {};

                data.forEach((participant: ContestParticipantView) => {
                    participant.problems?.forEach((problem) => {
                        if (!problemAcCounts[problem.problemCode]) {
                            problemAcCounts[problem.problemCode] = { ac: 0, total: 0 };
                        }
                        problemAcCounts[problem.problemCode].total++;
                        if (problem.passedTestCount === problem.totalTests) {
                            problemAcCounts[problem.problemCode].ac++;
                        }
                    });
                });

                setRankings(data);
                setProblems(Object.keys(problemAcCounts));
                setAcCounts(problemAcCounts);

                const _response = await getContestByCode(contestCode);
                setContest(_response.data);

                const registeredResponse = await isRegisteredContest(contestCode);
                setIsRegistered(registeredResponse.data);
            } catch (error) {
                console.error("Failed to fetch rankings", error);
                setError("Failed to fetch rankings. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, [contestCode]);

    if (loading) {
        return < Loading />;
    }
    if (error) return <div className="text-center py-10 text-xl text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            {isRegistered && <ContestNavbar />}
            <Helmet>
                <title> Rank of contest: {contest.name} </title>
                <meta name="description" content="" />
            </Helmet>

            <div className="bg-white border-b border-gray-200 py-4 sticky top-10 z-10 shadow-md">
                <h1 className="text-3xl font-extrabold text-center text-gray-800">{contest?.name}</h1>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-2xl font-bold text-gray-900">Contest Rankings</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600">
                                        Username
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r border-gray-600">
                                        Score
                                    </th>
                                    {problems.map((problem, index) => (
                                        <th key={problem} scope="col" className={`px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ${index !== problems.length - 1 ? 'border-r border-gray-600' : ''}`}>
                                            <Link to={`/problem/${problem}?contestCode=${contestCode}`} className="text-white hover:underline">
                                                {problem}
                                            </Link>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rankings.map((ranking, index) => (
                                    <tr key={ranking.userId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                                            <Link
                                                to={`/Profile/${ranking.userName}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {ranking.userName || "Anonymous"}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                                            {ranking.score}
                                        </td>
                                        {problems.map((problem, problemIndex) => {
                                            const result = ranking.problems?.find((r) => r.problemCode === problem);
                                            return (
                                                <td key={problem} className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-green-500 ${problemIndex !== problems.length - 1 ? 'border-r border-gray-200' : ''}`}>
                                                    <Link to={`/submissions/all?contestCode=${contestCode}&problemCode=${result?.problemCode}`} className="text-green-500 hover:underline">
                                                        {result ? `${result.passedTestCount}/${result.totalTests}` : "-"}
                                                    </Link>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                {/* Hàng cuối cùng chứa số người AC / tổng số người tham gia */}
                                <tr className="bg-black text-white">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold border-r border-gray-600">AC/Total</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold border-r border-gray-600">-</td>
                                    {problems.map((problem, index) => (
                                        <td key={problem} className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${index !== problems.length - 1 ? 'border-r border-gray-600' : ''}`}>
                                            {acCounts[problem]?.ac}/{acCounts[problem]?.total}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
