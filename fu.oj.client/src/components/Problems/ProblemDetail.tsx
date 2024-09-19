import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import { getProblemByCode } from '../../api/problem';
import { Problem } from '../../models/ProblemModel';

const ProblemDetail: React.FC = () => {
    const { problemCode } = useParams<{ problemCode: string }>();
    const [problem, setProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Dùng để điều hướng đến trang chấm bài

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await getProblemByCode(problemCode!); // Gọi API lấy thông tin bài tập
                setProblem(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch problem details');
                setLoading(false);
            }
        };

        fetchProblem();
    }, [problemCode]);

    const handleGradeSubmission = () => {
        navigate(`/problems/${problemCode}/submit`); // Điều hướng đến trang chấm bài
    };

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
                    {/* Nút chấm bài */}
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleGradeSubmission}
                    >
                        Chấm bài
                    </button>
                </>
            )}
        </div>
    );
};

export default ProblemDetail;
