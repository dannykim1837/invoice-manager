// InvoicePage.jsx
import React, { useEffect, useState } from 'react';
import TopNav from '../components/TopNav';
import InvoiceChart from '../components/InvoiceChart';
import AddInvoice from '../components/AddInvoice';
import { deleteItem } from '../utils/api';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { usePaginationList } from '../components/usePaginationList';
import { exportToCSV } from '../utils/exportToCSV';
import InvoiceReceiptGallery from '../components/InvoiceReceiptGallery'; // 갤러리 컴포넌트 import
import '../styles/invoicepage.css';

const InvoicePage = () => {
    const [invoices, setInvoices] = useState([]);
    const [search, setSearch] = useState('');
    const itemsPerPage = 5;

    const fetchInvoices = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/invoices/', {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setInvoices(res.data);
        } catch (err) {
            console.error("Failed to fetch invoices", err);
        }
    };

    useEffect(() => { fetchInvoices(); }, []);

    const filterFn = inv =>
        inv.title.toLowerCase().includes(search.toLowerCase()) ||
        inv.client.toLowerCase().includes(search.toLowerCase()) ||
        inv.status.toLowerCase().includes(search.toLowerCase());

    const { pagedList, totalPages, currentPage, setCurrentPage } =
        usePaginationList(invoices, itemsPerPage, search, filterFn, 'due_date');

    const handleAddInvoice = async () => {
        await fetchInvoices();
        setTimeout(() => {
            const newTotalPages = Math.max(1, Math.ceil((invoices.length + 1) / itemsPerPage));
            setCurrentPage(newTotalPages);
        }, 50);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this invoice?")) return;
        const ok = await deleteItem(`http://127.0.0.1:8000/api/invoices/${id}/`);
        if (ok) setInvoices(prev => prev.filter(inv => inv.id !== id));
        else alert("Failed to delete invoice!");
    };

    return (
        <div className="invoice-root">
            <TopNav />
            <div className="invoice-main-content">
                <div className="page-header">
                    <h2 className="page-title">Invoices</h2>
                </div>
                <section className="invoice-summary-section">
                    <div className="invoice-summary-cards">
                        <div className="stat-card">
                            <div className="stat-main">
                                ${invoices.reduce((sum, i) => sum + Number(i.amount), 0).toLocaleString()}
                            </div>
                            <div className="stat-label">Total Invoice Amount</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-main">{invoices.length}</div>
                            <div className="stat-label">Total Invoices</div>
                        </div>
                    </div>
                    <div className="invoice-chart-box">
                        <InvoiceChart data={invoices} />
                    </div>
                </section>
                <section className="invoice-list-section">
                    <div className="invoice-search-bar-row">
                        <input
                            type="text"
                            className="invoice-search-input"
                            placeholder="🔍  Search by title, client, or status..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <div className="export-buttons">
                            <button
                                onClick={() => exportToCSV(invoices, 'invoices')}
                                disabled={invoices.length === 0}
                            >Export Invoices CSV</button>
                        </div>
                    </div>
                    <div className="add-invoice-form-wrapper">
                        <AddInvoice onAdd={handleAddInvoice} className="add-invoice-form" />
                    </div>
                    <div className="invoice-list-container">
                        {pagedList.length === 0 ? (
                            <div className="empty-list-message">
                                No invoices found for your search.
                            </div>
                        ) : (
                            pagedList.map(inv => (
                                <div className="invoice-card" key={inv.id}>
                                    <div className="invoice-card-inner">
                                        <div className="invoice-card-row">
                                            <div className="invoice-card-title">{inv.title}</div>
                                            <button
                                                className="invoice-delete-btn"
                                                title="Delete Invoice"
                                                onClick={() => handleDelete(inv.id)}
                                            >&#10006;</button>
                                        </div>
                                        <div className="invoice-card-status-row">
                                            <span className={`invoice-status-badge status-${inv.status.toLowerCase()}`}>
                                                {inv.status}
                                            </span>
                                        </div>
                                        <div className="invoice-card-footer">
                                            <span className="invoice-amount">${Number(inv.amount).toLocaleString()}</span>
                                            <span className="invoice-date">Due: {inv.due_date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >◀</button>
                                <span>Page {currentPage} / {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >▶</button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Invoice Receipt Gallery */}
                <section className="receipt-section">
                    <InvoiceReceiptGallery
                        perPage={7}
                        sectionTitle="Upload Invoice Receipt"
                        storageKey="invoice_receipts"
                    />
                </section>
            </div>
        </div>
    );
};

export default InvoicePage;
