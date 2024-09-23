import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CodeIcon, MenuIcon, XIcon } from '@heroicons/react/outline';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-orange-600 text-white">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-orange-200 hover:text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                            onClick={toggleMenu}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <XIcon className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="flex items-center">
                                <CodeIcon className="block h-8 w-auto" />
                                <span className="ml-2 text-xl font-bold hidden sm:block">OnlineJudge</span>
                            </Link>
                        </div>
                        <div className="hidden sm:block sm:ml-6">
                            <div className="flex space-x-4">
                                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-500">Home</Link>
                                <Link to="/problems" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-500">Problems</Link>
                                <Link to="/contests" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-500">Contests</Link>
                                <Link to="/leaderboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-500">Leaderboard</Link>
                                <Link to="/blog" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-500">Blog</Link>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-500 hidden sm:block">Log in</Link>
                        <Link to="/signup" className="ml-3 px-3 py-2 rounded-md text-sm font-medium bg-white text-orange-600 hover:bg-orange-100 hidden sm:block">Sign up</Link>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-500">Home</Link>
                    <Link to="/problems" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-500">Problems</Link>
                    <Link to="/contests" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-500">Contests</Link>
                    <Link to="/leaderboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-500">Leaderboard</Link>
                    <Link to="/blog" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-500">Blog</Link>
                    <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-orange-500">Log in</Link>
                    <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium bg-white text-orange-600 hover:bg-orange-100">Sign up</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;