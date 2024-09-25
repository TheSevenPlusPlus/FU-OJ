import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Profile {
    username: string
    avatar: string
    description: string
}

interface PublicProfilePageProps {
    profile: Profile
}

export default function PublicProfilePage({ profile }: PublicProfilePageProps) {
    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32">
                        <AvatarImage src={profile.avatar} alt={profile.username} />
                        <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold">{profile.username}</h2>
                    <div className="prose max-w-none w-full" dangerouslySetInnerHTML={{ __html: profile.description }} />
                </div>
            </CardContent>
        </Card>
    )
}