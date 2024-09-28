import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { UserView, CreateUserRequest, UpdateUserRequest } from '../../../models/UserDTO'

interface UserFormProps {
    user?: UserView | null
    onSubmit: (user: CreateUserRequest | UpdateUserRequest) => Promise<void>
    onCancel: () => void
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
    const [formData, setFormData] = useState<CreateUserRequest | UpdateUserRequest>({
        userName: '',
        email: '',
        phoneNumber: '',
        fullName: '',
        password: '',
        city: '',
        description: '',
        facebookLink: '',
        githubLink: '',
        school: '',
        avatarUrl: '',
    })

    useEffect(() => {
        if (user) {
            setFormData({ ...user, password: '' })
        }
    }, [user])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="userName">Username</Label>
                <Input
                    id="userName"
                    name="userName"
                    disabled
                    value={formData.userName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
            </div>
            {!user && (
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
            )}
            <div>
                <Label htmlFor="city">City</Label>
                <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label htmlFor="facebookLink">Facebook Link</Label>
                <Input
                    id="facebookLink"
                    name="facebookLink"
                    value={formData.facebookLink}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label htmlFor="githubLink">GitHub Link</Label>
                <Input
                    id="githubLink"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label htmlFor="school">School</Label>
                <Input
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                    id="avatarUrl"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                />
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">{user ? 'Update' : 'Create'} User</Button>
            </div>
        </form>
    )
}