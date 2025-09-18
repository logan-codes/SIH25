import React, { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../lib/auth';

const IssuePage = () => {
    const [file, setFile] = useState(null);
    const [recipient, setRecipient] = useState('');
    const [issuer, setIssuer] = useState('');
    const [isIssuing, setIsIssuing] = useState(false);
    const [result, setResult] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFileUpload = (uploadedFile) => {
        setFile(uploadedFile);
        setResult(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileUpload(droppedFile);
        }
    };

    const onSubmit = () => {
        if (!file || !recipient || !issuer) {
            alert('Please fill in all fields and upload a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('recipient', recipient);
        formData.append('issuer', issuer);

        fetch('http://localhost:3001/api/issue', {
            method: 'POST',
            body: formData
        }).then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        }).then(data => {
            setResult(data);
            setIsIssuing(false);
        }).catch(err => {
            console.error('Issuing error:', err);
            setResult({
                success: false,
                error: 'Certificate issuance failed: ' + err.message
            });
            setIsIssuing(false);
        });
        setIsIssuing(true);
    };

    const resetForm = () => {
        setFile(null);
        setRecipient('');
        setIssuer('');
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-slate-800">
            <AuthProvider>
                <Navbar currentPage="issue" setCurrentPage={() => {}} />
            </AuthProvider>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Issue Certificate</h1>
                    <p className="text-slate-300 text-lg">
                        Create and issue a new certificate on the blockchain
                    </p>
                </div>

                <div className="card p-8 mb-8">
                    {!result ? (
                        <>
                            {/* File Upload Area */}
                            <div
                                className={`upload-area p-12 text-center mb-8 ${dragOver ? 'dragover' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <i className={`fas fa-cloud-upload-alt text-6xl mb-4 ${file ? 'text-green-500' : 'text-blue-500'}`}></i>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {file ? `Selected: ${file.name}` : 'Upload Certificate File'}
                                </h3>
                                <p className="text-slate-400 mb-6">
                                    Drag and drop your certificate file here, or click to browse
                                </p>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                                    onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="btn-primary text-white px-6 py-3 rounded-lg cursor-pointer">
                                    Choose File
                                </label>
                            </div>

                            {/* Form Fields */}
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Recipient Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        placeholder="Enter recipient's full name"
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Issuer Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={issuer}
                                        onChange={(e) => setIssuer(e.target.value)}
                                        placeholder="Enter issuer's name (e.g., University, Organization)"
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Issue Button */}
                            <button
                                onClick={onSubmit}
                                disabled={!file || !recipient || !issuer || isIssuing}
                                className="w-full btn-primary text-white py-4 px-8 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isIssuing ? (
                                    <div className="flex items-center justify-center">
                                        <i className="fas fa-spinner fa-spin mr-3"></i>
                                        Issuing Certificate...
                                    </div>
                                ) : (
                                    'Issue Certificate'
                                )}
                            </button>
                        </>
                    ) : (
                        /* Results Display */
                        <div>
                            {result.success !== false ? (
                                /* Success Display */
                                <div>
                                    {/* Success Header */}
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold bg-green-900 text-green-400 border border-green-500">
                                            <i className="fas fa-check-circle mr-3"></i>
                                            Certificate Issued Successfully!
                                        </div>
                                        <p className="text-slate-400 mt-4">
                                            Certificate ID: {result.certID}
                                        </p>
                                    </div>

                                    {/* Certificate Details */}
                                    <div className="bg-slate-700 rounded-lg p-6 mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-4">
                                            <i className="fas fa-certificate mr-2 text-blue-400"></i>
                                            Certificate Details
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="flex justify-between py-2 border-b border-slate-600">
                                                <span className="text-slate-400">Certificate ID:</span>
                                                <span className="text-white font-medium">{result.certID}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-slate-600">
                                                <span className="text-slate-400">Recipient:</span>
                                                <span className="text-white font-medium">{recipient}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-slate-600">
                                                <span className="text-slate-400">Issuer:</span>
                                                <span className="text-white font-medium">{issuer}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-slate-600">
                                                <span className="text-slate-400">File:</span>
                                                <span className="text-white font-medium">{file?.name}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QR Code */}
                                    <div className="bg-slate-700 rounded-lg p-6 mb-6 text-center">
                                        <h3 className="text-xl font-semibold text-white mb-4">
                                            <i className="fas fa-qrcode mr-2 text-green-400"></i>
                                            Verification QR Code
                                        </h3>
                                        <img 
                                            src={result.qr} 
                                            alt="Certificate QR Code" 
                                            className="mx-auto mb-4"
                                            style={{ maxWidth: '200px' }}
                                        />
                                        <p className="text-slate-400 text-sm">
                                            Scan this QR code to verify the certificate
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4">
                                        <button
                                            onClick={resetForm}
                                            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                                        >
                                            Issue Another Certificate
                                        </button>
                                        <button 
                                            onClick={() => window.open(result.link, '_blank')}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                                        >
                                            <i className="fas fa-external-link-alt mr-2"></i>
                                            View Certificate
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Error Display */
                                <div>
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold bg-red-900 text-red-400 border border-red-500">
                                            <i className="fas fa-times-circle mr-3"></i>
                                            Certificate Issuance Failed
                                        </div>
                                        <p className="text-red-400 mt-4">
                                            {result.error}
                                        </p>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={resetForm}
                                            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default IssuePage;
