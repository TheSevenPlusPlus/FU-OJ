export interface CreateProblemModel {
    code: string;
    title: string;
    description: string;
    constraints: string;
    input: string;
    output: string;
    exampleInput: string;
    exampleOutput: string;
    timeLimit: string;
    memoryLimit: string;
    difficulty: string;
}
export interface UpdateProblemModel {
    code: string;
    title: string;
    description: string;
    constraints: string;
    input: string;
    output: string;
    exampleInput: string;
    exampleOutput: string;
    timeLimit: string;
    memoryLimit: string;
    difficulty: string;
}

export interface Problem {
    id: string;
    code: string;
    title: string;
    description: string;
    constraints: string;
    input: string;
    output: string;
    exampleInput: string;
    exampleOutput: string;
    timeLimit: number;
    memoryLimit: number;
    createdAt: string;
    userId: string;
    testCaseId?: string | null;
    difficulty: string;
    acQuantity: number | null;
    totalTests: number | null;
    hasSolution: string | null;
    status: string | null;
    passedTestCount: number
}
export interface ContestProblem {
    id: string;
    problemId: string;
    problemCode: string;
    title: string;
    order: number;
    point: number;
    timeLimit: number;
    memoryLimit: number;
    difficulty: string;
    totalTests: number | null;
    passedTestCount: number
}
