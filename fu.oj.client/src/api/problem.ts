import { CreateProblemModel, UpdateProblemModel } from "../models/ProblemModel";
import apiClient from "./client";

export const getAllProblems = async (pageIndex: number, pageSize: number, isMine: boolean | false) => {
    return await apiClient.get("/problem", {
        params: { pageIndex, pageSize, isMine }, // Thêm query params cho phân trang
    });
};

// Tạo problem mới
export const createProblem = async (problem: CreateProblemModel) => {
    return await apiClient.post("/problem/create", problem);
};

// Cập nhật problem
export const updateProblem = async (problem: UpdateProblemModel) => {
    return await apiClient.put(`/problem/update/`, problem);
};

export const getProblemByCode = async (code: string) => {
    return await apiClient.get(`/problem/${code}`);
};
// Xóa problem
export const deleteProblem = async (id: string) => {
    return await apiClient.delete(`/problem/delete/${id}`);
};
