﻿import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { submitCode } from "../../api/submission";
import { submitContestCode } from "../../api/contest";
import Textarea_manual from "../ui/textarea-manual";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Problem } from "../../models/ProblemModel";
import { getProblemByCode } from "../../api/problem";
import { getContestByCode, registerContest, isRegisteredContest, getContestProblems } from "../../api/contest";  // Import the isRegisteredContest API
import { ContestView } from "../../models/ContestModel";
import { ContestNavbar } from "../Contest/ContestNavbar";

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
    const [contestCode, setContestCode] = useState<string | null>(null);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [contest, setContest] = useState<ContestView | null>(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await getProblemByCode(problemCode);
                setProblem(response.data);

                const contestCode = searchParams.get("contestCode");
                if (contestCode != null) {
                    setContestCode(contestCode);
                    try {
                        const _response = await getContestByCode(contestCode);
                        setContest(_response.data);

                        const registeredResponse = await isRegisteredContest(contestCode);
                        setIsRegistered(registeredResponse.data);  // Assuming API returns { isRegistered: boolean }
                    } catch (error) {
                        console.error("Error fetching registration status", error);
                    }
                }
            } catch (err) {
                setError("Failed to fetch problem details");
            }
        };

        fetchProblem();
    }, [problemCode, contestCode]);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            if (contestCode == null) {
                const response = await submitCode({
                    problemCode: problemCode,
                    sourceCode: code,
                    languageId: language?.languageId,
                    languageName: language?.languageName,
                    problemId: problem?.id,
                });

                let submissionId = response.data;
                navigate(`/submissions/${submissionId}`);
            }
            else {
                const response = await submitContestCode({
                    problemCode: problemCode,
                    sourceCode: code,
                    languageId: language?.languageId,
                    languageName: language?.languageName,
                    problemId: problem?.id,
                    contestCode: contestCode
                });

                let submissionId = response.data;
                navigate(`/submissions/${submissionId}?contestCode=${contestCode}`);
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError("Bài tập chưa có được nạp dữ liệu testcase");
            } else {
                setError("Failed to submit code");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {isRegistered && <ContestNavbar />}

            {isRegistered &&
                < div className="bg-white border-b border-gray-200 py-4 sticky top-10 z-10">
                    <h1 className="text-3xl font-extrabold text-center text-gray-800">{contest.name}</h1>
                </div >
            }
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
        </>
    );
};

export default CodeSubmission;
