"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserForm } from "./UserForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toast } from "./Toast";
import { getUserByUserName, updateUser, updateRole } from "../../../api/user";
import { UserView, UpdateUserRequest } from "../../../models/UserDTO";
import { getRole } from "../../../api/general";
import { Helmet } from "react-helmet-async";

export default function UpdateUser() {
    const { userName } = useParams<{ userName: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserView | null>(null);
    const [initialRole, setInitialRole] = useState<string>("");
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    useEffect(() => {
        fetchUser();
        fetchRole();
    }, [userName]);

    const showToast = (message: string, type: "success" | "error"): void => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchUser = async (): Promise<void> => {
        try {
            const response = await getUserByUserName(userName);
            setUser(response.data);
        } catch (err) {
            showToast(
                "Failed to fetch user details. Please try again.",
                "error",
            );
        }
    };

    const fetchRole = async (): Promise<void> => {
        try {
            const role = await getRole(userName);
            setInitialRole(role);
        } catch (err) {
            showToast("Failed to fetch user role. Please try again.", "error");
        }
    };

    const handleUpdateUser = async (
        userData: UpdateUserRequest,
        role: string,
    ): Promise<void> => {
        try {
            await updateUser(userData);
            await updateRole(userData.userName, role);
            showToast("User updated successfully.", "success");
            setTimeout(() => navigate("/manager/users"), 1500);
        } catch (err) {
            showToast("Failed to update user. Please try again.", "error");
        }
    };

    if (!user || !initialRole) {
        return <p>Loading...</p>;
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <Helmet>
                <title> Update an user </title>
                <meta name="description" content="" />
            </Helmet>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Update User
                </CardTitle>
            </CardHeader>
            <CardContent>
                <UserForm
                    user={user}
                    initialRole={initialRole}
                    onSubmit={handleUpdateUser}
                    onCancel={() => navigate("/manager/users")}
                />
                {toast && <Toast message={toast.message} type={toast.type} />}
            </CardContent>
        </Card>
    );
}
