import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../lib/AuthContext';

const AboutPage = () => {
    const technologies = [
        {
            icon: 'fa-link',
            title: 'Blockchain Security',
            description: 'Immutable ledger technology ensures certificate records cannot be tampered with, providing cryptographic proof of authenticity.',
            features: ['Distributed Ledger', 'Hash Verification', 'Smart Contracts', 'Audit Trails']
        },
        {
            icon: 'fa-chart-bar',
            title: 'Analytics Platform',
            description: 'Comprehensive analytics provide insights into verification patterns, fraud trends, and system performance metrics.',
            features: ['Real-time Dashboards', 'Fraud Detection', 'Performance Metrics', 'Trend Analysis']
        }
    ];

    return (
        <div className="min-h-screen bg-slate-800">
            <AuthProvider>
                <Navbar currentPage="about" setCurrentPage={() => {}} />
            </AuthProvider>
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Our Mission</h1>
                    <p className="text-xl text-slate-300 max-w-4xl mx-auto">
                        We're revolutionizing academic integrity through cutting-edge technology, 
                        making certificate verification instant, secure, and accessible to all stakeholders.
                    </p>
                </div>
            </section>

            {/* Technology Section */}
            <section className="py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Technology Stack</h2>
                      <p className="text-slate-300 max-w-3xl mx-auto">
                          We leverage the latest advances in AI, blockchain, and data analytics to create a robust, scalable verification platform.
                      </p>
                  </div>

                  <div className="space-y-12">
                      {technologies.map((tech, index) => (
                          <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                              <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                                  <div className="card p-8">
                                      <i className={`fas ${tech.icon} text-4xl text-green-400 mb-6`}></i>
                                      <h3 className="text-2xl font-bold text-white mb-4">{tech.title}</h3>
                                      <p className="text-slate-300 mb-6">{tech.description}</p>
                                      <div className="grid grid-cols-2 gap-3">
                                          {tech.features.map((feature, featureIndex) => (
                                              <div key={featureIndex} className="flex items-center">
                                                  <i className="fas fa-check-circle text-green-400 mr-2"></i>
                                                  <span className="text-sm text-slate-300">{feature}</span>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              </div>
                              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                                  <div className="bg-gradient-to-br from-green-900 to-blue-900 rounded-xl p-8 h-64 flex items-center justify-center border border-green-500 border-opacity-30">
                                      <i className={`fas ${tech.icon} text-8xl text-green-400 opacity-30`}></i>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
            </section>

            {/* Impact Section */}
            <section className="py-20 bg-slate-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Our Impact</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="card p-8">
                      <div className="text-4xl font-bold text-green-400 mb-2">1</div>
                      <div className="text-slate-400">Institutions Connected</div>
                  </div>
                  <div className="card p-8">
                      <div className="text-4xl font-bold text-blue-400 mb-2">5,000+</div>
                      <div className="text-slate-400">Certificates Verified</div>
                  </div>
                  <div className="card p-8">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">2s</div>
                      <div className="text-slate-400">Average Verification Time</div>
                  </div>
                </div>
              </div>
            </section>
            <Footer/>
        </div>
    );
};

export default AboutPage;