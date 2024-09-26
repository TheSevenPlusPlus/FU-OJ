"use client"

import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

type Participant = {
    rank: number
    name: string
    userName: string
    acProblems: number
}

const generateParticipants = (count: number): Participant[] => {
    return Array.from({ length: count }, (_, i) => ({
        rank: i + 1,
        name: `Participant ${i + 1}`,
        userName: `user${i + 1}`,
        acProblems: Math.floor(Math.random() * 200)
    })).sort((a, b) => b.acProblems - a.acProblems)
        .map((p, index) => ({ ...p, rank: index + 1 }))
}

const participants = generateParticipants(100)

export default function Rank() {
    const { page } = useParams<{ page: string }>();
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 20
    const totalPages = Math.ceil(participants.length / pageSize)

    useEffect(() => {
        const pageNumber = parseInt(page || '1', 10)
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber)
        } else {
            navigate('/rank/1', { replace: true })
        }
    }, [page, navigate, totalPages])

    const paginatedParticipants = participants.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    const getRankIcon = (rank: number): React.ReactNode => {
        if (rank === 1) return <Trophy className="w-6 h-6" />
        if (rank === 2) return <Medal className="w-6 h-6" />
        if (rank === 3) return <Award className="w-6 h-6" />
        return null
    }

    const getRowStyle = (rank: number): string => {
        if (rank <= 3) return "font-bold"
        if (rank <= 10) return "font-semibold"
        return ""
    }

    const handlePageChange = (newPage: number) => {
        navigate(`/rank/${newPage}`)
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="border-2 border-black">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100 border-b-2 border-black">
                                    <th className="px-4 py-2 text-left">Rank</th>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Username</th>
                                    <th className="px-4 py-2 text-right">AC Problems</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedParticipants.map((participant) => (
                                    <tr key={participant.userName} className={`${getRowStyle(participant.rank)} border-b border-gray-200 hover:bg-gray-50`}>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center space-x-2">
                                                {getRankIcon(participant.rank)}
                                                <span className="text-lg">{participant.rank}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">{participant.name}</td>
                                        <td className="px-4 py-2">{participant.userName}</td>
                                        <td className="px-4 py-2 text-right">
                                            <Badge variant="outline" className="text-lg font-semibold border-black">
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
    )
}