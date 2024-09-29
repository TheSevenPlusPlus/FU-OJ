import apiClient from "./client";

export const getRank = async (pageNumber: number, pageSize: number) => {
    const respond = await apiClient.get(`/general/rank?page=${pageNumber}&pageSize=${pageSize}`);
    //console.log(respond);
    return respond.data;
};

export const getRole = async (userName: string) => {
    const respond = await apiClient.get(`/auth/checkrole/${userName}`);
    return respond.data.roles[0];
}