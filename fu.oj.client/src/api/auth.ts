import apiClient from "./client";

// Function to register a new user
export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post("/auth/register", {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            fullName: userData.fullName,
            // phoneNumber: userData.phoneNumber, // Uncomment if needed
        });
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error during registration:", error);
        throw error; // Re-throw the error for handling in the calling code
    }
};

// Function to log in an existing user
export const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post("/auth/login", {
            identifier: credentials.identifier,
            password: credentials.password,
        });
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error during login:", error);
        throw error; // Re-throw the error for handling in the calling code
    }
};

// Function to send a forgot password email
export const forgotPassword = async (email) => {
    try {
        const response = await apiClient.post("/auth/forgotpassword", {
            email: email,
        });
        return response.toString(); // Return the response data
    } catch (error) {
        console.error("Error during forgot password:", error);
        throw error; // Re-throw the error for handling in the calling code
    }
};

// Function to reset the password
export const resetPassword = async (ResetPasswordRequest) => {
    try {
        const response = await apiClient.post("/auth/resetpassword", {
            token: ResetPasswordRequest.token,
            email: ResetPasswordRequest.email,
            newPassword: ResetPasswordRequest.newPassword,
        });
        return response; // Return the response data
    } catch (error) {
        console.error("Error during reset password:", error);
        throw error; // Re-throw the error for handling in the calling code
    }
};
