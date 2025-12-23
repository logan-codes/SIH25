import React, { use, useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left */}
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="flex-shrink-0 flex items-center"
            >
              <i className="fas fa-graduation-cap text-blue-500 text-2xl mr-2"></i>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Authenticity Validator
              </span>
            </button>

            {/* Desktop links */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <button
                onClick={() => navigate("/")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === "home"
                    ? "text-white bg-slate-700"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate("/verify")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === "verify"
                    ? "text-white bg-slate-700"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Verify
              </button>
              {user ? (  <button
                  onClick={() => navigate("/issue-certificate")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === "issue"
                      ? "text-white bg-slate-700"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Issue
                </button>): (<></>)}
              <button
                onClick={() =>  navigate("/about")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === "about"
                    ? "text-white bg-slate-700"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                About
              </button>
              {user ? (
                <button
                  onClick={() => navigate("/admin")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === "admin"
                      ? "text-white bg-slate-700"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => navigate("/admin")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === "admin-login"
                      ? "text-white bg-slate-700"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Admin
                </button>
              )}
              <button
                onClick={() => navigate("/contact")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === "contact"
                    ? "text-white bg-slate-700"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Contact
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center">
            {user && (
              <button
                onClick={()=>{
                    logout()
                    navigate('/')
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white focus:outline-none"
            >
              <i
                className={`fas ${
                  isMenuOpen ? "fa-times" : "fa-bars"
                } text-xl`}
              ></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                navigate("/");
                setIsMenuOpen(false);
              }}
              className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate("/verify");
                setIsMenuOpen(false);
              }}
              className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Verify
            </button>
            { user ? (<button
                onClick={() => {
                  navigate("/issue-certificate");
                  setIsMenuOpen(false);
                }}
                className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Issue
              </button>) : (<></>)
            }
            <button
              onClick={() => {
                navigate("/about");
                setIsMenuOpen(false);
              }}
              className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              About
            </button>
            {user ? (
              <button
                onClick={() => {
                  navigate("/admin");
                  setIsMenuOpen(false);
                }}
                className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/admin-login");
                  setIsMenuOpen(false);
                }}
                className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Admin
              </button>
            )}
            <button
              onClick={() => {
                navigate("/contact");
                setIsMenuOpen(false);
              }}
              className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Contact
            </button>
            {user && (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
