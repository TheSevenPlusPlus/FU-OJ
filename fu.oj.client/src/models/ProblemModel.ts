export interface Problem {
    id: string;
    code: string;
    title: string;
    description: string;
    constraints: string;
    example_input: string;
    example_output: string;
    time_limit: number;
    memory_limit: number;
    create_at: string;
    user_id: string;
    test_case_id?: string | null;  // test_case_id có thể null
    difficulty: string
}