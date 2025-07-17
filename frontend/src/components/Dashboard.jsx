import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import InvoiceChart from './InvoiceChart';
import ExpenseChart from './ExpenseChart';
import TopNav from './TopNav';
import '../styles/dashboard.css';

const Dashboard = () => {
    const [invoices, setInvoices] = useState([]);
    const [expenses, setExpenses] = useState([]);

    // Fetch invoices from backend
    const fetchInvoices = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/invoices/', {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setInvoices(res.data);
        } catch (err) {
            console.error('Failed to fetch invoices', err);
        }
    };

    // Fetch expenses from backend
    const fetchExpenses = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/expenses/', {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setExpenses(res.data);
        } catch (err) {
            console.error('Failed to fetch expenses', err);
        }
    };

    // Load data when component mounts
    useEffect(() => {
        fetchInvoices();
        fetchExpenses();
    }, []);

    // Get latest invoice and expense
    const latestInvoice = invoices[invoices.length - 1];
    const latestExpense = expenses[expenses.length - 1];

    return (
        <div className="dashboard-root">
            <TopNav />
            <div className="page-header dashboard-header-align">
                <h2 className="page-title">Dashboard</h2>
            </div>
            <div className="dashboard-main">
                {/* Summary Cards */}
                <div className="stat-cards">
                    <div className="stat-card">
                        <div className="stat-main">
                            ${invoices.reduce((sum, i) => sum + Number(i.amount), 0).toLocaleString()}
                        </div>
                        <div className="stat-label">Total Invoice Amount</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-main">
                            ${expenses.reduce((sum, e) => sum + Number(e.amount), 0).toLocaleString()}
                        </div>
                        <div className="stat-label">Total Expense Amount</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-main">{invoices.length}</div>
                        <div className="stat-label">Invoice Count</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-main">{expenses.length}</div>
                        <div className="stat-label">Expense Count</div>
                    </div>
                </div>
                {/* Charts */}
                <div className="summary-charts">
                    <div className="chart-box">
                        <h4>Invoice Summary</h4>
                        <div className="invoice-chart-wrapper">
                            <InvoiceChart data={invoices} />
                        </div>
                        {latestInvoice && (
                            <p>Latest: {latestInvoice.title} - ${latestInvoice.amount}</p>
                        )}
                    </div>
                    <div className="chart-box">
                        <h4>Expense Summary</h4>
                        <div className="expense-chart-wrapper">
                            <ExpenseChart data={expenses} />
                        </div>
                        {latestExpense && (
                            <p>Latest: {latestExpense.title} - ${latestExpense.amount}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
