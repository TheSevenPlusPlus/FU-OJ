import apiClient from "./client";

// Lấy danh sách ngôn ngữ
export const getLanguages = async () => {
  return await apiClient.get("/system/languages");
};

// Lấy thông tin hệ thống
export const getSystemInfo = async () => {
  return await apiClient.get("/system/system_info");
};
