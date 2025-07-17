import React, { useEffect, useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const ExpenseReceiptGallery = ({
    storageKey = 'expense_receipts',
    perPage = 7,
    sectionTitle = 'Upload Expense Receipt'
}) => {
    const [receipts, setReceipts] = useState([]);
    const [receiptPage, setReceiptPage] = useState(1);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) setReceipts(JSON.parse(saved));
    }, [storageKey]);

    const saveReceipts = (arr) => {
        localStorage.setItem(storageKey, JSON.stringify(arr));
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first');
            return;
        }
        setUploading(true);
        const file = selectedFile;
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `${storageKey}/${fileName}`);

        try {
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            const newItem = { id: Date.now(), url, storagePath: `${storageKey}/${fileName}` };
            const updated = [newItem, ...receipts];
            setReceipts(updated);
            saveReceipts(updated);
            setSelectedFile(null);
            setReceiptPage(1);
        } catch (error) {
            alert('Failed to upload file');
            console.error(error);
        }
        setUploading(false);
    };

    const handleDeleteReceipt = async (id) => {
        const receipt = receipts.find((r) => r.id === id);
        if (!receipt) return;

        try {
            if (receipt.storagePath) {
                const fileRef = ref(storage, receipt.storagePath);
                await deleteObject(fileRef);
            }
        } catch (err) {
            console.warn('Could not delete from firebase', err);
        }

        const updated = receipts.filter((r) => r.id !== id);
        setReceipts(updated);
        saveReceipts(updated);
    };

    const totalReceiptPages = Math.ceil(receipts.length / perPage);

    const currentReceipts = receipts.slice(
        (receiptPage - 1) * perPage,
        receiptPage * perPage
    );

    return (
        <section className="upload-section expense-upload-section">
            <h3>{sectionTitle}</h3>

            <div className="upload-receipt-wrapper">
                <input type="file" onChange={handleFileChange} />
                <button
                    className="upload-btn expense-upload-btn"
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>

            <div style={{ display: 'flex', gap: 24, marginTop: 18, flexWrap: 'wrap' }}>
                {currentReceipts.map((receipt) => (
                    <div
                        key={receipt.id}
                        style={{
                            position: 'relative',
                            width: 110,
                            height: 110,
                            background: '#fff',
                            borderRadius: 8,
                            boxShadow: '0 1px 4px rgba(34,51,84,0.07)',
                            overflow: 'hidden',
                            padding: 8,
                            marginBottom: 12,
                        }}
                    >
                        <img
                            src={receipt.url}
                            alt="Receipt"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: 8,
                            }}
                        />
                        <button
                            style={{
                                position: 'absolute',
                                top: 3,
                                right: 5,
                                background: 'rgba(230,40,40,0.88)',
                                border: 'none',
                                color: '#fff',
                                fontWeight: 'bold',
                                borderRadius: '50%',
                                width: 24,
                                height: 24,
                                cursor: 'pointer',
                                lineHeight: 0.95,
                            }}
                            title="Delete"
                            onClick={() => handleDeleteReceipt(receipt.id)}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {totalReceiptPages > 0 && (
                <div
                    className="receipt-pagination"
                    style={{
                        marginTop: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                    }}
                >
                    <button
                        onClick={() => setReceiptPage((p) => Math.max(1, p - 1))}
                        disabled={receiptPage === 1}
                    >
                        ◀
                    </button>
                    <span>
                        Page {receiptPage} / {totalReceiptPages}
                    </span>
                    <button
                        onClick={() => setReceiptPage((p) => Math.min(totalReceiptPages, p + 1))}
                        disabled={receiptPage === totalReceiptPages}
                    >
                        ▶
                    </button>
                </div>
            )}
        </section>
    );
};

export default ExpenseReceiptGallery;
