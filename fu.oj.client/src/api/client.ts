import axios from "axios";

// Tạo axios instance
const apiClient = axios.create({
    baseURL: process.env.NODE_ENV === "production" ? "https://api.fuoj.tech/" : "https://localhost:7242/",
    headers: {
        "Content-Type": "application/json",
    },
    //withCredentials: true,
});

// Sử dụng interceptor để thêm token vào mỗi request
apiClient.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage
        const token = JSON.parse(localStorage.getItem("token"));

        if (token) {
            // Thêm token vào headers nếu tồn tại
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Xử lý lỗi
        return Promise.reject(error);
    },
);

export default apiClient;
