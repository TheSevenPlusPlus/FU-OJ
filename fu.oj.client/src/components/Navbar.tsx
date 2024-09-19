// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">Logo</Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/problems">Problems</Link></li>
                <li><Link to="/submission">Submission</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/documents">Documents</Link></li>
                <li><Link to="/usermanager">UserManager</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
