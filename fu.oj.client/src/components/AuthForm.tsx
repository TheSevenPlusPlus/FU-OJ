'use client'

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerUser, loginUser } from '../api/auth' // Adjust the import based on your file structure

interface RegisterProps {
    additionalFields: { name: string; label: string }[]
}

interface FormErrors {
    [key: string]: string
}

export default function AuthForm({ additionalFields = [] }: RegisterProps) {
    const [activeTab, setActiveTab] = useState<string>("login")
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phoneNumber: '',
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [submitError, setSubmitError] = useState<string | null>(null)

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user) {
            navigate('/')
            return
        }

        if (location.pathname === '/login') {
            setActiveTab('login')
        } else if (location.pathname === '/register') {
            setActiveTab('register')
        }
    }, [location, navigate])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prevData) => ({ ...prevData, [name]: value }))
        // Clear the error for this field when the user starts typing
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }))
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Password validation regex (same as before)
        const passwordRegex = {
            lowerCase: /[a-z]/,
            upperCase: /[A-Z]/,
            number: /\d/,
            specialChar: /[!@#$%^&*(),.?":{}|<>]/
        };

        if (activeTab === 'login') {
            if (!formData.username.trim()) newErrors.username = 'Username is required';
            if (!formData.password) newErrors.password = 'Password is required';
        } else {
            if (!formData.username.trim()) newErrors.username = 'Username is required';
            if (!formData.email.trim()) newErrors.email = 'Email is required';
            if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
            if (!formData.password) newErrors.password = 'Password is required';
            if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
            if (!passwordRegex.lowerCase.test(formData.password)) newErrors.password = 'Password must include at least one lowercase letter';
            if (!passwordRegex.upperCase.test(formData.password)) newErrors.password = 'Password must include at least one uppercase letter';
            if (!passwordRegex.number.test(formData.password)) newErrors.password = 'Password must include at least one number';
            if (!passwordRegex.specialChar.test(formData.password)) newErrors.password = 'Password must include at least one special character';
            if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
            if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone Number is required';
            if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Phone Number must be 10 digits';

            // Confirm password check
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }



    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitError(null)

        if (!validateForm()) {
            return
        }

        if (activeTab === "login") {
            try {
                const data = await loginUser({
                    username: formData.username,
                    password: formData.password
                })
                console.log('Login successful:', data)
                localStorage.setItem('user', JSON.stringify(data))
                navigate('/')
                navigate(0) // Reload
            } catch (error) {
                console.error('Login failed:', error.response?.data || error.message)
                setSubmitError('Login failed. Please check your credentials and try again.')
            }
        } else if (activeTab === "register") {
            try {
                const data = await registerUser({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    phoneNumber: formData.phoneNumber,
                })
                console.log('Registration successful:', data)
                localStorage.setItem('user', JSON.stringify(data))
                navigate('/')
                navigate(0) // Reload
            } catch (error) {
                console.error('Registration failed:', error.response?.data || error.message)
                setSubmitError('Registration failed. Please try again later.')
            }
        }
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                <Card>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Enter your credentials to access your account.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="login-username">Username</Label>
                                <Input
                                    id="login-username"
                                    name="username"
                                    type="text"
                                    required
                                    onChange={handleInputChange}
                                    className={errors.username ? 'border-red-500' : ''}
                                />
                                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="login-password">Password</Label>
                                <Input
                                    id="login-password"
                                    name="password"
                                    type="password"
                                    required
                                    onChange={handleInputChange}
                                    className={errors.password ? 'border-red-500' : ''}
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Login</Button>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>
            <TabsContent value="register">
                <Card>
                    <CardHeader>
                        <CardTitle>Register</CardTitle>
                        <CardDescription>Create a new account to get started.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="register-username">Username</Label>
                                <Input
                                    id="register-username"
                                    name="username"
                                    type="text"
                                    required
                                    onChange={handleInputChange}
                                    className={errors.username ? 'border-red-500' : ''}
                                />
                                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="register-email">Email</Label>
                                <Input
                                    id="register-email"
                                    name="email"
                                    type="email"
                                    required
                                    onChange={handleInputChange}
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="register-password">Password</Label>
                                <Input
                                    id="register-password"
                                    name="password"
                                    type="password"
                                    required
                                    onChange={handleInputChange}
                                    className={errors.password ? 'border-red-500' : ''}
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="register-confirm-password">Confirm Password</Label>
                                <Input
                                    id="register-confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    onChange={handleInputChange}
                                    className={errors.confirmPassword ? 'border-red-500' : ''}
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                            </div>
                            {additionalFields.map((field, index) => (
                                <div key={index} className="space-y-1">
                                    <Label htmlFor={`register-${field.name}`}>{field.label}</Label>
                                    <Input
                                        id={`register-${field.name}`}
                                        name={field.name}
                                        type="text"
                                        onChange={handleInputChange}
                                        className={errors[field.name] ? 'border-red-500' : ''}
                                    />
                                    {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Register</Button>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>
            {submitError && (
                <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{submitError}</AlertDescription>
                </Alert>
            )}
        </Tabs>
    )
}