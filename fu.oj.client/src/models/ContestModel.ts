export interface ContestView {
    id: string;               // Contest unique ID
    code: string;             // Contest code
    name: string;             // Contest name
    description?: string;     // Contest description (optional)
    startTime: string;          // Contest start time
    endTime: string;            // Contest end time
    organizationId: string; // Organizer's user ID
    organizationName: string;
    rules?: string;           // Contest rules (optional)
    participants: ContestParticipantView[];  // List of participants
    problems: ContestProblemView[];          // List of problems
}

export interface ContestProblemView {
    id: string;               // Contest problem unique ID
    problemId: string;        // Problem unique ID
    problemCode: string;      // Problem code
    order: number;            // Problem order in contest
    point: number;            // Points awarded for solving the problem
    title: string;
    timeLimit: number;
    memoryLimit: number;
    difficulty: string;
    totalTests: number | null;
    passedTestCount: number;
}

export interface ContestParticipantView {
    id: string;               // Participant unique ID
    userId?: string;          // User ID of the participant (optional)
    userName: string;         // User name of the participant
    contestId?: string;       // Contest ID (optional)
    contestCode?: string;     // Contest code (optional)
    score: number;            // Score achieved by the participant
    problems: ContestProblemView[]; // List of problems solved by the participant
}
export interface CreateContestRequest {
    code: string;             // Contest code
    name: string;             // Contest name
    description?: string;     // Contest description (optional)
    startTime: string;          // Contest start time
    endTime: string;            // Contest end time
    rules?: string;           // Contest rules (optional)
    problems: CreateContestProblemRequest[]; // List of problems for the contest
}

export interface UpdateContestRequest {
    name: string;             // Contest name
    description?: string;     // Contest description (optional)
    startTime: string;          // Contest start time
    endTime: string;            // Contest end time
    rules?: string;           // Contest rules (optional)
    problems: CreateContestProblemRequest[]; // List of problems for the contest
}

export interface CreateContestProblemRequest {
    problemCode: string;      // Problem code
    order: number;            // Problem order in the contest
    point: number;            // Points awarded for solving the problem
}

export interface CreateSubmissionRequest {
    sourceCode: string;      // Source code of the submission
    languageId: number;      // ID of the programming language used
    languageName: string;
    problemCode: string;     // Code of the problem being solved
    problemId: string;       // ID of the problem
}
export interface SubmitCodeContestProblemRequest extends CreateSubmissionRequest {
    contestCode: string;      // Contest code
}