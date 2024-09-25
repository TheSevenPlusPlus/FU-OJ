import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { submitCode } from '../api/submission';
import Textarea from './ui/textarea';
import Select from './ui/select';
import { useParams } from 'react-router-dom';

const CodeSubmission: React.FC = () => {
    const { problemCode } = useParams<{ problemCode: string }>();
    const [code, setCode] = useState<string>('');
    const [language, setLanguage] = useState<string>('JavaScript');
    const [input, setInput] = useState<string>('');
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await submitCode({ problemCode, code, language });
            setResult(response.data.result);
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
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="mb-4 block w-full p-2 border border-gray-300 rounded-md"
            >
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                {/* Add more languages as needed */}
            </select>
            <Textarea value={code} onChange={e => setCode(e.target.value)} placeholder="Write your code here..." rows={10} />
            <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Code'}
            </Button>
            {result && <div className="mt-4">{result}</div>}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default CodeSubmission;
