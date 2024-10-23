import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { forgotPassword } from "../../api/auth";
import { Helmet } from 'react-helmet-async';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await sendResetLink();
    };

    const sendResetLink = async () => {
        setIsLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            await forgotPassword(email);
            setSuccessMessage("Password reset link has been sent to your email. Please check your inbox and spam folder.");
            setCountdown(60); // Start 60-second countdown
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage("The provided email is invalid or not registered.");
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-[350px] mx-auto mt-20">
            <Helmet>
                <title> Forgot Password </title>
            </Helmet>
            <CardHeader>
                <CardTitle>Forgot Password</CardTitle>
                <CardDescription>Enter your email to receive a password reset link.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {successMessage && (
                        <Alert>
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    )}
                    {errorMessage && (
                        <Alert variant="destructive">
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || countdown > 0}
                    >
                        {isLoading ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Send Reset Link'}
                    </Button>
                </form>

                {successMessage && (
                    <div className="mt-4 text-sm text-gray-500 text-center">
                        Please be patient as the email may take a few minutes to arrive.
                        Check your spam folder if you don't see it in your inbox.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ForgotPassword;