'use client'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from './AuthForm'

export default function AuthPage() {
    const navigate = useNavigate()

    useEffect(() => {
        // Check if user is already logged in
        const user = localStorage.getItem('user')
        if (user) {
            navigate('/')
        }
    }, [navigate])

    const additionalFields = [
        { name: 'fullName', label: 'Full Name' },
        //{ name: 'phoneNumber', label: 'Phone Number' },
    ]

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <AuthForm additionalFields={additionalFields} />
        </div>
    )
}