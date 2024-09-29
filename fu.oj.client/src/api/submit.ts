import { SubmissionRequest } from "../models/SubmissionRequest";
import apiClient from "./client";

export const submitSolution = async (data: SubmissionRequest) => {
    //console.log(data);
    return await apiClient.post(`/submissions/submit`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
};
