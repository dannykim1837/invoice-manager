import React, { useState } from 'react';
import { api } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import '../../styles/siteStyle.css';
import '../../styles/registerStyle.css';

const RegisterPage = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await api.post('/accounts/register/', {
                username: form.username,
                email: form.email,
                password: form.password
            });

            if (response.status === 201 || response.status === 200) {
                alert('Registration successful!');
                navigate('/');
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Something went wrong.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Create an Account</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Sign Up</button>
                {error && <p className="error-msg">{error}</p>}
            </form>
        </div>
    );
};

export default RegisterPage;
