import apiClient from "./client";

export const addTestCaseWithFile = (formData: FormData) => {
    return apiClient.post('/test-case/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};