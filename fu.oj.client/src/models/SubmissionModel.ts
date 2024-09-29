import { Result } from "./ResultModel";
export interface Submission {
    id: string;
    problemId: string;
    sourceCode: string;
    problemName: string;
    languageName: string;
    submittedAt: string;
    userId: string | null;
    userName: string | null;
    status: string;
    results: Result[];
}
