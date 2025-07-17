import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UploadReceipt = ({ onUploaded, folder = 'invoices' }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        setMessage('');

        if (selected && selected.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selected);
        } else {
            setPreview(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file before uploading.');
            return;
        }
        setUploading(true);
        setMessage('Uploading...');

        try {
            const fileName = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, `${folder}/${fileName}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setUploading(false);
            setMessage('Upload successful!');
            onUploaded(url);        // 실제 다운로드 URL 전달!
            setFile(null);
            setPreview(null);
        } catch (err) {
            setUploading(false);
            setMessage('Upload failed.');
            console.error(err);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input type="file" onChange={handleFileChange} />
            <button
                onClick={handleUpload}
                disabled={uploading}
                style={{
                    background: '#247be7',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 16px',
                    fontWeight: 700,
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    marginLeft: 8,
                }}
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {message && <p style={{ margin: 0, color: uploading ? 'gray' : 'green' }}>{message}</p>}
            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    className="receipt-preview-image"
                    style={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 8,
                        display: 'block',
                        marginTop: 12,
                    }}
                />
            )}
        </div>
    );
};

export default UploadReceipt;
