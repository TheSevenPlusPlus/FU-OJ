"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserTable } from "./UserTable";
import { Pagination } from "./Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toast } from "./Toast";
import { getAllUsers, deleteUser } from "../../../api/user";
import { UserView } from "../../../models/UserDTO";
import { Helmet } from "react-helmet-async";

interface UsersResponse {
    users: UserView[];
    totalPages: number;
}

export default function UserManagement() {
    const [users, setUsers] = useState<UserView[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const navigate = useNavigate();
    const pageSize: number = 10;

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const showToast = (message: string, type: "success" | "error"): void => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchUsers = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await getAllUsers(currentPage, pageSize);
            const data = response.data as UsersResponse;
            setUsers(data.users);
            setTotalPages(data.totalPages);
        } catch (err) {
            showToast("Failed to fetch users. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (id: string): Promise<void> => {
        try {
            await deleteUser(id);
            fetchUsers();
            showToast("User deleted successfully.", "success");
        } catch (err) {
            showToast("Failed to delete user. Please try again.", "error");
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <Helmet>
                <title> User Management </title>
                <meta name="description" content="" />
            </Helmet>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    User Management
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Button onClick={() => navigate("/manager/users/create")}>
                        Add New User
                    </Button>
                </div>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <UserTable
                            users={users}
                            onEdit={(user: UserView) =>
                                navigate(
                                    `/manager/users/update/${user.userName}`,
                                )
                            }
                            onDelete={handleDeleteUser}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
                {toast && <Toast message={toast.message} type={toast.type} />}
            </CardContent>
        </Card>
    );
}
