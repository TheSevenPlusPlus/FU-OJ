import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { submitCode } from '../api/submission';
import Textarea_manual from './ui/textarea-manual';
import { useParams, useNavigate } from 'react-router-dom';
import { Problem } from '../models/ProblemModel';
import { getProblemByCode } from '../api/problem';

// Define model for language
interface Language {
    language_id: number;
    language_name: string;
}

// Create a list of languages
const languages: Language[] = [
    { language_id: 49, language_name: 'C (GCC 8.3.0)' },
    { language_id: 53, language_name: 'C++ (GCC 8.3.0)' },
    { language_id: 71, language_name: 'Python (3.8.1)' },
    { language_id: 62, language_name: 'Java (OpenJDK 13.0.1)' },
    { language_id: 74, language_name: 'TypeScript (3.7.4)' },
];

const CodeSubmission: React.FC = () => {
    const { problemCode } = useParams<{ problemCode: string }>();
    const navigate = useNavigate(); // Hook for navigation
    const [code, setCode] = useState<string>('');
    const [problem, setProblem] = useState<Problem | null>(null);
    const [language, setLanguage] = useState<Language | null>(languages[0]);
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await getProblemByCode(problemCode);
                setProblem(response.data);
            } catch (err) {
                setError('Failed to fetch problem details');
            }
        };

        fetchProblem();
    }, [problemCode]);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await submitCode({
                problem_code: problemCode,
                source_code: code,
                language_id: language?.language_id,
                language_name: language?.language_name,
                problem_id: problem?.id
            });

            let submissionId = response.data;
            navigate(`/submissions/${submissionId}`);
        } catch (err) {
            setError('Failed to submit code');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">Submit Your Code</h1>
            <select
                id="language"
                value={language?.language_id}
                onChange={e => setLanguage(languages.find(lang => lang.language_id.toString() === e.target.value) || null)}
                className="mb-4 block w-full p-2 border border-gray-300 rounded-md"
            >
                {languages.map(lang => (
                    <option key={lang.language_id} value={lang.language_id}>
                        {lang.language_name}
                    </option>
                ))}
            </select>
            <Textarea_manual value={code} onChange={e => setCode(e.target.value)} placeholder="Write your code here..." rows={10} />
            <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Code'}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default CodeSubmission;
