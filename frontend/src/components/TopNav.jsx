import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const TopNav = () => {
    // User info state
    const [loginUser, setLoginUser] = useState(null);
    useEffect(() => {
        try {
            const u = JSON.parse(localStorage.getItem('user'));
            setLoginUser(u);
        } catch { }
    }, []);

    // Hamburger menu
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    // Profile dropdown menu
    const [dropdown, setDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Dropdown outside click close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdown(false);
            }
        };
        if (dropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdown]);

    // Dropdown menu action
    const handleProfileClick = () => setDropdown((prev) => !prev);
    const handleGoProfile = () => {
        navigate('/profile');
        setDropdown(false);
        setOpen(false);
    };
    const handleLogout = () => {
        logout();
        setDropdown(false);
        setOpen(false);
    };

    return (
        <nav className="top-nav">
            {/* Left: nav menu */}
            <div className="nav-left">
                <button className="hamburger" onClick={() => setOpen(!open)}>
                    {open ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
                <ul className={`nav-links ${open ? 'open' : ''}`}>
                    <li><Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link></li>
                    <li><Link to="/invoices" onClick={() => setOpen(false)}>Invoices</Link></li>
                    <li><Link to="/expenses" onClick={() => setOpen(false)}>Expenses</Link></li>
                </ul>
            </div>
            {/* Right: welcome, profile dropdown */}
            <div className="nav-right">
                {loginUser && (
                    <div className="nav-username">
                        <span>Welcome, <b>{loginUser.username || loginUser.email || loginUser.id}</b></span>
                    </div>
                )}
                <div className="profile-icon" ref={dropdownRef}>
                    <div onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                        <FaUserCircle size={32} />
                    </div>
                    {dropdown && (
                        <div className="profile-dropdown">
                            <button onClick={handleGoProfile}>Profile</button>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default TopNav;
