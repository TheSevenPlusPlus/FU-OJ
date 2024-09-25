'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getProfile, updateProfile } from '../../api/profile';

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

export default function ProfileEdit() {
    const [profile, setProfile] = useState<UserProfile>({
        userName: "",
        email: "",
        phoneNumber: "",
        fullname: "",
        city: "",
        description: "",
        facebookLink: "",
        githubLink: "",
        school: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const userData = JSON.parse(localStorage.getItem('user') || '{}'); // Assuming user data is stored under the key 'user'
    const userName = userData.userName; // Extract userName

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await getProfile(userName);
                setProfile(profileData);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                setError("Failed to load profile. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value || "" }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error message before submitting

        try {
            const updatedData = await updateProfile(profile);
            console.log("Profile updated successfully:", updatedData);
            setSuccess("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile:", error);
            setError("Failed to update profile. Please try again.");
        }
    };

    // Show a loading message or a spinner while fetching
    if (loading) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && <div className="text-red-500">{error}</div>}
                    {success && <div className="text-green-500">{success}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="userName">Username</Label>
                            <Input disabled id="userName" name="userName" value={profile.userName} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullname">Full Name</Label>
                            <Input id="fullname" name="fullname" value={profile.fullname} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="school">School</Label>
                            <Input id="school" name="school" value={profile.school} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" value={profile.city} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" value={profile.description} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="facebookLink">Facebook Link</Label>
                            <Input id="facebookLink" name="facebookLink" value={profile.facebookLink} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="githubLink">GitHub Link</Label>
                            <Input id="githubLink" name="githubLink" value={profile.githubLink} onChange={handleChange} />
                        </div>
                        <Button type="submit">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
