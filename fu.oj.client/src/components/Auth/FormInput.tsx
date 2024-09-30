import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
    id: string;
    name: string;
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ id, name, label, type, value, onChange, error }) => {
    return (
        <div className="space-y-1">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};