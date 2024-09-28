'use client'

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UserForm } from './UserForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Toast } from './Toast'
import { createUser } from '../../../api/user'
import { CreateUserRequest } from '../../../models/UserDTO'

export default function CreateUser() {
    const navigate = useNavigate()
    const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null)

    const showToast = (message: string, type: 'success' | 'error'): void => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const handleCreateUser = async (userData: CreateUserRequest): Promise<void> => {
        try {
            await createUser(userData)
            showToast("User created successfully.", "success")
            setTimeout(() => navigate('/manager/users'), 1000)
        } catch (err) {
            showToast("Failed to create user. Please try again.", "error")
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Create New User</CardTitle>
            </CardHeader>
            <CardContent>
                <UserForm
                    onSubmit={handleCreateUser}
                    onCancel={() => navigate('/manager/users')}
                />
                {toast && <Toast message={toast.message} type={toast.type} />}
            </CardContent>
        </Card>
    )
}