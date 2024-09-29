import apiClient from "./client";

export const getAllProblems = async (pageIndex: number, pageSize: number) => {
  return await apiClient.get("/problem", {
    params: { pageIndex, pageSize }, // Th�m query params cho ph�n trang
  });
};

export const getProblemByCode = async (code: string) => {
  return await apiClient.get(`/problem/${code}`);
};
