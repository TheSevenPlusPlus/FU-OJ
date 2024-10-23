import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ManagerMenu from "./ManagerMenu";
import { getProfileByToken } from "../../api/profile";
import { getRole } from "../../api/general";

interface UserMenuProps {
    onLogout: () => void;
}

interface ExtendedUser {
    userName: string;
    email: string;
    avatarUrl: string;
    role?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ onLogout }) => {
    const [extendedUser, setExtendedUser] = useState<ExtendedUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const profileResponse = await getProfileByToken();
                if (profileResponse) {
                    const roleResponse = await getRole(profileResponse.userName);

                    const updatedUser: ExtendedUser = {
                        userName: profileResponse.userName,
                        email: profileResponse.email,
                        avatarUrl: profileResponse.avatarUrl,
                        role: roleResponse,
                    };
                    setExtendedUser(updatedUser);
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                // Handle error (e.g., redirect to login if token is invalid)
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Or a more sophisticated loading spinner
    }

    if (!extendedUser) {
        return null; // Or handle this case differently (e.g., show login button)
    }

    const isManagerOrAdmin = extendedUser.role === "Admin" || extendedUser.role === "Manager";
    const isManager = extendedUser.role === "Manager";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8 mr-2">
                        <AvatarImage
                            className="rounded-full"
                            src={
                                extendedUser.avatarUrl ||
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD3OGZfe1nXAqGVpizYHrprvILILEvv1AyEA&s"
                            }
                            alt={extendedUser.userName}
                        />
                        <AvatarFallback>
                            {extendedUser.userName[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span>{extendedUser.userName}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to="/profile/edit" className="flex items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit Profile</span>
                    </Link>
                </DropdownMenuItem>
                {isManagerOrAdmin && <ManagerMenu isManager={isManager} />}
                <DropdownMenuItem
                    onClick={onLogout}
                    className="flex items-center"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserMenu;