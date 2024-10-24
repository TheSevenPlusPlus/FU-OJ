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
import parseJwt from "../../api/parseJWT";

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

    // Hàm lấy thông tin user từ token khi người dùng đăng nhập lần đầu
    const fetchUserDataFromToken = () => {
        console.log("Co fetch khong?");
        const token = localStorage.getItem("token");
        if (token) {
            const parsedToken = parseJwt(token);
            if (parsedToken) {
                const updatedUser: ExtendedUser = {
                    userName: parsedToken.given_name,
                    email: parsedToken.email,
                    avatarUrl: parsedToken.AvatarUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD3OGZfe1nXAqGVpizYHrprvILILEvv1AyEA&s",
                    role: parsedToken.role,
                };
                // Lưu user vào state và localStorage lần đầu
                setExtendedUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }
        }
    };

    // Hàm cập nhật user từ localStorage khi có thay đổi sau khi đăng nhập
    const fetchUserDataFromLocalStorage = () => {
        const user = localStorage.getItem("user");
        if (user) {
            setExtendedUser(JSON.parse(user));
        }
    };

    useEffect(() => {
        // Chạy lần đầu khi component mount để lấy từ token
        fetchUserDataFromToken();
        setIsLoading(false);

        // Sau đó lắng nghe thay đổi của localStorage
        const handleStorageChange = () => {
            fetchUserDataFromLocalStorage();
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!extendedUser) {
        return null; // Hoặc xử lý khác nếu không có user
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
                            src={extendedUser.avatarUrl}
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
                <DropdownMenuItem onClick={onLogout} className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserMenu;
