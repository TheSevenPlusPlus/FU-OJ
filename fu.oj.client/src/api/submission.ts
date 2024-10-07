import apiClient from "./client";

//
export const submitCode = async (data: {
    problemCode: string;
    sourceCode: string;
    languageId: number;
    languageName: string;
    problemId: string;
}) => {
    var response = await apiClient.post("/submissions/submit", data);
    return response;
};

// Cập nhật hàm gọi API để hỗ trợ phân trang
export const getAllSubmissions = async (
    pageIndex: number,
    pageSize: number,
    isMine: string | null,
    problemCode: string | null,
    contestCode: string | null
) => {
    //console.log("problemCode: ", problemCode, " contestCode: ", contestCode);
    //console.log("isMine in here: ", isMine);
    return await apiClient.get(`/submissions/all`, {
        params: { pageIndex, pageSize, isMine, problemCode, contestCode },
    });
};

export const getSubmissionById = async (id: string) => {
    //console.log("id = ", id);
    return await apiClient.get(`/submissions/${id}`);
};
