import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

const AddInvoice = ({ onAdd }) => {
    const [form, setForm] = useState({
        title: '',
        client: '',
        amount: '',
        due_date: '',
        status: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        if (!token) {
            setError('No token found. Please login again.');
            return;
        }
        try {
            await axios.post('http://127.0.0.1:8000/api/invoices/', form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setForm({ title: '', client: '', amount: '', due_date: '', status: '' });
            setError('');
            if (onAdd) onAdd();
        } catch (err) {
            setError('Failed to add invoice.');
        }
    };

    return (
        <form className="add-invoice-form-horizontal" onSubmit={handleSubmit} autoComplete="off">
            <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                required
            />
            <input
                name="client"
                placeholder="Client"
                value={form.client}
                onChange={handleChange}
                required
            />
            <input
                name="amount"
                placeholder="Amount"
                type="number"
                min="0"
                value={form.amount}
                onChange={handleChange}
                required
            />
            <input
                name="due_date"
                placeholder="Due Date"
                type="date"
                value={form.due_date}
                onChange={handleChange}
                required
            />
            <input
                name="status"
                placeholder="Status"
                value={form.status}
                onChange={handleChange}
            />
            <button type="submit">Add</button>
            {error && <p className="add-invoice-error">{error}</p>}
        </form>
    );
};

export default AddInvoice;
