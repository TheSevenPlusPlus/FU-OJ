import React from "react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
    children: React.ReactNode;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    onClick?: () => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ children, variant = "default", onClick }) => {
    return (
        <Button type={onClick ? "button" : "submit"} variant={variant} onClick={onClick}>
            {children}
        </Button>
    );
};