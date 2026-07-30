import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenMobileDropdown(null);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown(null);
  };

  const toggleMobileDropdown = (dropdown) => {
    setOpenMobileDropdown(openMobileDropdown === dropdown ? null : dropdown);
  };

  const SHOW_NEW_DESIGN = false; // Hidden at this moment as requested

  if (SHOW_NEW_DESIGN) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E0D8] shadow-sm">
        <div className="w-full bg-white border-b border-[#F0EBE1] text-[#5C5446] py-1.5">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs md:text-sm">
            <div className="font-semibold tracking-wider flex items-center">
              <span className="opacity-75 mr-2">ISSN:</span> 3048-7366 (online)
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center mr-4 lg:mr-8">
              <Link to="/" className="text-xl lg:text-2xl font-extrabold text-[#2C2C2C] tracking-tight uppercase hover:opacity-80 transition-opacity">
                The literary scientist
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-5 items-center text-[#5C5446] font-semibold text-[0.95rem]">
              <Link to="/" className="hover:text-[#2C2C2C] transition-colors">Home</Link>
              <Link to="/about" className="hover:text-[#2C2C2C] transition-colors">About</Link>
              <Link to="/current-issue" className="hover:text-[#2C2C2C] transition-colors">Current Issue</Link>
              <Link to="/archive" className="hover:text-[#2C2C2C] transition-colors">Archive</Link>
              <Link to="/issues" className="hover:text-[#2C2C2C] transition-colors">Articles</Link>
              <Link to="/author-guidelines" className="hover:text-[#2C2C2C] transition-colors">Authors</Link>
              <Link to="/become-reviewer" className="hover:text-[#2C2C2C] transition-colors">Reviewers</Link>
              <Link to="/special-collections" className="hover:text-[#2C2C2C] transition-colors">Special Issues</Link>
              <Link to="/news" className="hover:text-[#2C2C2C] transition-colors">News</Link>
              <Link to="/search" className="hover:text-[#2C2C2C] transition-colors" aria-label="Search">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3 ml-2">
              <Link to="/start-submission" className="px-5 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition-all font-bold tracking-wide text-sm">
                Submit
              </Link>
              <Link to="/login" className="text-[#5C5446] hover:text-[#2C2C2C] font-semibold text-[0.95rem] transition-colors">
                Login
              </Link>
            </div>
            
            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center">
              <button className="text-[#2C2C2C] p-2" onClick={toggleMobileMenu}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

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
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          
          {/* Logo / Journal Title */}
          <div className="flex-shrink-0 flex items-center mr-4 lg:mr-8 max-w-[200px] sm:max-w-none">
            <Link to="/" className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#2C2C2C] tracking-tight uppercase hover:opacity-80 transition-opacity leading-tight" onClick={closeMobileMenu}>
              The literary scientist
            </Link>
          </div>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex space-x-4 lg:space-x-6 items-center">
            
            <Link to="/" className="text-[#5C5446] hover:text-[#2C2C2C] transition-colors py-2 font-semibold text-[0.95rem]">Home</Link>

            {/* Articles Dropdown */}
            <div className="relative group cursor-pointer py-2">
              <span className="text-[#5C5446] hover:text-[#2C2C2C] transition-colors font-semibold text-[0.95rem] flex items-center">
                Articles
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </span>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-[#E5E0D8] rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/issues" className="block px-4 py-2 text-sm text-[#5C5446] hover:bg-[#F9F6F0] hover:text-[#2C2C2C]">Issues</Link>
                <Link to="/special-collections" className="block px-4 py-2 text-sm text-[#5C5446] hover:bg-[#F9F6F0] hover:text-[#2C2C2C]">Special Collections</Link>
              </div>
            </div>

            {/* Submissions Dropdown */}
            <div className="relative group cursor-pointer py-2">
              <span className="text-[#5C5446] hover:text-[#2C2C2C] transition-colors font-semibold text-[0.95rem] flex items-center">
                Submissions
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </span>
              <div className="absolute left-0 mt-2 w-64 bg-white border border-[#E5E0D8] rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/author-guidelines" className="block px-4 py-2 text-sm text-[#5C5446] hover:bg-[#F9F6F0] hover:text-[#2C2C2C]">Author Guidelines</Link>
                <Link to="/anonymous-review" className="block px-4 py-2 text-sm text-[#5C5446] hover:bg-[#F9F6F0] hover:text-[#2C2C2C]">Ensuring An Anonymous Review</Link>
                <Link to="/start-submission" className="block px-4 py-2 text-sm text-[#5C5446] hover:bg-[#F9F6F0] hover:text-[#2C2C2C] font-semibold text-blue-600">Start Submission</Link>
                <Link to="/glossa-special-collections" className="block px-4 py-2 text-sm text-[#5C5446] hover:bg-[#F9F6F0] hover:text-[#2C2C2C]">Glossa Special Collections</Link>
              </div>
            </div>

            <Link to="/journal-policies" className="text-[#5C5446] hover:text-[#2C2C2C] transition-colors py-2 font-semibold text-[0.95rem]">Journal Policies</Link>
            <Link to="/publisher-policies" className="text-[#5C5446] hover:text-[#2C2C2C] transition-colors py-2 font-semibold text-[0.95rem]">Publisher Policies</Link>

            {/* About Dropdown */}
            <div className="relative group cursor-pointer py-2">
              <span className="text-[#5C5446] hover:text-[#2C2C2C] transition-colors font-semibold text-[0.95rem] flex items-center">
                About
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </span>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-[#E5E0D8] rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/team" className="block px-4 py-2 text-sm text-[#5C5446] hover:bg-[#F9F6F0] hover:text-[#2C2C2C]">Editorial Team</Link>
                <Link to="/become-reviewer" className="block px-4 py-2 text-sm text-[#5C5446] hover:bg-[#F9F6F0] hover:text-[#2C2C2C]">Become A Reviewer</Link>
                <Link to="/contact" className="block px-4 py-2 text-sm text-[#5C5446] hover:bg-[#F9F6F0] hover:text-[#2C2C2C]">Contact</Link>
                <Link to="/governance" className="block px-4 py-2 text-sm text-[#5C5446] hover:bg-[#F9F6F0] hover:text-[#2C2C2C]">Governance</Link>
              </div>
            </div>
            
            {/* Search Icon */}
            <Link to="/search" className="text-[#5C5446] hover:text-[#2C2C2C] transition-colors py-2" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3 ml-2">
            <Link to="/register" className="text-[#5C5446] hover:text-[#2C2C2C] font-semibold text-[0.95rem] transition-colors">
              Register
            </Link>
            <Link to="/login" className="px-5 py-2 bg-white border border-[#E5E0D8] text-[#2C2C2C] rounded shadow-sm hover:bg-[#F9F6F0] hover:shadow transition-all font-bold tracking-wide text-sm">
              Login
            </Link>
          </div>
          
          {/* Mobile Menu Button (Hamburger) */}
          <div className="lg:hidden flex items-center">
            <button 
              className="text-[#2C2C2C] focus:outline-none p-2" 
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

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E5E0D8] absolute w-full shadow-xl max-h-[80vh] overflow-y-auto left-0 z-50">
          <nav className="flex flex-col px-4 py-2 space-y-1">
            
            {/* Search (Mobile) */}
            <Link to="/search" className="flex items-center text-[#2C2C2C] font-semibold text-[1.1rem] py-3 border-b border-[#F0EBE1]" onClick={closeMobileMenu}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              Search
            </Link>

            <Link to="/" className="text-[#2C2C2C] font-semibold text-[1.1rem] py-3 border-b border-[#F0EBE1]" onClick={closeMobileMenu}>Home</Link>

            {/* Articles */}
            <div>
              <button onClick={() => toggleMobileDropdown('articles')} className="w-full flex justify-between items-center text-[#2C2C2C] font-semibold text-[1.1rem] py-3 border-b border-[#F0EBE1]">
                Articles
                <svg className={`w-5 h-5 transform transition-transform ${openMobileDropdown === 'articles' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {openMobileDropdown === 'articles' && (
                <div className="bg-[#F9F6F0] pl-6 py-2 flex flex-col space-y-3">
                  <Link to="/issues" className="text-[#5C5446] hover:text-[#2C2C2C]" onClick={closeMobileMenu}>Issues</Link>
                  <Link to="/special-collections" className="text-[#5C5446] hover:text-[#2C2C2C]" onClick={closeMobileMenu}>Special Collections</Link>
                </div>
              )}
            </div>

            {/* Submissions */}
            <div>
              <button onClick={() => toggleMobileDropdown('submissions')} className="w-full flex justify-between items-center text-[#2C2C2C] font-semibold text-[1.1rem] py-3 border-b border-[#F0EBE1]">
                Submissions
                <svg className={`w-5 h-5 transform transition-transform ${openMobileDropdown === 'submissions' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {openMobileDropdown === 'submissions' && (
                <div className="bg-[#F9F6F0] pl-6 py-2 flex flex-col space-y-3">
                  <Link to="/author-guidelines" className="text-[#5C5446] hover:text-[#2C2C2C]" onClick={closeMobileMenu}>Author Guidelines</Link>
                  <Link to="/anonymous-review" className="text-[#5C5446] hover:text-[#2C2C2C]" onClick={closeMobileMenu}>Ensuring An Anonymous Review</Link>
                  <Link to="/start-submission" className="text-blue-600 font-semibold" onClick={closeMobileMenu}>Start Submission</Link>
                  <Link to="/glossa-special-collections" className="text-[#5C5446] hover:text-[#2C2C2C]" onClick={closeMobileMenu}>Glossa Special Collections</Link>
                </div>
              )}
            </div>

            <Link to="/journal-policies" className="text-[#2C2C2C] font-semibold text-[1.1rem] py-3 border-b border-[#F0EBE1]" onClick={closeMobileMenu}>Journal Policies</Link>
            <Link to="/publisher-policies" className="text-[#2C2C2C] font-semibold text-[1.1rem] py-3 border-b border-[#F0EBE1]" onClick={closeMobileMenu}>Publisher Policies</Link>

            {/* About */}
            <div>
              <button onClick={() => toggleMobileDropdown('about')} className="w-full flex justify-between items-center text-[#2C2C2C] font-semibold text-[1.1rem] py-3 border-b border-[#F0EBE1]">
                About
                <svg className={`w-5 h-5 transform transition-transform ${openMobileDropdown === 'about' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {openMobileDropdown === 'about' && (
                <div className="bg-[#F9F6F0] pl-6 py-2 flex flex-col space-y-3">
                  <Link to="/team" className="text-[#5C5446] hover:text-[#2C2C2C]" onClick={closeMobileMenu}>Editorial Team</Link>
                  <Link to="/become-reviewer" className="text-[#5C5446] hover:text-[#2C2C2C]" onClick={closeMobileMenu}>Become A Reviewer</Link>
                  <Link to="/contact" className="text-[#5C5446] hover:text-[#2C2C2C]" onClick={closeMobileMenu}>Contact</Link>
                  <Link to="/governance" className="text-[#5C5446] hover:text-[#2C2C2C]" onClick={closeMobileMenu}>Governance</Link>
                </div>
              )}
            </div>

            <div className="pt-4 pb-6 flex flex-col space-y-3">
              <Link to="/register" className="block text-center w-full px-6 py-3 bg-white border border-[#2C2C2C] text-[#2C2C2C] rounded font-bold tracking-wide" onClick={closeMobileMenu}>
                Register
              </Link>
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

