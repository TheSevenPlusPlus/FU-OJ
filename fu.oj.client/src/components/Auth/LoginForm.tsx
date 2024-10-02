import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormInput } from "./FormInput";
import { SubmitButton } from "./SubmitButton";

interface LoginFormProps {
    onSubmit: (username: string, password: string) => Promise<void>;
    submitError: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, submitError }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(username, password);
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!username.trim()) newErrors.username = "Username is required";
        if (!password) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleForgotPassword = () => {
        navigate("/forgotpassword");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-2">
                    {submitError && (
                        <Alert variant="destructive">
                            <AlertDescription>{submitError}</AlertDescription>
                        </Alert>
                    )}
                    <FormInput
                        id="login-username"
                        name="username"
                        label="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={errors.username}
                    />
                    <FormInput
                        id="login-password"
                        name="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                    />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <SubmitButton>Login</SubmitButton>
                    <SubmitButton variant="link" onClick={handleForgotPassword}>
                        Forgot Password?
                    </SubmitButton>
                </CardFooter>
            </form>
        </Card>
    );
};