import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitSolution } from '../../api/submit';

const languages = [
    { id: 27, name: 'Java' },
    { id: 53, name: 'C++' },
    { id: 50, name: 'C' }
];

const SubmitProblemForm: React.FC = () => {
    const { problemCode } = useParams<{ problemCode: string }>(); // Correct useParams
    const [sourceCode, setSourceCode] = useState<string>('');
    const [languageId, setLanguageId] = useState<number>(53); // Default to C++
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const response = await submitSolution({
                source_code: sourceCode,
                language_id: languageId,
                problem_code: problemCode // Ensure problemCode is passed correctly
            });
            console.log('Submit response: ', response);
            setMessage('Solution submitted successfully');
            navigate('/');
        } catch (err) {
            setMessage('Failed to submit solution');
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-6">Submit Your Solution</h1>
            <div className="mb-6">
                <label htmlFor="language" className="block text-lg font-medium text-gray-700 mb-2">
                    Select Language
                </label>
                <select
                    id="language"
                    value={languageId}
                    onChange={(e) => setLanguageId(parseInt(e.target.value))}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    {languages.map((language) => (
                        <option key={language.id} value={language.id}>
                            {language.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-6">
                <label htmlFor="sourceCode" className="block text-lg font-medium text-gray-700 mb-2">
                    Source Code
                </label>
                <textarea
                    id="sourceCode"
                    rows={10}
                    value={sourceCode}
                    onChange={(e) => setSourceCode(e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter your code here..."
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Submit
                </button>
            </div>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
};

export default SubmitProblemForm;
