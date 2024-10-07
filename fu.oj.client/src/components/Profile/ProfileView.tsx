"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Facebook,
    Github,
    MapPin,
    Mail,
    Phone,
    School,
    Calendar,
    Edit,
    Key,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getProfile } from "../../api/profile";
import { UserProfile } from "../../models/UserProfileModel";
import { getRole } from "../../api/general";
import { Helmet } from "react-helmet-async";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto p-4 text-center">
            <h1 className="text-4xl font-bold mb-4">404 - User Not Found</h1>
            <p className="text-xl mb-8">
                Sorry, the user you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/")}>Go to Home</Button>
        </div>
    );
}

export default function ProfileView() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userNotFound, setUserNotFound] = useState(false);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    const { userName: urlUserName } = useParams<{ userName?: string }>();
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const localUserName = userData?.userName;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            const targetUserName = urlUserName || localUserName;
            if (targetUserName) {
                try {
                    const fetchedProfile = await getProfile(targetUserName);
                    if (!fetchedProfile) {
                        setUserNotFound(true);
                        setLoading(false);
                        return;
                    }
                    const userRole = await getRole();

                    // Merge userRole into profile
                    const updatedProfile = {
                        ...fetchedProfile,
                        role: userRole,
                    };
                    setProfile(updatedProfile);
                    setIsOwnProfile(targetUserName === localUserName);
                } catch (err) {
                    if (
                        (err as any).response &&
                        (err as any).response.status === 404
                    ) {
                        setUserNotFound(true);
                    } else {
                        setError("Failed to load profile data.");
                        console.error(err);
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                setError("No username found in URL or local storage.");
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [urlUserName, localUserName]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (userNotFound) {
        return <NotFound />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!profile) {
        return <div>No profile data available.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Helmet>
                <title>Profile: {profile.userName || "User" }</title>
            </Helmet>
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
                        <Avatar className="w-24 h-24">
                            <AvatarImage
                                src={
                                    profile.avatarUrl ||
                                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD3OGZfe1nXAqGVpizYHrprvILILEvv1AyEA&s"
                                }
                                alt={profile.fullName}
                            />
                            <AvatarFallback>
                                {profile.fullName ? profile.fullName[0] : "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left flex-grow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl font-bold">
                                        {profile.fullName || "Unknown User"}
                                    </CardTitle>
                                    <p className="text-sm text-gray-500">
                                        @{profile.userName || "unknown"}
                                    </p>
                                    <Badge variant="secondary" className="mt-2">
                                        {profile.role || "User"}
                                    </Badge>
                                </div>
                                {isOwnProfile && (
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                navigate("/profile/edit")
                                            }
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                navigate("/changepassword")
                                            }
                                        >
                                            <Key className="w-4 h-4 mr-2" />
                                            Change Password
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-5 h-5 text-gray-500" />
                                    <span className="text-sm">
                                        {profile.email || "Email not provided"}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-5 h-5 text-gray-500" />
                                    <span className="text-sm">
                                        {profile.phoneNumber ||
                                            "No phone number available"}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-5 h-5 text-gray-500" />
                                    <span className="text-sm">
                                        {profile.city || "City not provided"}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <School className="w-5 h-5 text-gray-500" />
                                    <span className="text-sm">
                                        {profile.school ||
                                            "School not provided"}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-5 h-5 text-gray-500" />
                                    <span className="text-sm">
                                        {formatDate(profile.createdAt) ||
                                            "Join date not available"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                About
                            </h3>
                            <p className="text-sm text-gray-700">
                                {profile.description ||
                                    "No description available"}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                Social Links
                            </h3>
                            <div className="flex space-x-4">
                                {profile.facebookLink && (
                                    <a
                                        href={profile.facebookLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                                    >
                                        <Facebook className="w-5 h-5" />
                                        <span>Facebook</span>
                                    </a>
                                )}
                                {profile.githubLink && (
                                    <a
                                        href={profile.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                                    >
                                        <Github className="w-5 h-5" />
                                        <span>GitHub</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}