export interface Problem {
    id: string;
    code: string;
    title: string;
    description: string;
    constraints: string;
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
}
