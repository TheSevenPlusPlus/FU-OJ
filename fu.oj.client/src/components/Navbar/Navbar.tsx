import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import UserMenu from "./UserMenu";
import MobileNav from "./MobileNav";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/");
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="bg-black text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Logo />
                        <DesktopNav />
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {isLoggedIn ? (
                                <UserMenu onLogout={handleLogout} />
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        asChild
                                        className="mr-2 bg-white text-black hover:bg-gray-200"
                                    >
                                        <Link to="/login">Log in</Link>
                                    </Button>
                                    <Button asChild className="bg-white text-black hover:bg-gray-200">
                                        <Link to="/register">Register</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    <MobileNav
                        isLoggedIn={isLoggedIn}
                        isOpen={isOpen}
                        onToggle={toggleMenu}
                        onLogout={handleLogout}
                    />
                </div>
            </div>
        </div>
    );
}