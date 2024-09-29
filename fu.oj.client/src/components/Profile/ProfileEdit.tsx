"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getProfile, updateProfile } from "../../api/profile";
import { UpdateUserProfile, UserProfile } from "../../models/UserProfileModel";

export default function ProfileEdit() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [updateData, setUpdateData] = useState<UpdateUserProfile>({
        userName: "",
        email: "",
        phoneNumber: "",
        fullName: "",
        city: "",
        description: "",
        facebookLink: "",
        githubLink: "",
        school: "",
        avatarUrl: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = userData.userName;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await getProfile(userName);
                setProfile(profileData);
                setUpdateData({
                    userName: profileData.userName,
                    email: profileData.email,
                    phoneNumber: profileData.phoneNumber,
                    fullName: profileData.fullName,
                    city: profileData.city,
                    description: profileData.description,
                    facebookLink: profileData.facebookLink,
                    githubLink: profileData.githubLink,
                    school: profileData.school,
                    avatarUrl: profileData.avatarUrl,
                });
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                setError("Failed to load profile. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userName]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setUpdateData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await updateProfile(updateData);
            setSuccess("Profile updated successfully!");
            navigate("/profile");
        } catch (error) {
            console.error("Failed to update profile:", error);
            setError("Failed to update profile. Please try again.");
        }
    };

    if (loading) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    if (!profile) {
        return <div className="container mx-auto p-4">Profile not found.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Edit Profile
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="userName">Username</Label>
                            <Input
                                disabled
                                id="userName"
                                name="userName"
                                value={profile.userName}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                value={updateData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={updateData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={updateData.fullName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="school">School</Label>
                            <Input
                                id="school"
                                name="school"
                                value={updateData.school}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                name="city"
                                value={updateData.city}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={updateData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="facebookLink">Facebook Link</Label>
                            <Input
                                id="facebookLink"
                                name="facebookLink"
                                value={updateData.facebookLink}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="githubLink">GitHub Link</Label>
                            <Input
                                id="githubLink"
                                name="githubLink"
                                value={updateData.githubLink}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="avatarUrl">Avatar URL</Label>
                            <Input
                                id="avatarUrl"
                                name="avatarUrl"
                                value={updateData.avatarUrl}
                                onChange={handleChange}
                            />
                        </div>
                        <Button type="submit">Save Changes</Button>
                        {success && (
                            <div className="text-green-500 mb-4">{success}</div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
