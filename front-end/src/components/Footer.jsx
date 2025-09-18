import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 border-t border-slate-700 mt-auto">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex justify-center md:justify-start">
                        <div className="flex items-center">
                            <span className="text-slate-400 text-sm">© 2023 Authenticity Validator. All rights reserved.</span>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <p className="text-center text-sm text-slate-400">
                            Contact us: <a href="mailto:info@academiavalidator.gov.in" className="text-blue-400">info@academiavalidator.gov.in</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;