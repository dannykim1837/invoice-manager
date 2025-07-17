import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const TopNav = () => {
    const [loginUser, setLoginUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setLoginUser(JSON.parse(storedUser));
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdown(false);
            }
        };
        if (dropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdown]);

    const handleLogout = () => {
        logout();
        setDropdown(false);
        setOpen(false);
    };

    return (
        <nav className="top-nav">
            {/* Left: nav menu */}
            <div className="nav-left">
                <button
                    className="hamburger"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle navigation menu"
                >
                    {open ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
                <ul className={`nav-links ${open ? 'open' : ''}`}>
                    <li><Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link></li>
                    <li><Link to="/invoices" onClick={() => setOpen(false)}>Invoices</Link></li>
                    <li><Link to="/expenses" onClick={() => setOpen(false)}>Expenses</Link></li>
                </ul>
            </div>

            {/* Right: user info + profile dropdown */}
            <div className="nav-right">
                {loginUser && (
                    <div className="nav-username">
                        <span>
                            Welcome, <b>{loginUser.username || loginUser.email || loginUser.id}</b>
                        </span>
                    </div>
                )}
                <div className="profile-icon" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdown((prev) => !prev)}
                        className="profile-toggle-btn"
                        aria-label="Open profile menu"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <FaUserCircle size={32} />
                    </button>
                    {dropdown && (
                        <div className="profile-dropdown">
                            <button onClick={() => { navigate('/profile'); setDropdown(false); setOpen(false); }}>
                                Profile
                            </button>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default TopNav;
