import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { AuthProvider } from '../../lib/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const success = await login(username, password);
            if (success) {
                navigate('/admin');
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthProvider>
            <div className="min-h-screen bg-slate-800">
                <Navbar currentPage="admin" setCurrentPage={() => {}} />
                <div className="min-h-screen bg-slate-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full card p-8">
                        <div className="text-center mb-8">
                            <i className="fas fa-user-shield text-4xl text-blue-500 mb-4"></i>
                            <h2 className="text-3xl font-bold text-white">Admin Login</h2>
                            <p className="text-slate-400 mt-2">Access the verification dashboard</p>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-white text-sm font-medium mb-2">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-white text-sm font-medium mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                            
                            {error && (
                                <div className="text-red-400 text-sm text-center bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-3 mb-6">
                                    {error}
                                </div>
                            )}
                            
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full btn-primary text-white py-3 px-6 rounded-lg font-semibold text-lg ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Logging in...
                                    </span>
                                ) : (
                                    'Login to Dashboard'
                                )}
                            </button>
                        </form>
                        
                        <div className="mt-6 text-center">
                            <p className="text-slate-400 text-sm">
                                Demo credentials: <span className="text-green-400">admin</span> / <span className="text-green-400">password</span>
                            </p>
                            <p className="text-slate-400 text-sm mt-1">
                                or <span className="text-green-400">issuer</span> / <span className="text-green-400">password</span>
                            </p>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </AuthProvider>
    );
};

export default AdminLogin;