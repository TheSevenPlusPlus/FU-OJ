﻿import React from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MobileNavProps {
    isLoggedIn: boolean;
    isOpen: boolean;
    onToggle: () => void;
    onLogout: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({
    isLoggedIn,
    isOpen,
    onToggle,
    onLogout,
}) => {
    // We'll assume the user is not a manager or admin by default
    // You might want to add this information to your auth context or user state
    const isManagerOrAdmin = false;

    const handleClearLocalStorageAndNavigate = (path: string) => {
        localStorage.clear(); // Xóa toàn bộ localStorage
        window.location.href = path; // Điều hướng người dùng
    };

    return (
        <Sheet open={isOpen} onOpenChange={onToggle}>
            <SheetTrigger asChild>
                <Button
                    className="text-black md:hidden"
                    variant="outline"
                    size="icon"
                    onClick={onToggle}
                >
                    {isOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black text-white">
                <div className="flex flex-col space-y-4 mt-4">
                    <Link
                        to="/problems"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                        onClick={onToggle}
                    >
                        Problems
                    </Link>
                    <Link
                        to="/submissions/all"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                        onClick={onToggle}
                    >
                        Submissions
                    </Link>
                    <Link
                        to="/contests"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                        onClick={onToggle}
                    >
                        Contests
                    </Link>
                    <Link
                        to="/rank"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                        onClick={onToggle}
                    >
                        Leaderboard
                    </Link>
                    <Link
                        to="/blog"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                        onClick={onToggle}
                    >
                        Blog
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <Link
                                to="/profile"
                                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                                onClick={onToggle}
                            >
                                Profile
                            </Link>
                            <Link
                                to="/profile/edit"
                                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                                onClick={onToggle}
                            >
                                Edit Profile
                            </Link>
                            {isManagerOrAdmin && (
                                <>
                                    <Link
                                        to="/manager/problems"
                                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                                        onClick={onToggle}
                                    >
                                        Problem Management
                                    </Link>
                                    <Link
                                        to="/manager/blogs"
                                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                                        onClick={onToggle}
                                    >
                                        Blog Management
                                    </Link>
                                    <Link
                                        to="/manager/contests"
                                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                                        onClick={onToggle}
                                    >
                                        Contest Management
                                    </Link>
                                    <Link
                                        to="/manager/users"
                                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                                        onClick={onToggle}
                                    >
                                        User Management
                                    </Link>
                                </>
                            )}
                            <Button
                                variant="outline"
                                className="text-black w-full"
                                onClick={() => {
                                    onLogout();
                                    onToggle();
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                className="text-black w-full"
                                onClick={() => handleClearLocalStorageAndNavigate("/login")}
                            >
                                Log in
                            </Button>
                            <Button
                                className="w-full"
                                onClick={() => handleClearLocalStorageAndNavigate("/register")}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MobileNav;
