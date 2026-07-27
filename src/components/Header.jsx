import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E0D8] shadow-sm">
      {/* Top Bar for ISSN and Social Links */}
      <div className="w-full bg-white border-b border-[#F0EBE1] text-[#5C5446] py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs md:text-sm">
          <div className="font-semibold tracking-wider flex items-center">
            <span className="opacity-75 mr-2">ISSN:</span> 3048-7366 (online)
          </div>
          <div className="flex space-x-4 items-center">
            <span className="opacity-75 uppercase tracking-widest hidden sm:inline text-[10px]">Share:</span>
            <a href="#" className="text-[#8E7C68] hover:text-blue-500 transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z"/></svg>
            </a>
            <a href="#" className="text-[#8E7C68] hover:text-blue-400 transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            <a href="#" className="text-[#8E7C68] hover:text-blue-600 transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex justify-between items-center">
          
          {/* Logo / Journal Title */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-3xl font-bold text-[#2C2C2C] tracking-tight uppercase hover:opacity-80 transition-opacity" onClick={closeMobileMenu}>
              OJS Portal
            </Link>
          </div>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex space-x-6 lg:space-x-8">
            <Link to="/" className="text-[#5C5446] hover:text-[#2C2C2C] transition-colors border-b-2 border-transparent hover:border-[#8E7C68] pb-1 font-semibold text-[1.05rem]">Home</Link>
            <Link to="/about" className="text-[#5C5446] hover:text-[#2C2C2C] transition-colors border-b-2 border-transparent hover:border-[#8E7C68] pb-1 font-semibold text-[1.05rem]">About Us</Link>
            <Link to="/editorial-board" className="text-[#5C5446] hover:text-[#2C2C2C] transition-colors border-b-2 border-transparent hover:border-[#8E7C68] pb-1 font-semibold text-[1.05rem]">Editorial Board</Link>
            <Link to="/call-for-papers" className="text-[#5C5446] hover:text-[#2C2C2C] transition-colors border-b-2 border-transparent hover:border-[#8E7C68] pb-1 font-semibold text-[1.05rem]">Call For Papers</Link>
            <Link to="/submission" className="text-[#5C5446] hover:text-[#2C2C2C] transition-colors border-b-2 border-transparent hover:border-[#8E7C68] pb-1 font-semibold text-[1.05rem]">Submission</Link>
            <Link to="/team" className="text-[#5C5446] hover:text-[#2C2C2C] transition-colors border-b-2 border-transparent hover:border-[#8E7C68] pb-1 font-semibold text-[1.05rem]">Our Team</Link>
            <Link to="/contact" className="text-[#5C5446] hover:text-[#2C2C2C] transition-colors border-b-2 border-transparent hover:border-[#8E7C68] pb-1 font-semibold text-[1.05rem]">Contact Us</Link>
          </nav>

          {/* Login Button */}
          <div className="hidden lg:flex items-center">
            <Link to="/login" className="px-6 py-2.5 bg-white border border-[#E5E0D8] text-[#2C2C2C] rounded shadow-sm hover:bg-[#F9F6F0] hover:shadow transition-all font-bold tracking-wide">
              Login
            </Link>
          </div>
          
          {/* Mobile Menu Button (Hamburger) */}
          <div className="lg:hidden flex items-center">
            <button 
              className="text-[#2C2C2C] focus:outline-none" 
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E5E0D8] absolute w-full shadow-lg left-0">
          <nav className="flex flex-col px-6 py-4 space-y-4">
            <Link to="/" className="text-[#2C2C2C] font-semibold text-[1.1rem]" onClick={closeMobileMenu}>Home</Link>
            <Link to="/about" className="text-[#2C2C2C] font-semibold text-[1.1rem]" onClick={closeMobileMenu}>About Us</Link>
            <Link to="/editorial-board" className="text-[#2C2C2C] font-semibold text-[1.1rem]" onClick={closeMobileMenu}>Editorial Board</Link>
            <Link to="/call-for-papers" className="text-[#2C2C2C] font-semibold text-[1.1rem]" onClick={closeMobileMenu}>Call For Papers</Link>
            <Link to="/submission" className="text-[#2C2C2C] font-semibold text-[1.1rem]" onClick={closeMobileMenu}>Submission</Link>
            <Link to="/team" className="text-[#2C2C2C] font-semibold text-[1.1rem]" onClick={closeMobileMenu}>Our Team</Link>
            <Link to="/contact" className="text-[#2C2C2C] font-semibold text-[1.1rem]" onClick={closeMobileMenu}>Contact Us</Link>
            <div className="pt-4 border-t border-[#E5E0D8]">
              <Link to="/login" className="block text-center w-full px-6 py-3 bg-[#2C2C2C] text-white rounded font-bold tracking-wide" onClick={closeMobileMenu}>
                Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
