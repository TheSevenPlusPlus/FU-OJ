import axios from "axios";

// Tạo axios instance
const apiClient = axios.create({
    baseURL: "https://fuoj.tech/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Sử dụng interceptor để thêm token vào mỗi request
apiClient.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser && storedUser.token) {
            // Thêm token vào headers nếu tồn tại
            config.headers.Authorization = `Bearer ${storedUser.token}`;
        }

        return config;
    },
    (error) => {
        // Xử lý lỗi
        return Promise.reject(error);
    },
);

export default apiClient;
