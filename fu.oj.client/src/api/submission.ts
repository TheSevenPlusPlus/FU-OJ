import apiClient from "./client";

//
export const submitCode = async (data: {
    problemCode: string;
    sourceCode: string;
    languageId: number;
    languageName: string;
    problemId: string;
    username: string;
}) => {
    return await apiClient.post("/submissions/submit", data);
};

// Cập nhật hàm gọi API để hỗ trợ phân trang
export const getAllSubmissions = async (
    pageIndex: number,
    pageSize: number,
    username: string | null,
    problemCode: string | null,
) => {
    return await apiClient.get(`/submissions/all`, {
        params: { pageIndex, pageSize, username, problemCode },
    });
};

export const getSubmissionById = async (id: string) => {
    //console.log("id = ", id);
    return await apiClient.get(`/submissions/${id}`);
};
