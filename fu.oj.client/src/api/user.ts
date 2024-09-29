﻿import {
  CreateUserRequest,
  UpdateUserRequest,
  UserView,
} from "../models/UserDTO";
import apiClient from "./client";

export const getAllUsers = async (pageIndex: number, pageSize: number) => {
  return await apiClient.get("/user/get", {
    params: { pageIndex, pageSize }, // Thêm query params cho phân trang
  });
};

export const createUser = async (user: CreateUserRequest) => {
  return await apiClient.post("/user/create", user);
};

export const updateUser = async (user: UpdateUserRequest) => {
  return await apiClient.put(`/user/update`, user);
};

export const getUserByUserName = async (userName: string) => {
  return await apiClient.get(`/user/get/${userName}`);
};

export const deleteUser = async (userName: string) => {
  return await apiClient.delete(`/user/delete/${userName}`);
};
