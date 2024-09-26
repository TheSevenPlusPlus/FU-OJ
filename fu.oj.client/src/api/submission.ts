import apiClient from './client';

// 
export const submitCode = async (data: { problem_code: string; source_code: string; language_id: number, language_name: string, problem_id: string }) => {
    return await apiClient.post('/submissions/submit', data);
};

// 
export const getAllSubmissions = async () => {
    return await apiClient.get(`/submissions`);
};
