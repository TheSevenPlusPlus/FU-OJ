import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormInput } from "./FormInput";
import { SubmitButton } from "./SubmitButton";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
    onSubmit: (identifier: string, password: string) => Promise<void>;
    submitError: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, submitError }) => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(identifier, password);
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!identifier.trim()) newErrors.identifier = "Username or Email is required";
        if (!password) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleForgotPassword = () => {
        navigate("/forgotpassword");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {submitError && (
                        <Alert variant="destructive">
                            <AlertDescription>{submitError}</AlertDescription>
                        </Alert>
                    )}
                    <FormInput
                        id="login-identifier"
                        name="identifier"
                        label="Username or Email"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        error={errors.identifier}
                    />
                    <div className="relative">
                        <FormInput
                            id="login-password"
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-8 h-8 w-8 px-0"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                                {showPassword ? "Hide password" : "Show password"}
                            </span>
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <SubmitButton>Login</SubmitButton>
                    <Button variant="link" onClick={handleForgotPassword}>
                        Forgot Password?
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};