import React, { useEffect, useState } from 'react';
import TopNav from '../components/TopNav';
import ExpenseChart from '../components/ExpenseChart';
import AddExpense from '../components/AddExpense';
import { deleteItem } from '../utils/api';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { usePaginationList } from '../components/usePaginationList';
import { exportToCSV } from '../utils/exportToCSV';
import ReusableReceiptGallery from './ExpenseReceiptGallery';
import '../styles/expensepage.css';

const ExpensePage = () => {
    const [expenses, setExpenses] = useState([]);
    const [search, setSearch] = useState('');
    const itemsPerPage = 5;

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

    useEffect(() => {
        fetchExpenses();
    }, []);

    // Search and pagination logic
    const filterFn = (exp) =>
        exp.title.toLowerCase().includes(search.toLowerCase()) ||
        exp.category.toLowerCase().includes(search.toLowerCase());

    const { pagedList, totalPages, currentPage, setCurrentPage } = usePaginationList(
        expenses,
        itemsPerPage,
        search,
        filterFn,
        'date'
    );

    const handleAddExpense = async () => {
        await fetchExpenses();
        setTimeout(() => {
            const newTotalPages = Math.max(1, Math.ceil((expenses.length + 1) / itemsPerPage));
            setCurrentPage(newTotalPages);
        }, 50);
    };

    const handleDeleteExpense = async (id) => {
        if (!window.confirm('Delete this expense?')) return;
        const ok = await deleteItem(`http://127.0.0.1:8000/api/expenses/${id}/`);
        if (ok) {
            setExpenses(expenses.filter((exp) => exp.id !== id));
        } else {
            alert('Failed to delete expense!');
        }
    };

    return (
        <div className="expense-root">
            <TopNav />
            <div className="expense-main-content">
                <div className="page-header">
                    <h2 className="page-title">Expenses</h2>
                </div>

                <section className="expense-summary-section">
                    <div className="expense-summary-cards">
                        <div className="stat-card">
                            <div className="stat-main">
                                ${expenses.reduce((sum, e) => sum + Number(e.amount), 0).toLocaleString()}
                            </div>
                            <div className="stat-label">Total Expense Amount</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-main">{expenses.length}</div>
                            <div className="stat-label">Total Expenses</div>
                        </div>
                    </div>
                    <div className="expense-chart-box">
                        <ExpenseChart data={expenses} />
                    </div>
                </section>

                <section className="expense-list-section">
                    <div className="expense-search-bar-row">
                        <input
                            type="text"
                            className="expense-search-input"
                            placeholder="🔍  Search by title or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="export-buttons">
                            <button onClick={() => exportToCSV(expenses, 'expenses')} disabled={expenses.length === 0}>
                                Export Expenses CSV
                            </button>
                        </div>
                    </div>

                    <div className="add-expense-form-wrapper">
                        <AddExpense onAdd={handleAddExpense} className="add-expense-form" />
                    </div>

                    <div className="expense-list-container">
                        {pagedList.length === 0 ? (
                            <div className="empty-list-message">No expenses found for your search.</div>
                        ) : (
                            pagedList.map((exp) => (
                                <div className="expense-card" key={exp.id}>
                                    <div className="expense-card-inner">
                                        <div className="expense-card-row">
                                            <div className="expense-card-title">{exp.title}</div>
                                            <button
                                                className="expense-delete-btn"
                                                title="Delete Expense"
                                                onClick={() => handleDeleteExpense(exp.id)}
                                            >
                                                &#10006;
                                            </button>
                                        </div>
                                        <div className="expense-category-badge-row">
                                            <span className="expense-category-badge">{exp.category}</span>
                                        </div>
                                        <div className="expense-card-footer">
                                            <span className="expense-amount">${Number(exp.amount).toLocaleString()}</span>
                                            <span className="expense-date">{exp.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {totalPages > 1 && (
                            <div className="pagination">
                                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                    ◀
                                </button>
                                <span>
                                    Page {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    ▶
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Receipt gallery with 7 per page */}
                <ReusableReceiptGallery
                    storageKey="expense_receipts"
                    perPage={7}
                    sectionTitle={<span className="expense-title">Upload Expense Receipt</span>}
                />
            </div>
        </div>
    );
};

export default ExpensePage;
