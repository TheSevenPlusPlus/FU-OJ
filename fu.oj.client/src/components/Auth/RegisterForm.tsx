import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormInput } from "./FormInput";
import { SubmitButton } from "./SubmitButton";

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const passwordRegex = {
            lowerCase: /[a-z]/,
            upperCase: /[A-Z]/,
            number: /\d/,
            specialChar: /[!@#$%^&*(),.?":{}|<>]/,
        };

        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
        if (!passwordRegex.lowerCase.test(formData.password))
            newErrors.password = "Password must include at least one lowercase letter";
        if (!passwordRegex.upperCase.test(formData.password))
            newErrors.password = "Password must include at least one uppercase letter";
        if (!passwordRegex.number.test(formData.password))
            newErrors.password = "Password must include at least one number";
        if (!passwordRegex.specialChar.test(formData.password))
            newErrors.password = "Password must include at least one special character";
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Create a new account to get started.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-2">
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
                    <FormInput
                        id="register-password"
                        name="password"
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={errors.password}
                    />
                    <FormInput
                        id="register-confirm-password"
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={errors.confirmPassword}
                    />
                    <FormInput
                        id="register-full-name"
                        name="fullName"
                        label="Full Name"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        error={errors.fullName}
                    />
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
                <CardFooter>
                    <SubmitButton>Register</SubmitButton>
                </CardFooter>
            </form>
        </Card>
    );
};