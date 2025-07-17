import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

const AddExpense = ({ onAdd, className }) => {
    const [form, setForm] = useState({
        title: '',
        amount: '',
        category: '',
        date: '',
    });

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = getToken();
        if (!token) {
            setError('Token is missing. Please log in again.');
            return;
        }

        try {
            await axios.post(
                'http://127.0.0.1:8000/api/expenses/',
                {
                    ...form,
                    amount: parseFloat(form.amount),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            onAdd();
            setForm({ title: '', amount: '', category: '', date: '' });
            setError('');
        } catch (err) {
            setError(`Failed to add expense: ${err.response?.data?.detail || 'Server error'}`);
        }
    };

    return (
        <form className={`add-expense-form-horizontal ${className || ''}`} onSubmit={handleSubmit}>
            <input
                placeholder="Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
            />
            <input
                placeholder="Amount"
                type="number"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                required
            />
            <input
                placeholder="Category"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
            />
            <input
                placeholder="Date"
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
            />
            <button type="submit">Add</button>
            {error && <div className="add-expense-error">{error}</div>}
        </form>
    );
};

export default AddExpense;
