import apiClient from "./client";

// Function to register a new user
export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post("/auth/register", {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            fullName: userData.fullName,
            //phoneNumber: userData.phoneNumber
        });
        //console.log(response);
        return response.data; // Return the response data (which includes the user info and token)
    } catch (error) {
        console.error("Error during registration:", error);
        throw error; // Re-throw the error for handling in the calling code
    }
};

// Function to log in an existing user
export const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post("/auth/login", {
            username: credentials.username,
            password: credentials.password,
        });
        return response.data; // Return the response data (which should include the user info and token)
    } catch (error) {
        console.error("Error during login:", error);
        throw error; // Re-throw the error for handling in the calling code
    }
};
