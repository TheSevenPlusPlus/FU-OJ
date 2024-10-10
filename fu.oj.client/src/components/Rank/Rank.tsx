"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { getRank } from "../../api/general";
import { Helmet } from "react-helmet-async";
import Pagination from "../Pagination/Pagination";

type Participant = {
    rank: number;
    userName: string;
    acProblems: number;
};

type RankResponse = {
    totalItems: number;
    items: Participant[];
};

export default function Rank() {
    const { page = "1" } = useParams<{ page?: string }>();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(parseInt(page, 10));
    const [rankData, setRankData] = useState<RankResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pageSize = 20;

    useEffect(() => {
        const fetchRankData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getRank(currentPage, pageSize);
                setRankData(data);
            } catch (err) {
                setError("Failed to fetch rank data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRankData();
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(parseInt(page, 10));
    }, [page]);

    const totalPages = rankData ? Math.ceil(rankData.totalItems / pageSize) : 0;

    const getRankIcon = (rank: number): React.ReactNode => {
        if (rank === 1) return <Trophy className="w-4 h-4 text-yellow-500" />;
        if (rank === 2) return <Medal className="w-4 h-4 text-gray-400" />;
        if (rank === 3) return <Award className="w-4 h-4 text-amber-600" />;
        return null;
    };

    const getRowStyle = (rank: number): string => {
        if (rank <= 3) return "font-semibold";
        return "";
    };

    const handlePageChange = (newPageIndex: number) => {
        if (newPageIndex > 0 && newPageIndex <= totalPages) {
            setCurrentPage(newPageIndex);
            navigate(`/rank/${newPageIndex}`);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-8">{error}</div>;
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <Helmet>
                <title>Rank of Users</title>
                <meta name="description" content="Scoreboard of AC problems." />
            </Helmet>

            <Card className="shadow-md">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-black text-white">
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                                        AC Problems
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rankData?.items.map((participant) => (
                                    <tr
                                        key={participant.userName}
                                        className={`${getRowStyle(participant.rank)} hover:bg-gray-50`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                {getRankIcon(participant.rank)}
                                                <span className="text-sm text-gray-900">{participant.rank}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link to={`/profile/${participant.userName}`} className="text-sm text-blue-600 hover:underline">
                                                {participant.userName}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Badge variant="secondary" className="text-sm font-medium">
                                                {participant.acProblems}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}