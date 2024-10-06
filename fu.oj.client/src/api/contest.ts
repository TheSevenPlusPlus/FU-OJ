import { CreateContestRequest, SubmitCodeContestProblemRequest } from "../models/ContestModel";
import apiClient from "./client";

// Lấy tất cả contests
export const getAllContests = async (pageIndex: number, pageSize: number, isMine: boolean | false) => {
    console.log("isMine = ", isMine);
    var data = await apiClient.get("/contests", {
        params: { pageIndex, pageSize, isMine }, // Thêm query params cho phân trang
    });

    return data;
};

// Tạo contest mới
export const createContest = async (contest: CreateContestRequest) => {
    return await apiClient.post("/contests/create", contest);
};

// Lấy contest theo code
export const getContestByCode = async (code: string) => {
    return await apiClient.get(`/contests/${code}`);
};

// Xóa contest
export const deleteContest = async (id: string) => {
    return await apiClient.delete(`/contests/delete/${id}`);
};

// Đăng ký contest
export const registerContest = async (code: string) => {
    return await apiClient.post(`/contests/register/${code}`);
};

// Kiểm tra đã đăng ký contest chưa
export const isRegisteredContest = async (code: string) => {
    return await apiClient.get(`/contests/is-registered/${code}`);
};

// Lấy danh sách problems
export const getContestProblems = async (code: string) => {
    return await apiClient.get(`/contests/problem/${code}`);
};

// submit code
export const submitContestCode = async (data: SubmitCodeContestProblemRequest) => {
    var response = await apiClient.post("/contests/submit", data);
    return response;
};

// Lấy bảng rank
export const getRank = async (code: string) => {
    var response = await apiClient.get(`/contests/rank/${code}`);
    return response;
};