import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../lib/AuthContext";

const VerifyPage = () => {
  const [file, setFile] = useState(null);
  const [certificateId, setCertificateId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
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
  const onsubmit = () => {
    const formData = new FormData();
    formData.append("certificate", file);
    if (certificateId) formData.append("certificateId", certificateId);

    fetch("http://localhost:3001/api/verify", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setResult(data);
        setIsVerifying(false);
      })
      .catch((err) => {
        console.error("Verification error:", err);
        setResult({
          isAuthentic: false,
          details: {
            fileHash: "N/A",
            recipient: "Unknown",
            issuer: "Unknown",
            fileName: file?.name || "Unknown",
          },
          checks: {
            blockchainVerification: false,
            hashValidation: false,
          },
          error: "Verification failed: " + err.message,
        });
        setIsVerifying(false);
      });
    setIsVerifying(true);
  };

  const resetForm = () => {
    setFile(null);
    setCertificateId("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-800 ">
      <AuthProvider>
        <Navbar currentPage="verify" setCurrentPage={() => {}} />
      </AuthProvider>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Certificate Verification
          </h1>
          <p className="text-slate-300 text-lg">
            Upload your academic certificate for instant AI-powered verification
          </p>
        </div>

        <div className="card p-8 mb-8">
          {!result ? (
            <>
              {/* File Upload Area */}
              <div
                className={`upload-area p-12 text-center mb-8 ${
                  dragOver ? "dragover" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <i
                  className={`fas fa-cloud-upload-alt text-6xl mb-4 ${
                    file ? "text-green-500" : "text-blue-500"
                  }`}
                ></i>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {file ? `Selected: ${file.name}` : "Upload Certificate"}
                </h3>
                <p className="text-slate-400 mb-6">
                  Drag and drop your certificate here, or click to browse
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    e.target.files[0] && handleFileUpload(e.target.files[0])
                  }
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="btn-primary text-white px-6 py-3 rounded-lg cursor-pointer"
                >
                  Choose File
                </label>
              </div>

              {/* Certificate ID Input */}
              <div className="mb-8">
                <label className="block text-white text-sm font-medium mb-2">
                  Certificate ID (Optional)
                </label>
                <input
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="Enter certificate ID for enhanced verification"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Verify Button */}
              <button
                onClick={onsubmit}
                disabled={!file || isVerifying}
                className="w-full btn-primary text-white py-4 px-8 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin mr-3"></i>
                    Verifying Certificate...
                  </div>
                ) : (
                  "Verify Certificate"
                )}
              </button>
            </>
          ) : (
            /* Results Display */
            <div>
              {/* Status Header */}
              <div className="text-center mb-8">
                {result.error ? (
                  <div className="inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold bg-yellow-900 text-yellow-400 border border-yellow-500">
                    <i className="fas fa-exclamation-triangle mr-3"></i>
                    Verification Error
                  </div>
                ) : (
                  <div
                    className={`inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold ${
                      result.isAuthentic
                        ? "bg-green-900 text-green-400 border border-green-500"
                        : "bg-red-900 text-red-400 border border-red-500"
                    }`}
                  >
                    <i
                      className={`fas ${
                        result.isAuthentic
                          ? "fa-check-circle"
                          : "fa-times-circle"
                      } mr-3`}
                    ></i>
                    {result.isAuthentic
                      ? "Certificate Authentic"
                      : "Possible Forgery Detected"}
                  </div>
                )}

                {result.error && (
                  <p className="text-red-400 mt-2 text-sm">{result.error}</p>
                )}
              </div>

              {/* Certificate Details */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  <i className="fas fa-file-alt mr-2 text-blue-400"></i>
                  Certificate Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(result.details).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between py-2 border-b border-slate-600"
                    >
                      <span className="text-slate-400 capitalize ">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </span>
                      <span className="text-white font-medium break-all">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Checks */}
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  <i className="fas fa-shield-alt mr-2 text-green-400"></i>
                  Security Checks
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(result.checks).map(([check, passed]) => (
                    <div
                      key={check}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-slate-300 capitalize">
                        {check.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <i
                        className={`fas ${
                          passed
                            ? "fa-check-circle text-green-400"
                            : "fa-times-circle text-red-400"
                        } text-lg`}
                      ></i>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={resetForm}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Verify Another Certificate
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                  <i className="fa-solid fa-flag mr-2"></i>
                   Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyPage;
