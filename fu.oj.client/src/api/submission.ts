import apiClient from './client';

// 
export const submitCode = async (data: { problemId: string; code: string }) => {
    return await apiClient.post('/submissions/submit', data);
};

// 
export const getSubmissionStatus = async (token: string) => {
    return await apiClient.get(`/submissions/${token}`);
};
