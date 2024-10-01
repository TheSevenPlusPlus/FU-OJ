"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { getRank } from "../../api/general"; // Assuming the api file is in the same directory

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
        if (rank === 1) return <Trophy className="w-6 h-6" />;
        if (rank === 2) return <Medal className="w-6 h-6" />;
        if (rank === 3) return <Award className="w-6 h-6" />;
        return null;
    };

    const getRowStyle = (rank: number): string => {
        if (rank <= 3) return "font-bold";
        if (rank <= 10) return "font-semibold";
        return "";
    };

    const handlePageChange = (newPage: number) => {
        navigate(`/rank/${newPage}`);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="border-2 border-black">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100 border-b-2 border-black">
                                    <th className="px-4 py-2 text-left">
                                        Rank
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Username
                                    </th>
                                    <th className="px-4 py-2 text-right">
                                        AC Problems
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rankData?.items.map((participant) => (
                                    <tr
                                        key={participant.userName}
                                        className={`${getRowStyle(participant.rank)} border-b border-gray-200 hover:bg-gray-50`}
                                    >
                                        <td className="px-4 py-2">
                                            <div className="flex items-center space-x-2">
                                                {getRankIcon(participant.rank)}
                                                <span className="text-lg">
                                                    {participant.rank}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            {participant.userName}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <Badge
                                                variant="outline"
                                                className="text-lg font-semibold border-black"
                                            >
                                                {participant.acProblems}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-100 border-t-2 border-black">
                        <Button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            variant="outline"
                            className="font-semibold border-black"
                        >
                            Previous
                        </Button>
                        <span className="text-lg font-semibold">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            variant="outline"
                            className="font-semibold border-black"
                        >
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
