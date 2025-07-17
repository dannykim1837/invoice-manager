import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/auth';
import TopNav from '../TopNav';

const Profile = () => {
    // Local states
    const [user, setUser] = useState(null);
    const [loginUser, setLoginUser] = useState(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [message, setMessage] = useState('');

    // Load login user from localStorage
    useEffect(() => {
        try {
            const u = JSON.parse(localStorage.getItem('user'));
            setLoginUser(u);
        } catch { }
    }, []);

    // Fetch user info
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/user/', {
            headers: { Authorization: `Bearer ${getToken()}` }
        })
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    // Password change handler
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== newPassword2) {
            setMessage('New passwords do not match.');
            return;
        }
        try {
            await axios.post('http://127.0.0.1:8000/api/change-password/', {
                old_password: oldPassword,
                new_password: newPassword
            }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setMessage('Password changed successfully.');
            setOldPassword('');
            setNewPassword('');
            setNewPassword2('');
        } catch {
            setMessage('Failed to change password.');
        }
    };

    return (
        <>
            <TopNav />
            <div className="profile-outer">
                <div className="bordered-form profile-form">
                    {/* Avatar */}
                    <div className="center-image-container">
                        <span className="profile-avatar">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                                alt="User"
                                className="circle-image"
                                width="82"
                                height="82"
                            />
                        </span>
                    </div>

                    {/* Welcome message */}
                    {loginUser && (
                        <div className="center-text" style={{ fontWeight: 'bold', marginBottom: 12, fontSize: 18 }}>
                            Welcome, {loginUser.username || loginUser.email || loginUser.id}!
                        </div>
                    )}

                    {/* Profile info */}
                    <h2>Profile</h2>
                    {user && (
                        <div className="user-info left-align-text">
                            <p><b>User ID:</b> {user.id}</p>
                            <p><b>Email:</b> {user.email}</p>
                            <p><b>Name:</b> {user.name}</p>
                        </div>
                    )}

                    {/* Password change form */}
                    <h3 style={{ textAlign: 'center', marginTop: 30 }}>Change Password</h3>
                    <form className="change-password-form" onSubmit={handlePasswordChange}>
                        <input
                            className="form-text-input"
                            type="password"
                            placeholder="Current password"
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
                            required
                        />
                        <input
                            className="form-text-input"
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                        />
                        <input
                            className="form-text-input"
                            type="password"
                            placeholder="Confirm new password"
                            value={newPassword2}
                            onChange={e => setNewPassword2(e.target.value)}
                            required
                        />
                        <button className="form-button" type="submit">Change Password</button>
                    </form>
                    {message && <p className="change-password-message center-text">{message}</p>}
                </div>
            </div>
        </>
    );
};

export default Profile;
