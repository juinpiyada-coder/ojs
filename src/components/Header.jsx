import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaBookOpen,
  FaFilePdf,
  FaAward,
  FaSearch,
  FaUserEdit,
  FaShieldAlt,
  FaChevronDown,
  FaTimes,
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaUsers,
  FaFileAlt
} from 'react-icons/fa';
import { resolveFileUrl, resolveImageUrl } from '../utils/api';
import { useBrand } from '../context/BrandingContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { brand } = useBrand();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown(null);
  }, [location.pathname]);

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

  const isActive = (path) => location.pathname === path;
  const isArticlesActive = ['/current-issue', '/issues', '/archive', '/special-collections'].includes(location.pathname);
  const isSubmissionsActive = ['/author-guidelines', '/template', '/anonymous-review', '/glossa-special-collections', '/start-submission', '/submission'].includes(location.pathname);
  const isPoliciesActive = ['/journal-policies', '/publisher-policies', '/ethics', '/privacy-policy', '/terms-of-use', '/accessibility'].includes(location.pathname);
  const isAboutActive = ['/about', '/editorial-board', '/team', '/become-reviewer', '/governance', '/contact'].includes(location.pathname);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#FDFBF7]/95 backdrop-blur-xl shadow-md border-b border-[#E8E2D6]' 
        : 'bg-white border-b border-[#ECE7DE]'
    }`}>
      {/* Top Utility Bar */}
      <div className="w-full bg-[#FAF8F5] border-b border-[#EAE4D9] text-[#6E6456] py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center text-xs">
          
          {/* Left: Clean ISSN & Open Access Indicator */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-[#7A6E5E] tracking-wide text-xs">
              ISSN: <span className="font-bold text-[#1C2024]">3048-7366</span> (online)
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#C5BAA8]"></span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[#857766] text-[11px] font-serif">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Open Access & Peer-Reviewed
            </span>
          </div>

          {/* Right: Quick Links & Minimal Social Share */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs text-[#7A6E5E]">
            <Link 
              to="/call-for-papers" 
              className="hover:text-[#1C2024] font-medium transition-colors hidden md:inline"
            >
              Call for Papers
            </Link>
            <Link 
              to="/current-issue" 
              className="hover:text-[#1C2024] font-medium transition-colors hidden md:inline"
            >
              Current Issue (Vol. I Issue III)
            </Link>
            
            <div className="flex items-center gap-2 text-[#7A6E5E]">
              <span className="uppercase tracking-widest text-[10px] font-medium opacity-80 hidden sm:inline">Share:</span>
              <a 
                href="#" 
                className="w-5 h-5 rounded hover:bg-[#EAE3D5] text-[#6E6456] hover:text-[#1C2024] flex items-center justify-center transition-all" 
                aria-label="Facebook" 
                title="Facebook"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z"/></svg>
              </a>
              <a 
                href="#" 
                className="w-5 h-5 rounded hover:bg-[#EAE3D5] text-[#6E6456] hover:text-[#1C2024] flex items-center justify-center transition-all" 
                aria-label="Twitter / X" 
                title="Twitter / X"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a 
                href="#" 
                className="w-5 h-5 rounded hover:bg-[#EAE3D5] text-[#6E6456] hover:text-[#1C2024] flex items-center justify-center transition-all" 
                aria-label="LinkedIn" 
                title="LinkedIn"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4">
        <div className="flex justify-between items-center gap-4">
          
          {/* Authentic Journal Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="hover:opacity-90 transition-opacity flex items-center gap-2"
              onClick={closeMobileMenu}
              aria-label="The Literary Scientist Home"
            >
              <img 
                src="/logo.png" 
                alt="The Literary Scientist" 
                className="h-10 sm:h-11 md:h-12 lg:h-13 w-auto max-w-[220px] sm:max-w-[260px] md:max-w-[300px] lg:max-w-[330px] object-contain" 
              />
            </Link>
          </div>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-nowrap">
            
            {/* Home */}
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors whitespace-nowrap ${
                isActive('/') 
                  ? 'text-[#1C2024] font-bold border-b-2 border-[#1C2024] pb-0.5' 
                  : 'text-[#4A4237] hover:text-[#1C2024]'
              }`}
            >
              Home
            </Link>

            {/* Articles Dropdown */}
            <div className="relative group py-2 flex-shrink-0">
              <button 
                type="button"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isArticlesActive 
                    ? 'text-[#1C2024] font-bold border-b-2 border-[#1C2024] pb-0.5' 
                    : 'text-[#4A4237] hover:text-[#1C2024]'
                }`}
              >
                <span>Articles</span>
                <FaChevronDown className="text-[10px] transition-transform duration-200 group-hover:rotate-180 opacity-60" />
              </button>
              <div className="absolute left-0 mt-2 w-60 bg-white border border-[#E5DFD4] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 transform group-hover:translate-y-0 translate-y-1">
                <Link 
                  to="/current-issue" 
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/current-issue') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  <FaBookOpen className="text-[#9E8B75] text-xs" />
                  <span>Current Issue (Vol I, Iss III)</span>
                </Link>
                <Link 
                  to="/issues" 
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/issues') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  <FaFileAlt className="text-[#9E8B75] text-xs" />
                  <span>All Articles & Directory</span>
                </Link>
                <Link 
                  to="/archive" 
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/archive') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  <FaAward className="text-[#9E8B75] text-xs" />
                  <span>Archived Volumes</span>
                </Link>
                <Link 
                  to="/special-collections" 
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/special-collections') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  <FaBookOpen className="text-[#9E8B75] text-xs" />
                  <span>Special Collections</span>
                </Link>
              </div>
            </div>

            {/* Submissions Dropdown */}
            <div className="relative group py-2 flex-shrink-0">
              <button 
                type="button"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isSubmissionsActive 
                    ? 'text-[#1C2024] font-bold border-b-2 border-[#1C2024] pb-0.5' 
                    : 'text-[#4A4237] hover:text-[#1C2024]'
                }`}
              >
                <span>Submissions</span>
                <FaChevronDown className="text-[10px] transition-transform duration-200 group-hover:rotate-180 opacity-60" />
              </button>
              <div className="absolute left-0 mt-2 w-68 bg-white border border-[#E5DFD4] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 transform group-hover:translate-y-0 translate-y-1">
                <Link 
                  to="/start-submission" 
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-[#B83327] bg-[#FCEEEB] hover:bg-[#F8DFDA] transition-colors mb-1"
                >
                  <FaUserEdit className="text-[#B83327] text-xs" />
                  <span>Submit Manuscript Online</span>
                </Link>
                <Link 
                  to="/call-for-papers" 
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/call-for-papers') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  <FaFileAlt className="text-[#9E8B75] text-xs" />
                  <span>Call For Papers (Vol. II)</span>
                </Link>
                <Link 
                  to="/author-guidelines" 
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/author-guidelines') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  <FaInfoCircle className="text-[#9E8B75] text-xs" />
                  <span>Author Guidelines</span>
                </Link>
                <Link 
                  to="/template" 
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/template') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  <FaFilePdf className="text-[#9E8B75] text-xs" />
                  <span>Manuscript Template</span>
                </Link>
                <Link 
                  to="/anonymous-review" 
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/anonymous-review') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  <FaShieldAlt className="text-[#9E8B75] text-xs" />
                  <span>Ensuring Anonymous Review</span>
                </Link>
              </div>
            </div>

            {/* Policies & Ethics Dropdown */}
            <div className="relative group py-2 flex-shrink-0">
              <button 
                type="button"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isPoliciesActive 
                    ? 'text-[#1C2024] font-bold border-b-2 border-[#1C2024] pb-0.5' 
                    : 'text-[#4A4237] hover:text-[#1C2024]'
                }`}
              >
                <span>Policies & Ethics</span>
                <FaChevronDown className="text-[10px] transition-transform duration-200 group-hover:rotate-180 opacity-60" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white border border-[#E5DFD4] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 transform group-hover:translate-y-0 translate-y-1">
                <Link 
                  to="/journal-policies" 
                  className={`block px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/journal-policies') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  Journal Policies
                </Link>
                <Link 
                  to="/publisher-policies" 
                  className={`block px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/publisher-policies') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  Publisher Policies
                </Link>
                <Link 
                  to="/ethics" 
                  className={`block px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/ethics') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  Ethics & Malpractice
                </Link>
                <Link 
                  to="/privacy-policy" 
                  className={`block px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/privacy-policy') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/terms-of-use" 
                  className={`block px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/terms-of-use') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  Terms of Use
                </Link>
                <Link 
                  to="/accessibility" 
                  className={`block px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/accessibility') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  Accessibility
                </Link>
              </div>
            </div>

            {/* About Dropdown */}
            <div className="relative group py-2 flex-shrink-0">
              <button 
                type="button"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isAboutActive 
                    ? 'text-[#1C2024] font-bold border-b-2 border-[#1C2024] pb-0.5' 
                    : 'text-[#4A4237] hover:text-[#1C2024]'
                }`}
              >
                <span>About</span>
                <FaChevronDown className="text-[10px] transition-transform duration-200 group-hover:rotate-180 opacity-60" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white border border-[#E5DFD4] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2 transform group-hover:translate-y-0 translate-y-1">
                <Link 
                  to="/about" 
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/about') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  <FaInfoCircle className="text-[#9E8B75] text-xs" />
                  <span>Aim & Scope</span>
                </Link>
                <Link 
                  to="/editorial-board" 
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/editorial-board') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  <FaUsers className="text-[#9E8B75] text-xs" />
                  <span>Editorial Board</span>
                </Link>
                <Link 
                  to="/team" 
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/team') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  <FaUsers className="text-[#9E8B75] text-xs" />
                  <span>Our Team</span>
                </Link>
                <Link 
                  to="/become-reviewer" 
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/become-reviewer') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  <FaShieldAlt className="text-[#9E8B75] text-xs" />
                  <span>Become A Reviewer</span>
                </Link>
                <Link 
                  to="/governance" 
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/governance') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  <FaAward className="text-[#9E8B75] text-xs" />
                  <span>Governance</span>
                </Link>
                <Link 
                  to="/contact" 
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/contact') ? 'bg-[#FAF7F2] text-[#1C2024] font-bold' : 'text-[#5A5043] hover:bg-[#FAF7F2] hover:text-[#1C2024]'
                  }`}
                >
                  <FaExternalLinkAlt className="text-[#9E8B75] text-xs" />
                  <span>Contact Editorial Office</span>
                </Link>
              </div>
            </div>
            
            {/* Search Icon Button - Boxed like Image 1 */}
            <Link 
              to="/search" 
              className={`w-9 h-9 rounded-lg border border-[#D5CDC0] text-[#5A5043] hover:text-[#1C2024] hover:border-[#1C2024] hover:bg-white flex items-center justify-center transition-all shadow-2xs flex-shrink-0 ${
                isActive('/search') ? 'bg-white border-[#1C2024] text-[#1C2024]' : 'bg-[#FAF8F5]'
              }`}
              aria-label="Search Journal"
              title="Search Journal Articles"
            >
              <FaSearch className="w-3.5 h-3.5" />
            </Link>
          </nav>

          {/* Right Auth Block */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-3 border-l border-[#E2DBD0] flex-shrink-0">
                <Link 
                  to="/user/dashboard" 
                  className="flex items-center gap-2 text-[#5A5043] hover:text-[#1C2024] font-semibold text-xs transition-colors p-1.5 hover:bg-[#FAF7F2] rounded-lg whitespace-nowrap"
                >
                  {(user?.avatar_url || user?.photoURL || user?.photo_url) ? (
                    <img 
                      src={resolveImageUrl(user.avatar_url || user.photoURL || user.photo_url)} 
                      alt={user.displayName || user.display_name || 'User'} 
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-[#D5CDC0]" 
                    />
                  ) : (
                    <FaUserCircle className="w-6 h-6 text-[#9E8B75]" />
                  )}
                  <span className="hidden xl:inline max-w-[110px] truncate">{user?.displayName || user?.email?.split('@')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                  title="Sign Out"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3.5 flex-shrink-0">
                <Link 
                  to="/register" 
                  className="text-sm font-medium text-[#5A5043] hover:text-[#1C2024] transition-colors whitespace-nowrap"
                >
                  Register
                </Link>
                <Link 
                  to="/login" 
                  className="px-5 py-2 text-sm font-semibold text-[#1C2024] bg-white hover:bg-[#FAF8F5] border border-[#D5CDC0] hover:border-[#1C2024] rounded-lg transition-all shadow-2xs whitespace-nowrap"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center gap-2 flex-shrink-0">
            <Link 
              to="/search" 
              className="p-2 text-[#5A5043] hover:text-[#1C2024] rounded-lg" 
              aria-label="Search"
            >
              <FaSearch className="w-4 h-4" />
            </Link>
            <button 
              className="text-[#1C2024] p-2 rounded-lg hover:bg-[#FAF7F2] transition-colors" 
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FDFBF7] border-t border-[#E8E2D6] shadow-2xl max-h-[85vh] overflow-y-auto w-full animate-fadeIn">
          <nav className="flex flex-col p-4 space-y-2">
            
            {/* Direct Links */}
            <Link 
              to="/" 
              className={`p-3 rounded-xl font-bold text-sm flex items-center justify-between ${
                isActive('/') ? 'bg-[#FAF7F2] text-[#1C2024]' : 'text-[#5A5043]'
              }`}
              onClick={closeMobileMenu}
            >
              <span>Home</span>
            </Link>

            {/* Articles Accordion */}
            <div className="border border-[#E5DFD4] rounded-xl overflow-hidden bg-white/60">
              <button 
                onClick={() => toggleMobileDropdown('articles')} 
                className="w-full flex justify-between items-center p-3 text-sm font-bold text-[#1C2024] bg-[#FAF7F2]/80"
              >
                <span>Articles</span>
                <FaChevronDown className={`text-xs transition-transform ${openMobileDropdown === 'articles' ? 'rotate-180' : ''}`} />
              </button>
              {openMobileDropdown === 'articles' && (
                <div className="p-2 bg-white flex flex-col space-y-1 border-t border-[#E5DFD4]">
                  <Link to="/current-issue" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Current Issue (Vol I, Iss III)</Link>
                  <Link to="/issues" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>All Articles & Directory</Link>
                  <Link to="/archive" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Archived Volumes</Link>
                  <Link to="/special-collections" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Special Collections</Link>
                </div>
              )}
            </div>

            {/* Submissions Accordion */}
            <div className="border border-[#E5DFD4] rounded-xl overflow-hidden bg-white/60">
              <button 
                onClick={() => toggleMobileDropdown('submissions')} 
                className="w-full flex justify-between items-center p-3 text-sm font-bold text-[#1C2024] bg-[#FAF7F2]/80"
              >
                <span>Submissions</span>
                <FaChevronDown className={`text-xs transition-transform ${openMobileDropdown === 'submissions' ? 'rotate-180' : ''}`} />
              </button>
              {openMobileDropdown === 'submissions' && (
                <div className="p-2 bg-white flex flex-col space-y-1 border-t border-[#E5DFD4]">
                  <Link to="/start-submission" className="p-2 text-xs font-bold text-[#B83327] bg-[#FCEEEB] rounded-lg" onClick={closeMobileMenu}>Submit Manuscript Online</Link>
                  <Link to="/call-for-papers" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Call For Papers (Vol. II)</Link>
                  <Link to="/author-guidelines" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Author Guidelines</Link>
                  <Link to="/template" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Manuscript Template</Link>
                  <Link to="/anonymous-review" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Ensuring Anonymous Review</Link>
                </div>
              )}
            </div>

            {/* Policies Accordion */}
            <div className="border border-[#E5DFD4] rounded-xl overflow-hidden bg-white/60">
              <button 
                onClick={() => toggleMobileDropdown('policies')} 
                className="w-full flex justify-between items-center p-3 text-sm font-bold text-[#1C2024] bg-[#FAF7F2]/80"
              >
                <span>Policies & Ethics</span>
                <FaChevronDown className={`text-xs transition-transform ${openMobileDropdown === 'policies' ? 'rotate-180' : ''}`} />
              </button>
              {openMobileDropdown === 'policies' && (
                <div className="p-2 bg-white flex flex-col space-y-1 border-t border-[#E5DFD4]">
                  <Link to="/journal-policies" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Journal Policies</Link>
                  <Link to="/publisher-policies" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Publisher Policies</Link>
                  <Link to="/ethics" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Ethics & Malpractice</Link>
                  <Link to="/privacy-policy" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Privacy Policy</Link>
                  <Link to="/terms-of-use" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Terms of Use</Link>
                  <Link to="/accessibility" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Accessibility</Link>
                </div>
              )}
            </div>

            {/* About Accordion */}
            <div className="border border-[#E5DFD4] rounded-xl overflow-hidden bg-white/60">
              <button 
                onClick={() => toggleMobileDropdown('about')} 
                className="w-full flex justify-between items-center p-3 text-sm font-bold text-[#1C2024] bg-[#FAF7F2]/80"
              >
                <span>About</span>
                <FaChevronDown className={`text-xs transition-transform ${openMobileDropdown === 'about' ? 'rotate-180' : ''}`} />
              </button>
              {openMobileDropdown === 'about' && (
                <div className="p-2 bg-white flex flex-col space-y-1 border-t border-[#E5DFD4]">
                  <Link to="/about" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Aim & Scope</Link>
                  <Link to="/editorial-board" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Editorial Board</Link>
                  <Link to="/team" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Our Team</Link>
                  <Link to="/become-reviewer" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Become A Reviewer</Link>
                  <Link to="/governance" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Governance</Link>
                  <Link to="/contact" className="p-2 text-xs font-semibold text-[#5A5043] hover:text-[#1C2024] hover:bg-[#FAF7F2] rounded-lg" onClick={closeMobileMenu}>Contact Editorial Office</Link>
                </div>
              )}
            </div>

            {/* Mobile Auth Actions */}
            <div className="pt-4 flex flex-col gap-2">
              <Link 
                to="/start-submission" 
                className="w-full py-3 bg-[#B83327] text-white text-center rounded-xl font-bold text-xs uppercase tracking-wider shadow"
                onClick={closeMobileMenu}
              >
                Submit Manuscript
              </Link>

              {isAuthenticated ? (
                <div className="flex flex-col gap-2 pt-2 border-t border-[#E5DFD4]">
                  <Link 
                    to="/user/dashboard" 
                    className="w-full py-2.5 bg-[#1C2024] text-white text-center rounded-xl font-bold text-xs"
                    onClick={closeMobileMenu}
                  >
                    Go to Dashboard
                  </Link>
                  <button 
                    onClick={() => { logout(); closeMobileMenu(); }} 
                    className="w-full py-2 bg-white border border-red-200 text-[#B83327] rounded-xl font-bold text-xs"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5DFD4]">
                  <Link 
                    to="/login" 
                    className="py-2.5 bg-white border border-[#D5CDC0] text-[#1C2024] text-center rounded-xl font-bold text-xs shadow-2xs"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="py-2.5 bg-[#1C2024] text-white text-center rounded-xl font-bold text-xs"
                    onClick={closeMobileMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
