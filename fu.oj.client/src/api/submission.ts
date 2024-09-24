import apiClient from './client';

// 
export const submitCode = async (data: { problemCode: string; code: string; language: string }) => {
    return await apiClient.post('/submissions/submit', data);
};

// 
export const getSubmissionStatus = async (token: string) => {
    return await apiClient.get(`/submissions/${token}`);
};
