'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileEditor } from './ProfileEditor'
import { TextEditor } from './TextEditor'

interface Profile {
    username: string
    avatar: string
    description: string
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile>({
        username: 'johndoe',
        avatar: 'https://github.com/shadcn.png',
        description: 'Welcome to my profile!'
    })
    const [isEditing, setIsEditing] = useState(false)

    const handleSave = (updatedProfile: Profile) => {
        setProfile(updatedProfile)
        setIsEditing(false)
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="view" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="view">View</TabsTrigger>
                        <TabsTrigger value="edit">Edit</TabsTrigger>
                    </TabsList>
                    <TabsContent value="view">
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="w-32 h-32">
                                <AvatarImage src={profile.avatar} alt={profile.username} />
                                <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-2xl font-bold">{profile.username}</h2>
                            <div className="prose max-w-none w-full" dangerouslySetInnerHTML={{ __html: profile.description }} />
                        </div>
                    </TabsContent>
                    <TabsContent value="edit">
                        <ProfileEditor profile={profile} onSave={handleSave} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}