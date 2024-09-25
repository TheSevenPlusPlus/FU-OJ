'use client'

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { registerUser, loginUser } from '../api/auth' // Adjust the import based on your file structure

interface RegisterProps {
    additionalFields: { name: string; label: string }[]
}

export default function AuthForm({ additionalFields = [] }: RegisterProps) {
    const [activeTab, setActiveTab] = useState<string>("login")
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
    })

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // Check if user is already logged in
        const user = localStorage.getItem('user')
        if (user) {
            navigate('/')
            return
        }

        // Set active tab based on the current path
        if (location.pathname === '/login') {
            setActiveTab('login')
        } else if (location.pathname === '/register') {
            setActiveTab('register')
        }
    }, [location, navigate])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prevData) => ({ ...prevData, [name]: value }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
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
                // Handle error (e.g., show error message)
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
                // Handle error (e.g., show error message)
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
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="login-password">Password</Label>
                                <Input
                                    id="login-password"
                                    name="password"
                                    type="password"
                                    required
                                    onChange={handleInputChange}
                                />
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
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="register-email">Email</Label>
                                <Input
                                    id="register-email"
                                    name="email"
                                    type="email"
                                    required
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="register-password">Password</Label>
                                <Input
                                    id="register-password"
                                    name="password"
                                    type="password"
                                    required
                                    onChange={handleInputChange}
                                />
                            </div>
                            {additionalFields.map((field, index) => (
                                <div key={index} className="space-y-1">
                                    <Label htmlFor={`register-${field.name}`}>{field.label}</Label>
                                    <Input
                                        id={`register-${field.name}`}
                                        name={field.name}
                                        type="text"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Register</Button>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>
        </Tabs>
    )
}