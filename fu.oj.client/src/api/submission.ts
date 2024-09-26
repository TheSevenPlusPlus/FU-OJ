import apiClient from './client';

// 
export const submitCode = async (data: { problemCode: string; sourceCode: string; languageId: number, languageName: string, problemId: string }) => {
    return await apiClient.post('/submissions/submit', data);
};

// 
export const getAllSubmissions = async () => {
    return await apiClient.get(`/submissions`);
};

export const getSubmissionById = async (id: string) => {
    console.log("id = ", id);
    return await apiClient.get(`/submissions/${id}`);
};
