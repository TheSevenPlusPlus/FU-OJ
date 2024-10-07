"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { loginUser, registerUser } from "../../api/auth";
import { Helmet } from "react-helmet-async"; // Nhập Helmet ở đây

interface RegisterProps {
    additionalFields?: { name: string; label: string }[];
}

interface FormErrors {
    [key: string]: string;
}

export default function AuthForm({ additionalFields = [] }: RegisterProps) {
    const [activeTab, setActiveTab] = useState<string>("login");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        phoneNumber: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitError, setSubmitError] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            navigate("/");
            return;
        }

        if (location.pathname === "/login") {
            setActiveTab("login");
        } else if (location.pathname === "/register") {
            setActiveTab("register");
        }
    }, [location, navigate]);

    useEffect(() => {
        if (submitError) {
            const timer = setTimeout(() => {
                setSubmitError(null);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [submitError]);

    const handleLogin = async (identifier: string, password: string) => {
        try {
            const data = await loginUser({ identifier, password });
            console.log("Login successful:", data);
            localStorage.setItem("user", JSON.stringify(data));
            navigate("/problems");
            navigate(0); // Reload
        } catch (error: any) {
            console.error("Login failed:", error.response?.data || error.message);
            setSubmitError("Login failed. Please check your credentials and try again.");
        }
    };

    const handleRegister = async (userData: {
        username: string;
        email: string;
        password: string;
        fullName: string;
    }) => {
        try {
            const data = await registerUser(userData);
            console.log("Registration successful:", data);
            localStorage.setItem("user", JSON.stringify(data));
            navigate("/profile");
            navigate(0); // Reload
        } catch (error: any) {
            console.error("Registration failed:", error.response?.data || error.message);
            setSubmitError("Registration failed. Please try again later.");
        }
    };

    return (
        <>
            <Helmet>
                <title>{activeTab === "login" ? "Login | FUOJ" : "Register | FUOJ"}</title>
                <meta name="description" content={activeTab === "login" ? "Đăng nhập vào tài khoản của bạn." : "Đăng ký tài khoản mới."} />
            </Helmet>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <LoginForm onSubmit={handleLogin} submitError={submitError} />
                </TabsContent>
                <TabsContent value="register">
                    <RegisterForm onSubmit={handleRegister} submitError={submitError} additionalFields={additionalFields} />
                </TabsContent>
            </Tabs>
        </>
    );
}
