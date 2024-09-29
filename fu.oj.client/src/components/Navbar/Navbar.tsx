import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import DesktopNav from './DesktopNav';
import UserMenu from './UserMenu';
import MobileNav from './MobileNav';
import { getProfile } from '../../api/profile';
import { getRole } from '../../api/general';

interface User {
    userName: string;
    email: string;
    token: string;
    avatarUrl: string;
    role?: string;
}

const Navbar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser: User = JSON.parse(storedUser);
            if (parsedUser.userName) {
                fetchUserProfile(parsedUser.userName, parsedUser.token);
            }
            else setUser(parsedUser);
        }
    }, []);

    const fetchUserProfile = async (userName: string, token: string) => {
        try {
            const response = await getProfile(userName);
            const userRole = await getRole(userName);
            if (response) {
                const updatedUser: User = {
                    userName: response.userName,
                    email: response.email,
                    token: token,
                    avatarUrl: response.avatarUrl,
                    role: userRole,
                };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } else {
                console.error('Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Logo />
                        <DesktopNav />
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {user ? (
                                <UserMenu user={user} onLogout={handleLogout} />
                            ) : (
                                <>
                                    <Button variant="outline" asChild className="mr-2 text-black">
                                        <Link to="/login">Log in</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link to="/register">Register</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    <MobileNav user={user} isOpen={isOpen} onToggle={toggleMenu} onLogout={handleLogout} />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;