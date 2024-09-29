import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7242/", // Thay đổi theo URL API của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
