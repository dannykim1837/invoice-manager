import React, { useState } from 'react';
import axios from 'axios';
import '../styles/loginStyle.css';
import { Link } from 'react-router-dom';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await axios.post('http://127.0.0.1:8000/api/password-reset/', { email });
      setMessage('If your email exists in our system, you will receive a password reset email shortly.');
    } catch (err) {
      setError('Failed to send reset email. Please try again later.');
    }
  };

  return (
    <section id="login-page">
      <form className="bordered-form" onSubmit={handleSubmit}>
        <h2>Password Reset</h2>

        <label htmlFor="email">Email</label>
        <input
          className="form-text-input"
          id="email"
          name="email"
          type="email"
          placeholder="your-email@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <button className="form-button" type="submit">Send Reset Email</button>

        {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <div className="center-text" style={{ marginTop: '15px' }}>
          <Link className="fake-link" to="/login">Back to Login</Link>
        </div>
      </form>
    </section>
  );
};

export default PasswordResetRequest;
