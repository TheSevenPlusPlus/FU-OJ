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
    contestId?: string;       // Contest ID (optional)
    contestCode?: string;     // Contest code (optional)
    problemId: string;        // Problem unique ID
    problemCode: string;      // Problem code
    order: number;            // Problem order in contest
    maximumSubmission: number; // Max number of submissions allowed
    point: number;            // Points awarded for solving the problem
}

export interface ContestParticipantView {
    id: string;               // Participant unique ID
    userId?: string;          // User ID of the participant (optional)
    contestId?: string;       // Contest ID (optional)
    contestCode?: string;     // Contest code (optional)
    score: number;            // Score achieved by the participant
}
export interface CreateContestRequest {
    code: string;             // Contest code
    name: string;             // Contest name
    description?: string;     // Contest description (optional)
    startTime: string;          // Contest start time
    endTime: string;            // Contest end time
    organizationUserId: string; // Organizer's user ID
    rules?: string;           // Contest rules (optional)
    problems: CreateContestProblemRequest[]; // List of problems for the contest
}

export interface CreateContestProblemRequest {
    problemId: string;        // Problem unique ID
    problemCode: string;      // Problem code
    order: number;            // Problem order in the contest
    point: number;            // Points awarded for solving the problem
    maximumSubmission: number; // Max number of submissions allowed
}

export interface CreateSubmissionRequest {
    sourceCode: string;      // Source code of the submission
    languageId: number;      // ID of the programming language used
    languageName: string;    // Name of the programming language used
    problemCode: string;     // Code of the problem being solved
    problemId: string;       // Unique ID of the problem being solved
}
export interface SubmitCodeContestProblemRequest extends CreateSubmissionRequest {
    contestId: string;        // Contest unique ID
    contestCode: string;      // Contest code
}