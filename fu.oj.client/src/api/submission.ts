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
) => {
  return await apiClient.get(`/submissions/all`, {
    params: { pageIndex, pageSize }, // Thêm query params cho phân trang
  });
};

// Cập nhật hàm gọi API để hỗ trợ phân trang
export const getAllSubmissionsBelongsUser = async (
  pageIndex: number,
  pageSize: number,
  username: string,
) => {
  return await apiClient.get(`/submissions/all/${username}`, {
    params: { pageIndex, pageSize }, // Thêm query params cho phân trang
  });
};

export const getSubmissionById = async (id: string) => {
    //console.log("id = ", id);
    return await apiClient.get(`/submissions/${id}`);
};
