import apiClient from './client';

export const getAllProblems = async () => {
    return await apiClient.get('/problem/');
};

export const getProblemByCode = async (id: string) => {
    return await apiClient.get(`/problem/${id}`);
};