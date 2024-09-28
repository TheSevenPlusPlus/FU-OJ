import CreateProblemModel from '../models/ProblemModel';
import apiClient from './client';

export const getAllProblems = async (pageIndex: number, pageSize: number) => {
    return await apiClient.get('/problem', {
        params: { pageIndex, pageSize } // Thêm query params cho phân trang
    });
}


// Tạo problem mới
export const createProblem = async (problem: CreateProblemModel) => {
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

export const getProblemByCode = async (code: string) => {
    return await apiClient.get(`/problem/${code}`);
};
// Xóa problem
export const deleteProblem = async (id: string) => {
    return await apiClient.delete(`/problem/${id}`);
};
