import { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../lib/auth';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Store in localStorage
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push({
            ...formData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        setTimeout(() => setSubmitted(false), 5000);
    };

    const contactInfo = [
        {
            icon: 'fa-phone',
            title: 'Phone',
            details: ['+91 12345 67890', '+91 98765 43210']
        },
        {
            icon: 'fa-envelope',
            title: 'Email',
            details: ['info@academiavalidator.gov.in', 'support@academiavalidator.gov.in']
        },
        {
            icon: 'fa-map-marker-alt',
            title: 'Office',
            details: ['Jharkhand Education Department', 'Ranchi, Jharkhand - 834001']
        }
    ];

    return (
        <div className="min-h-screen bg-slate-800 ">
            <AuthProvider>
                <Navbar currentPage="contact" setCurrentPage={() => {}} />
            </AuthProvider>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Contact Us</h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Have questions about our certificate verification system? 
                        We're here to help institutions, employers, and students.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        <div className="card p-8">
                            <h2 className="text-2xl font-bold text-white mb-8">Get In Touch</h2>
                            <div className="space-y-8">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="p-3 rounded-lg bg-slate-700 mr-4">
                                            <i className={`fas ${info.icon} text-blue-400`}></i>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-2">{info.title}</h3>
                                            {info.details.map((detail, detailIndex) => (
                                                <p key={detailIndex} className="text-slate-300 mb-1">{detail}</p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="card p-8">
                            <h2 className="text-2xl font-bold text-white mb-8">Send us a Message</h2>
                            
                            {submitted && (
                                <div className="mb-8 p-4 bg-green-900 bg-opacity-30 border border-green-500 rounded-lg">
                                    <div className="flex items-center">
                                        <i className="fas fa-check-circle text-green-400 mr-2"></i>
                                        <span className="text-green-400 font-semibold">Message sent successfully!</span>
                                    </div>
                                    <p className="text-slate-300 mt-1">We'll get back to you within 24 hours.</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-white text-sm font-medium mb-2">Subject *</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="What is this about?"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-white text-sm font-medium mb-2">Message *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows="6"
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-primary text-white py-4 px-8 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <i className="fas fa-spinner fa-spin mr-3"></i>
                                            Sending Message...
                                        </div>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-20 ">
                <Footer/>
            </div>
        </div>
    );
};