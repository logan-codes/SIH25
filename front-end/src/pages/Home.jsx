import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthProvider } from '../lib/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const features = [
        {
            icon: 'fa-database',
            title: 'Institutional Database',
            description: 'Cross-reference with verified institutional records to validate certificate details.'
        },
        {
            icon: 'fa-qrcode',
            title: 'QR Code Validation',
            description: 'Instant verification through QR codes.'
        },
        {
            icon: 'fa-chart-line',
            title: 'Fraud Analytics',
            description: 'Comprehensive dashboard to track and analyze forgery trends.'
        }
    ];
    
    const stats = [
        { value: '50,000+', label: 'Certificates Verified' },
        { value: '200+', label: 'Institutions Integrated' },
        { value: '1,240', label: 'Frauds Detected' }
    ];
    
    return (
        <div className="min-h-screen">
            <AuthProvider>
                <Navbar currentPage="home" setCurrentPage={() => {}} />
            </AuthProvider>
            <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 fade-in">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Authenticity Validator for Academia
                        </span>
                    </h1>
                    <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto fade-in">
                        Secure verification of academic certificates to combat fraud and preserve academic integrity.
                    </p>
                    <button onClick={() => navigate('/verify') } className="btn-primary text-white font-semibold py-3 px-8 rounded-lg text-lg inline-flex items-center fade-in">
                        Verify a Certificate <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                    
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold text-white">{stat.value}</div>
                                <p className="text-slate-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="py-20 bg-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Growing Problem of Certificate Fraud</h2>
                        <p className="text-slate-300 max-w-3xl mx-auto">
                            Fake academic credentials undermine the value of education, deceive employers, and damage institutional reputation. 
                            Traditional verification methods are slow, inefficient, and vulnerable to manipulation.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="card p-8">
                            <h3 className="text-2xl font-semibold text-white mb-4">The Challenge</h3>
                            <ul className="text-slate-300 space-y-3">
                                <li>Increasing instances of forged certificates</li>
                                <li>Difficulty in verifying authenticity</li>
                                <li>Loss of trust in academic qualifications</li>
                            </ul>
                        </div>
                        
                        <div className="card p-8">
                            <h3 className="text-2xl font-semibold text-white mb-4">Our Solution</h3>
                            <ul className="text-slate-300 space-y-3">
                                <li>Blockchain backed verification process</li>
                                <li>Instant results and detailed reports</li>
                                <li>Collaboration with educational institutions</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="py-20 bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Key Features</h2>
                        <p className="text-slate-300 max-w-3xl mx-auto">
                            Our platform combines cutting-edge technology with user-friendly design to provide comprehensive certificate verification.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="card p-6 text-center group">
                                <div className={`text-5xl text-blue-500 mb-4`}>
                                    <i className={`fas ${feature.icon}`}></i>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-300">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Verify Certificates?</h2>
                    <p className="text-blue-100 text-xl mb-10 max-w-3xl mx-auto">
                        Join us in the fight against credential frauds.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={() => navigate('/verify')} className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg text-lg">
                            Verify a Certificate
                        </button>
                        <button onClick={() => navigate('/about')} className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg text-lg">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
};

export default Home;