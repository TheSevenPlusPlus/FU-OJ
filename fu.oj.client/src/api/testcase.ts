import apiClient from "./client";

export const createTestCase = async (formData: FormData) => {
    return await apiClient.post("/test-case/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const updateTestCase = async (formData: FormData) => {
    return await apiClient.post("/test-case/update", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
