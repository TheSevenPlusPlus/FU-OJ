import apiClient from './client';

// G?i submission
export const getAllProblems = async () => {
    return await apiClient.get('/problem/');
};

export const getProblemByCode = async (id: string) => {
    return await apiClient.get(`/problem/${id}`);
};