import React from 'react';
import { Link } from 'react-router-dom';

const DesktopNav: React.FC = () => {
    return (
        <div className="hidden md:block ml-10">
            <div className="flex items-baseline space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Home</Link>
                <Link to="/problems" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Problems</Link>
                <Link to="/submissions" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Submissions</Link>
                <Link to="/contests" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Contests</Link>
                <Link to="/rank" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Rank</Link>
                <Link to="/blog" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Blog</Link>
            </div>
        </div>
    );
};

export default DesktopNav;