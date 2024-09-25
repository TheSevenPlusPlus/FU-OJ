import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import '../index.css';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

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
                            <Button variant="outline" asChild className="mr-2 text-black">
                                <Link to="/login">Log in</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/signup">Sign up</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" onClick={toggleMenu}>
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
                                    <Button variant="outline" asChild className="w-full" onClick={toggleMenu}>
                                        <Link to="/login">Log in</Link>
                                    </Button>
                                    <Button asChild className="w-full" onClick={toggleMenu}>
                                        <Link to="/signup">Sign up</Link>
                                    </Button>
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