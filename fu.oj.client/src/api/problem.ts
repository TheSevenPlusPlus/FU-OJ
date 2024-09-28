import { Problem } from '../models/ProblemModel';
import apiClient from './client';

// Lấy danh sách tất cả các problems
export const getAllProblems = async () => {
    return await apiClient.get<Problem[]>('/problem/');
};

// Lấy chi tiết problem bằng code
export const getProblemByCode = async (code: string) => {
    return await apiClient.get<Problem>(`/problem/${code}`);
};

// Tạo problem mới
export const createProblem = async (problem: {
    code: string;
    title: string;
    description?: string;
    constraints?: string;
    exampleInput?: string;
    exampleOutput?: string;
    timeLimit: number;
    memoryLimit: number;
    userId?: string;
}) => {
    return await apiClient.post('/problem/create', problem);
};

// Cập nhật problem
export const updateProblem = async (id: string, problem: {
    title?: string;
    description?: string;
    constraints?: string;
    exampleInput?: string;
    exampleOutput?: string;
    timeLimit: number;
    memoryLimit: number;
}) => {
    return await apiClient.put(`/problem/update/${id}`, problem);
};

// Xóa problem
export const deleteProblem = async (id: string) => {
    return await apiClient.delete(`/problem/${id}`);
};
