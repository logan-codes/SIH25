import { useState } from 'react';
import { AuthProvider } from '../../lib/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const institutions = [
            { id: 1, name: "Ranchi University", verified: true },
            { id: 2, name: "Birla Institute of Technology, Mesra", verified: true },
            { id: 3, name: "National Institute of Technology, Jamshedpur", verified: true },
            { id: 4, name: "Indian Institute of Management, Ranchi", verified: true },
            { id: 5, name: "Kolhan University", verified: true },
            { id: 6, name: "Nilamber-Pitamber University", verified: true },
            { id: 7, name: "Sido Kanhu Murmu University", verified: true },
            { id: 8, name: "Fake University Jharkhand", verified: false }
        ];
        
        const verificationHistory = [
            { id: 1, certificateId: "RU2023BTECH1001", institution: "Ranchi University", date: "2023-10-15", status: "Authentic" },
            { id: 2, certificateId: "BIT2023MBA2005", institution: "Birla Institute of Technology, Mesra", date: "2023-10-14", status: "Authentic" },
            { id: 3, certificateId: "NITJ2022MTECH3012", institution: "National Institute of Technology, Jamshedpur", date: "2023-10-13", status: "Authentic" },
            { id: 4, certificateId: "FJ2023BSC0012", institution: "Fake University Jharkhand", date: "2023-10-12", status: "Fake" },
            { id: 5, certificateId: "RU2023BCOM2045", institution: "Ranchi University", date: "2023-10-11", status: "Authentic" }
        ];

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalVerifications: 1247,
        flaggedCertificates: 89,
        activeInstitutions: 156,
        systemUptime: 99.9
    });

    const MetricCard = ({ title, value, icon, color, trend }) => (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <i className={`fas ${icon} text-white text-2xl`}></i>
                </div>
                {trend && (
                    <div className="flex items-center text-green-400 text-sm">
                        <i className="fas fa-arrow-up mr-1"></i>
                        {trend}
                    </div>
                )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{typeof value === 'number' ? value.toLocaleString() : value}</h3>
            <p className="text-slate-400">{title}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-800 ">
            <AuthProvider>
                <Navbar currentPage="admin" setCurrentPage={() => {}} />
            </AuthProvider>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-slate-400">Real-time verification analytics and system monitoring</p>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Total Verifications"
                        value={stats.totalVerifications}
                        icon="fa-file-alt"
                        color="bg-blue-600"
                        trend="+12%"
                    />
                    <MetricCard
                        title="Flagged Certificates"
                        value={stats.flaggedCertificates}
                        icon="fa-exclamation-triangle"
                        color="bg-red-600"
                        trend="-5%"
                    />
                    <MetricCard
                        title="Active Institutions"
                        value={stats.activeInstitutions}
                        icon="fa-university"
                        color="bg-green-600"
                        trend="+8%"
                    />
                    <MetricCard
                        title="System Uptime"
                        value={`${stats.systemUptime}%`}
                        icon="fa-server"
                        color="bg-purple-600"
                        trend="100%"
                    />
                </div>

                {/* Recent Verifications */}
                <div className="card p-6 mb-8">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <i className="fas fa-search mr-2 text-purple-400"></i>
                        Recent Verifications
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-600">
                                    <th className="text-left text-slate-400 py-3 px-4">Certificate ID</th>
                                    <th className="text-left text-slate-400 py-3 px-4">Institution</th>
                                    <th className="text-left text-slate-400 py-3 px-4">Status</th>
                                    <th className="text-left text-slate-400 py-3 px-4">Date</th>
                                    <th className="text-left text-slate-400 py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {verificationHistory.map((verification) => (
                                    <tr key={verification.id} className="border-b border-slate-700">
                                        <td className="py-3 px-4 text-white font-mono text-sm">{verification.certificateId}</td>
                                        <td className="py-3 px-4 text-slate-300">{verification.institution}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                                verification.status === 'Authentic' 
                                                    ? 'bg-green-900 text-green-400 border border-green-500'
                                                    : 'bg-red-900 text-red-400 border border-red-500'
                                            }`}>
                                                <i className={`fas ${verification.status === 'Authentic' ? 'fa-check-circle' : 'fa-times-circle'} mr-1`}></i>
                                                {verification.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-400">{verification.date}</td>
                                        <td className="py-3 px-4">
                                            <button className="text-blue-400 hover:text-blue-300 mr-3">
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button className="text-green-400 hover:text-green-300">
                                                <i className="fas fa-download"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Institution Status */}
                <div className="card p-6">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <i className="fas fa-university mr-2 text-green-400"></i>
                        Institution Status
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {institutions.slice(0, 6).map((institution) => (
                            <div key={institution.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                                <span className="text-slate-300">{institution.name}</span>
                                <i className={`fas ${institution.verified ? 'fa-check-circle text-green-400' : 'fa-times-circle text-red-400'}`}></i>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default AdminDashboard;