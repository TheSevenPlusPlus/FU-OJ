export interface Submission {
    id: string;
    problem_id: string;
    problem_name: string;
    language_name: string;
    submit_at: string;
    user_id: string | null;
    user_name: string | null;
    status: string;
}