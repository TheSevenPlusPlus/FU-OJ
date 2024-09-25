import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TextEditor } from './TextEditor'

interface Profile {
    username: string
    avatar: string
    description: string
}

interface ProfileEditorProps {
    profile: Profile
    onSave: (profile: Profile) => void
}

export function ProfileEditor({ profile, onSave }: ProfileEditorProps) {
    const [editedProfile, setEditedProfile] = useState(profile)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value })
    }

    const handleDescriptionChange = (content: string) => {
        setEditedProfile({ ...editedProfile, description: content })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(editedProfile)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    name="username"
                    value={editedProfile.username}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                    id="avatar"
                    name="avatar"
                    value={editedProfile.avatar}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <TextEditor
                    content={editedProfile.description}
                    onChange={handleDescriptionChange}
                />
            </div>
            <Button type="submit">Save Changes</Button>
        </form>
    )
}