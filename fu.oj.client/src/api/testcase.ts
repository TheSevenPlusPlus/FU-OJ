import apiClient from "./client";

export const addTestCaseWithFile = async (formData: FormData) => {
     return await apiClient.post('/test-case/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
};