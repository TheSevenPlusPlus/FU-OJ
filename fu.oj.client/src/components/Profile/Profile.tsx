"use client";

import { useState, useEffect } from "react";
import {
  Facebook,
  Github,
  MapPin,
  Mail,
  Phone,
  School,
  User,
  Briefcase,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProfile } from "../../api/profile";
import { UserProfile } from "../../models/UserProfileModel";

export default function ProfileView() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = userData?.userName;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (userName) {
        try {
          //console.log(userData);
          const fetchedProfile = await getProfile(userName);
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
  }, [userName]);

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
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD3OGZfe1nXAqGVpizYHrprvILILEvv1AyEA&s"
                alt={profile.fullname}
              />
              <AvatarFallback>
                {profile.fullname ? profile.fullname[0] : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <CardTitle className="text-2xl font-bold">
                {profile.fullname || "Unknown User"}
              </CardTitle>
              <p className="text-sm text-gray-500">
                @{profile.userName || "unknown"}
              </p>
              {/*<Badge variant="secondary" className="mt-2">{profile.role || 'User'}</Badge>*/}
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
                    {profile.phoneNumber || "No phone number available"}
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
                    {profile.school || "School not provided"}
                  </span>
                </div>
                {/*<div className="flex items-center space-x-2">*/}
                {/*    <Calendar className="w-5 h-5 text-gray-500" />*/}
                {/*    <span className="text-sm">{profile.joinDate || "Join date not available"}</span>*/}
                {/*</div>*/}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-sm text-gray-700">
                {profile.description || "No description available"}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-2">Social Links</h3>
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
