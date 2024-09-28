import React, { useEffect, useState } from 'react'

interface ToastProps {
    message: string
    type: 'success' | 'error'
}

export function Toast({ message, type }: ToastProps) {
    const [isVisible, setIsVisible] = useState<boolean>(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    if (!isVisible) return null

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'

    return (
        <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg`}>
            {message}
        </div>
    )
}