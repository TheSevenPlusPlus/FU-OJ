import React, { useState, useEffect } from 'react';
import { getAllProblems } from '../../api/problem';
import { Problem } from '../../models/ProblemModel';
import { Link } from 'react-router-dom'; // Import Link để điều hướng

const Problems: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await getAllProblems();
                setProblems(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch problems');
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    if (loading) return <p className="text-center text-lg">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Problem Title</th>
                        <th scope="col" className="px-6 py-3">Code</th>
                        <th scope="col" className="px-6 py-3">Time Limit</th>
                        <th scope="col" className="px-6 py-3">Memory Limit</th>
                        <th scope="col" className="px-6 py-3">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {problems.map((problem) => (
                        <tr key={problem.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <Link to={`/problems/${problem.code}`}>{problem.title}</Link>
                            </th>
                            <td className="px-6 py-4">{problem.code}</td>
                            <td className="px-6 py-4">{problem.time_limit} ms</td>
                            <td className="px-6 py-4">{problem.memory_limit} MB</td>
                            <td className="px-6 py-4">{new Date(problem.create_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Problems;
