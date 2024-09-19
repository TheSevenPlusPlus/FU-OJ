﻿import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProblemByCode } from '../api/problem';
import { Problem } from '../models/ProblemModel';

const ProblemDetail: React.FC = () => {
    const { problemCode } = useParams<{ problemCode: string }>();
    const [problem, setProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await getProblemByCode(problemCode!); // Gọi API theo problemCode
                setProblem(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch problem details');
                setLoading(false);
            }
        };

        fetchProblem();
    }, [problemCode]);

    if (loading) return <p className="text-center text-lg">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-6">
            {problem && (
                <>
                    <h1 className="text-2xl font-bold">{problem.title}</h1>
                    <p className="mt-4">{problem.description}</p>
                    <div className="mt-6">
                        <p><strong>Code:</strong> {problem.code}</p>
                        <p><strong>Time Limit:</strong> {problem.time_limit} ms</p>
                        <p><strong>Memory Limit:</strong> {problem.memory_limit} MB</p>
                        <p><strong>Created At:</strong> {new Date(problem.create_at).toLocaleDateString()}</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProblemDetail;
