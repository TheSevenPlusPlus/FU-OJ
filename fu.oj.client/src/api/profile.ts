import { UpdateUserProfile } from "../models/UserProfileModel";
import apiClient from "./client"; // assuming apiClient is in the same directory

const sanitizeProfileData = (profileData: UpdateUserProfile) => {
    const sanitizedData = { ...profileData };

    Object.keys(sanitizedData).forEach((key) => {
        if (sanitizedData[key] === null) {
            sanitizedData[key] = ""; // Replace null values with empty strings
        }
    });

    return sanitizedData;
};

// Fetches profile based on userName
export const getProfile = async (userName: string) => {
    try {
        const response = await apiClient.get(`/Profile/get/${userName}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error; // Rethrow so the caller can handle it
    }
};

// Function to update the profile
export const updateProfile = async (profileData: UpdateUserProfile) => {
    try {
        // Sanitize data to avoid sending null values
        const sanitizedData = sanitizeProfileData(profileData);
        console.log("Sanitized profile data being sent:", sanitizedData);

        const response = await apiClient.put("/Profile/update", sanitizedData);
        return response.data;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error; // Rethrow so the caller can handle it
    }
};
