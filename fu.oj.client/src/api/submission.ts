import apiClient from "./client";

//
export const submitCode = async (data: {
    problemCode: string;
    sourceCode: string;
    languageId: number;
    languageName: string;
    problemId: string;
}) => {
    return await apiClient.post("/submissions/submit", data);
};

// Cập nhật hàm gọi API để hỗ trợ phân trang
export const getAllSubmissions = async (
    pageIndex: number,
    pageSize: number,
    problemCode: string | null,
    isMine: boolean | false
) => {
    return await apiClient.get(`/submissions/all`, {
        params: { pageIndex, pageSize, problemCode, isMine },
    });
};

export const getSubmissionById = async (id: string) => {
    //console.log("id = ", id);
    return await apiClient.get(`/submissions/${id}`);
};
