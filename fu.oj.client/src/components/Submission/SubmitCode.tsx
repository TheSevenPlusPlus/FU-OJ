'use client'

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { submitCode } from "../../api/submission";
import { submitContestCode } from "../../api/contest";
import Editor from "@monaco-editor/react";
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Problem } from "../../models/ProblemModel";
import { getProblemByCode } from "../../api/problem";
import { getContestByCode, isRegisteredContest } from "../../api/contest";
import { ContestView } from "../../models/ContestModel";
import { ContestNavbar } from "../Contest/ContestNavbar";
import { Helmet } from "react-helmet-async";
import Loading from "../Loading"

interface Language {
    languageId: number;
    languageName: string;
    languageCode: string;
}

const languages: Language[] = [
    { languageId: 49, languageName: "C (GCC 8.3.0)", languageCode: "c" },
    { languageId: 53, languageName: "C++ (GCC 8.3.0)", languageCode: "cpp" },
    { languageId: 71, languageName: "Python (3.8.1)", languageCode: "python" },
    { languageId: 62, languageName: "Java (OpenJDK 13.0.1)", languageCode: "java" },
    { languageId: 63, languageName: "JavaScript (Node.js 12.14.0)", languageCode: "javascript" },
    { languageId: 74, languageName: "TypeScript (3.7.4)", languageCode: "typescript" },
    { languageId: 51, languageName: "C# (Mono 6.6.0.161)", languageCode: "csharp" },
    { languageId: 60, languageName: "Go (1.13.5)", languageCode: "go" },
    { languageId: 46, languageName: "Bash (5.0.0)", languageCode: "bash" },
    { languageId: 67, languageName: "Pascal (FPC 3.0.4)", languageCode: "pascal" },
];

export default function CodeSubmission() {
    const { problemCode } = useParams<{ problemCode: string }>();
    const navigate = useNavigate();
    const [code, setCode] = useState<string>("");
    const [problem, setProblem] = useState<Problem | null>(null);
    const [language, setLanguage] = useState<Language>(languages[0]);
    const [contestCode, setContestCode] = useState<string | null>(null);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [contest, setContest] = useState<ContestView | null>(null);
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const isLoggedIn = localStorage.getItem("token") !== null;

    useEffect(() => {
        if (!isLoggedIn) {
            navigate(`/login?redirectTo=${encodeURIComponent(location.pathname)}`);
        }
    }, [isLoggedIn, navigate, location.pathname]);

    useEffect(() => {
        const fetchProblem = async () => {
            if (!problemCode) return;

            try {
                const response = await getProblemByCode(problemCode);
                setProblem(response.data);

                const contestCodeParam = searchParams.get("contestCode");
                if (contestCodeParam) {
                    setContestCode(contestCodeParam);
                    const contestResponse = await getContestByCode(contestCodeParam);
                    setContest(contestResponse.data);

                    const registeredResponse = await isRegisteredContest(contestCodeParam);
                    setIsRegistered(registeredResponse.data);
                }
            } catch (err) {
                setError("Failed to fetch problem details");
            }
        };

        fetchProblem();
    }, [problemCode, searchParams]);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!contestCode || (contest && Date.now() > new Date(contest.endTime).getTime())) {
                const response = await submitCode({
                    problemCode: problemCode!,
                    sourceCode: code,
                    languageId: language.languageId,
                    languageName: language.languageName,
                    problemId: problem?.id,
                });
                navigate(`/submissions/${response.data}`);
            } else {
                const response = await submitContestCode({
                    problemCode: problemCode!,
                    sourceCode: code,
                    languageId: language.languageId,
                    languageName: language.languageName,
                    problemId: problem?.id,
                    contestCode: contestCode,
                });
                navigate(`/submissions/${response.data}?contestCode=${contestCode}`);
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setCode(content);
            };
            reader.readAsText(file);
        }
    };

    const handleChooseFile = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            {isRegistered && <ContestNavbar />}
            {isRegistered && contest && (
                <div className="bg-white border-b border-gray-200 py-4 sticky top-10 z-10">
                    <h1 className="text-3xl font-extrabold text-center text-gray-800">{contest.name}</h1>
                </div>
            )}
            <div className="container mx-auto py-8">
                <Helmet>
                    <title>Submit for {problem?.title || "Unknown Problem"}</title>
                    <meta name="description" content="Submit your code for the problem." />
                </Helmet>

                <h1 className="text-3xl font-bold mb-4">Submit Your Code</h1>
                <div className="mb-4">
                    <select
                        id="language"
                        value={language.languageId}
                        onChange={(e) => {
                            const selectedLang = languages.find(
                                (lang) => lang.languageId.toString() === e.target.value
                            );
                            if (selectedLang) {
                                setLanguage(selectedLang);
                                setCode("");
                            }
                        }}
                        className="block w-full p-2 border border-gray-300 rounded-md mb-2"
                    >
                        {languages.map((lang) => (
                            <option key={lang.languageId} value={lang.languageId}>
                                {lang.languageName}
                            </option>
                        ))}
                    </select>
                    <div className="flex items-center">
                        <Button onClick={handleChooseFile} className="mr-2">Choose File</Button>
                        {fileName && <span className="text-sm text-gray-600">{fileName}</span>}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".c,.cpp,.py,.java,.js,.ts,.cs,.go,.sh,.pas"
                    />
                </div>
                <div className="border rounded-md mb-4">
                    <Editor
                        height="400px"
                        language={language.languageCode}
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        theme="vs-dark"
                    />
                </div>

                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Submitting..." : "Submit Code"}
                </Button>
                {error && <p className="text-red-500">{error}</p>}
            </div>
        </>
    );
}