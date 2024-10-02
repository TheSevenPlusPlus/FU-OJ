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
    userName: string;
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
}
