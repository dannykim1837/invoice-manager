import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InvoicePage from './components/InvoicePage';
import ExpensePage from './components/ExpensePage';
import RegisterPage from './components/Auth/RegisterPage';
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordResetConfirm from './components/PasswordResetConfirm';
import Profile from './components/Auth/Profile';
import './styles/siteStyle.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invoices" element={<InvoicePage />} />
        <Route path="/expenses" element={<ExpensePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/password-reset" element={<PasswordResetRequest />} />
        <Route path="/password-reset-confirm/:uid/:token" element={<PasswordResetConfirm />} />
      </Routes>
    </Router>
  );
};


export default App;
