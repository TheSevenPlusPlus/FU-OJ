'use client'

import { useState, useEffect } from 'react'
import { User, Facebook, Github, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getProfile } from '../../api/profile'
interface UserProfile {
    userName: string;
    email: string;
    phoneNumber: string;
    fullname: string;
    city: string;
    description: string;
    facebookLink: string;
    githubLink: string;
    school: string;
}

export default function ProfileView() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get user data from local storage
    const userData = JSON.parse(localStorage.getItem('user') || '{}'); // Assuming user data is stored under the key 'user'
    const userName = userData.userName; // Extract userName

    useEffect(() => {
        const fetchProfileData = async () => {
            if (userName) {
                try {
                    const fetchedProfile = await getProfile(userName);  // Fetch from backend
                    setProfile(fetchedProfile);
                } catch (err) {
                    setError("Failed to load profile data.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setError("No username found in local storage.");
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [userName]);  // Dependency on userName

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!profile) {
        return <div>No profile data available.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src="https://github.com/shadcn.png" alt={profile.fullname} />
                            <AvatarFallback>{profile.fullname ? profile.fullname[0] : 'U'}</AvatarFallback> {/* Fallback character */}
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl font-bold">{profile.fullname || 'Unknown User'}</CardTitle> {/* Default if fullname is empty */}
                            <p className="text-sm text-gray-500">@{profile.userName || 'unknown'}</p> {/* Default if userName is empty */}
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        <p className="text-lg italic">&quot;{profile.school}&quot;</p>
                        <div className="flex items-center space-x-2">
                            <User className="w-5 h-5 text-gray-500" />
                            <span>{profile.phoneNumber}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <span>{profile.city}</span>
                        </div>
                        <p>{profile.description}</p>
                        <div className="flex space-x-4">
                            <a href={profile.facebookLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                                <Facebook className="w-5 h-5" />
                                <span>Facebook</span>
                            </a>
                            <a href={profile.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                                <Github className="w-5 h-5" />
                                <span>GitHub</span>
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
