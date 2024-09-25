import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code, Menu, X, User, LogOut, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
    userName: string;
    email: string,
    token: string,
}

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        // Add any additional logout logic here (e.g., redirecting to home page)
    };

    return (
        <nav className="bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <Code className="h-8 w-8" />
                            <span className="ml-1 text-xl font-bold">FPTU Online Judge</span>
                        </Link>
                        <div className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-4">
                                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Home</Link>
                                <Link to="/problems" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Problems</Link>
                                <Link to="/submissions" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Submissions</Link>
                                <Link to="/contests" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Contests</Link>
                                <Link to="/leaderboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Leaderboard</Link>
                                <Link to="/blog" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Blog</Link>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center space-x-2">
                                            <Avatar className="w-8 h-8 mr-2">
                                                <AvatarImage className="rounded-full" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD3OGZfe1nXAqGVpizYHrprvILILEvv1AyEA&s"} alt={user.userName} />
                                                <AvatarFallback>{user.userName[0].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span>{user.userName}</span>
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
                                        <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button className="text-black" variant="outline" size="icon" onClick={toggleMenu}>
                                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-black text-white">
                                <div className="flex flex-col space-y-4 mt-4">
                                    <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800" onClick={toggleMenu}>Home</Link>
                                    <Link to="/problems" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800" onClick={toggleMenu}>Problems</Link>
                                    <Link to="/contests" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800" onClick={toggleMenu}>Contests</Link>
                                    <Link to="/leaderboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800" onClick={toggleMenu}>Leaderboard</Link>
                                    <Link to="/blog" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800" onClick={toggleMenu}>Blog</Link>
                                    {user ? (
                                        <>
                                            <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800" onClick={toggleMenu}>Profile</Link>
                                            <Link to="/profile/edit" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800" onClick={toggleMenu}>Edit Profile</Link>
                                            <Button variant="outline" className="text-black w-full" onClick={() => { handleLogout(); toggleMenu(); }}>
                                                Logout
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="outline" asChild className="text-black w-full" onClick={toggleMenu}>
                                                <Link to="/login">Log in</Link>
                                            </Button>
                                            <Button asChild className="w-full" onClick={toggleMenu}>
                                                <Link to="/register">Register</Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;