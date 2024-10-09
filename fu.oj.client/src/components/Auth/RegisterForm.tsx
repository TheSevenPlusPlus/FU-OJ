import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormInput } from "./FormInput";
import { SubmitButton } from "./SubmitButton";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface RegisterFormProps {
    onSubmit: (userData: { username: string; email: string; password: string; fullName: string }) => Promise<void>;
    submitError: string | null;
    additionalFields?: { name: string; label: string }[];
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, submitError, additionalFields = [] }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
        if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
            });
        }
    };

    const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Create a new account to get started.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {submitError && (
                        <Alert variant="destructive">
                            <AlertDescription>{submitError}</AlertDescription>
                        </Alert>
                    )}
                    <FormInput
                        id="register-username"
                        name="username"
                        label="Username"
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange}
                        error={errors.username}
                    />
                    <FormInput
                        id="register-email"
                        name="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={errors.email}
                    />
                    <div className="relative">
                        <FormInput
                            id="register-password"
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            error={errors.password}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-8 h-8 w-8 px-0"
                            onClick={() => togglePasswordVisibility('password')}
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
                    <div className="relative">
                        <FormInput
                            id="register-confirm-password"
                            name="confirmPassword"
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            error={errors.confirmPassword}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-8 h-8 w-8 px-0"
                            onClick={() => togglePasswordVisibility('confirmPassword')}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                                {showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            </span>
                        </Button>
                    </div>
                    {additionalFields.map((field) => (
                        <FormInput
                            key={field.name}
                            id={`register-${field.name}`}
                            name={field.name}
                            label={field.label}
                            type="text"
                            value={formData[field.name] || ""}
                            onChange={handleInputChange}
                            error={errors[field.name]}
                        />
                    ))}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <SubmitButton > Register </SubmitButton>
                </CardFooter>
            </form>
        </Card>
    );
};
