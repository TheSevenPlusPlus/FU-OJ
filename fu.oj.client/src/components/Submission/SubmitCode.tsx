import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { submitCode } from "../../api/submission";
import Textarea_manual from "../ui/textarea-manual";
import { useParams, useNavigate } from "react-router-dom";
import { Problem } from "../../models/ProblemModel";
import { getProblemByCode } from "../../api/problem";

// Define model for language
interface Language {
    languageId: number;
    languageName: string;
}
// Create a list of languages
const languages: Language[] = [
    { languageId: 49, languageName: "C (GCC 8.3.0)" },
    { languageId: 53, languageName: "C++ (GCC 8.3.0)" },
    { languageId: 71, languageName: "Python (3.8.1)" },
    { languageId: 62, languageName: "Java (OpenJDK 13.0.1)" },
    { languageId: 63, languageName: "JavaScript (Node.js 12.14.0)" },
    { languageId: 74, languageName: "TypeScript (3.7.4)" },
    { languageId: 51, languageName: "C# (Mono 6.6.0.161)" },
    { languageId: 60, languageName: "Go (1.13.5)" },
    { languageId: 46, languageName: "Bash (5.0.0)" },
    { languageId: 67, languageName: "Pascal (FPC 3.0.4)" },
];

const CodeSubmission: React.FC = () => {
    const { problemCode } = useParams<{ problemCode: string }>();
    const navigate = useNavigate(); // Hook for navigation
    const [code, setCode] = useState<string>("");
    const [problem, setProblem] = useState<Problem | null>(null);
    const [language, setLanguage] = useState<Language | null>(languages[0]);
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = userData?.userName;

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await getProblemByCode(problemCode);
                setProblem(response.data);
            } catch (err) {
                setError("Failed to fetch problem details");
            }
        };

        fetchProblem();
    }, [problemCode]);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await submitCode({
                username: userName,
                problemCode: problemCode,
                sourceCode: code,
                languageId: language?.languageId,
                languageName: language?.languageName,
                problemId: problem?.id,
            });

            let submissionId = response.data;
            navigate(`/submissions/${submissionId}`);
        } catch (err) {
            setError("Failed to submit code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">Submit Your Code</h1>
            <select
                id="language"
                value={language?.languageId}
                onChange={(e) =>
                    setLanguage(
                        languages.find(
                            (lang) =>
                                lang.languageId.toString() === e.target.value,
                        ) || null,
                    )
                }
                className="mb-4 block w-full p-2 border border-gray-300 rounded-md"
            >
                {languages.map((lang) => (
                    <option key={lang.languageId} value={lang.languageId}>
                        {lang.languageName}
                    </option>
                ))}
            </select>
            <Textarea_manual
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your code here..."
                rows={10}
            />
            <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Code"}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default CodeSubmission;
