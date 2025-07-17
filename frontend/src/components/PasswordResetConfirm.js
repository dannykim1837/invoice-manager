import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../styles/loginStyle.css';

const PasswordResetConfirm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await axios.post(`http://127.0.0.1:8000/api/password-reset-confirm/${uid}/${token}/`, { new_password: newPassword });
      setMessage('Password has been reset successfully.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError('Invalid or expired link. Please try resetting your password again.');
    }
  };

  return (
    <section id="login-page">
      <form className="bordered-form" onSubmit={handleSubmit}>
        <h2>Set New Password</h2>

        <label htmlFor="new-password">New Password</label>
        <input
          className="form-text-input"
          id="new-password"
          name="new-password"
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />

        <button className="form-button" type="submit">Reset Password</button>

        {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <div className="center-text" style={{ marginTop: '15px' }}>
          <Link className="fake-link" to="/login">Back to Login</Link>
        </div>
      </form>
    </section>
  );
};

export default PasswordResetConfirm;
