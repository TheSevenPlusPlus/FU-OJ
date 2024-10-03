import apiClient from "./client";

export const getRank = async (pageNumber: number, pageSize: number) => {
    const respond = await apiClient.get(
        `/general/rank?page=${pageNumber}&pageSize=${pageSize}`,
    );
    //console.log(respond);
    return respond.data;
};

export const getRole = async () => {
    const respond = await apiClient.get(`/general/getrole`);
    return respond.data.role;
};
