import React from 'react';
import { Link } from 'react-router-dom';
import { FaAward, FaExternalLinkAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#191F28] text-white pt-12 pb-10 mt-auto border-t border-[#2D3748]">
      
      {/* 1. OFFICIAL PUBLISHER & COPYRIGHT NOTICE (FIRST SECTION IN TIMES NEW ROMAN) */}
      <div className="max-w-6xl mx-auto px-4 text-center mb-12 space-y-3.5 font-['Times_New_Roman',Times,serif] text-[15px] sm:text-[16px] text-gray-300 leading-relaxed border-b border-[#2D3748] pb-10">
        <p className="text-gray-200">
          <strong className="font-bold text-white">Publisher:</strong> Md Arif Uddin Mondal (Editor_in_chief)
        </p>
        
        <p className="text-gray-300 max-w-5xl mx-auto">
          <strong className="font-bold text-white">Publisher's Designation:</strong> Assistant Professor at the Department of Basic Science and Humanities, Swami Vivekananda Institute of Science and Technology
        </p>
        
        <p className="text-gray-300">
          <strong className="font-bold text-white">Publisher's Address:</strong> Vill- Khodarbazar Nischintapur, P.O+P.S: Baruipur 24 Parganas South, Kolkata-700144
        </p>
        
        <p className="text-gray-300">
          <strong className="font-bold text-white">Phone:</strong> 7980206261 <span className="mx-2 text-gray-500">|</span> 
          <strong className="font-bold text-white">Email:</strong>{' '}
          <a href="mailto:arifuddinmondal@svist.org" className="text-[#D4AF37] hover:underline">
            arifuddinmondal@svist.org
          </a>{' '}
          and{' '}
          <a href="mailto:editor_in_chief@theliteraryscientist.org" className="text-[#D4AF37] hover:underline">
            editor_in_chief@theliteraryscientist.org
          </a>
        </p>
        
        <p className="text-gray-300 pt-2 text-[14px] sm:text-[15px]">
          Copyright © [2023] [The Literary Scientist A Multi-Disciplinary Journal for Literature and Science]
        </p>
      </div>

      {/* 2. INDEXING & ARCHIVING PARTNERS (GOOGLE SCHOLAR & ZENODO) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-[#222A36] border border-[#323D4E] rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              Scholarly Indexing & Repositories
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#F9F6F0] font-serif mt-1">
              Indexed In & Digital Archiving Partners
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              All published manuscripts in The Literary Scientist are permanently deposited, discoverable, and indexed with global digital identifiers.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            
            {/* Google Scholar Card */}
            <a 
              href="https://scholar.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white hover:bg-[#FAF9F6] border border-gray-200 rounded-2xl px-6 py-3.5 flex items-center gap-4 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
              title="Indexed in Google Scholar"
            >
              <img 
                src="/google-scholar.png" 
                alt="Google Scholar" 
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105" 
              />
              <div className="text-left">
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-700 font-bold block">
                  Citations & Indexing
                </span>
                <span className="text-sm font-bold text-gray-900 font-serif block">
                  Google Scholar
                </span>
              </div>
              <FaExternalLinkAlt className="text-xs text-gray-400 group-hover:text-emerald-700 ml-1 transition-colors" />
            </a>

            {/* Zenodo Repository Card */}
            <a 
              href="https://zenodo.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white hover:bg-[#FAF9F6] border border-gray-200 rounded-2xl px-6 py-3.5 flex items-center gap-4 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
              title="Open Access Repository & DOI by Zenodo / CERN"
            >
              <img 
                src="/zenodo.png" 
                alt="Zenodo Open Science" 
                className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105" 
              />
              <div className="text-left">
                <span className="text-[10px] uppercase font-mono tracking-wider text-blue-700 font-bold block">
                  CERN Open Science DOI
                </span>
                <span className="text-sm font-bold text-gray-900 font-serif block">
                  Zenodo Repository
                </span>
              </div>
              <FaExternalLinkAlt className="text-xs text-gray-400 group-hover:text-blue-700 ml-1 transition-colors" />
            </a>

          </div>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION SITEMAP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm mb-12">
        <div>
          <h4 className="font-bold text-base mb-4 text-[#F9F6F0] font-serif border-b border-[#333C4D] pb-2">About Journal</h4>
          <ul className="space-y-2.5 text-gray-400 text-xs">
            <li><Link to="/about" className="hover:text-white transition-colors">Aim & Scope</Link></li>
            <li><Link to="/editorial-board" className="hover:text-white transition-colors">Editorial Board</Link></li>
            <li><Link to="/team" className="hover:text-white transition-colors">Advisory Team</Link></li>
            <li><Link to="/ethics" className="hover:text-white transition-colors">Publication Ethics</Link></li>
            <li><Link to="/governance" className="hover:text-white transition-colors">Governance & Oversight</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-base mb-4 text-[#F9F6F0] font-serif border-b border-[#333C4D] pb-2">For Authors</h4>
          <ul className="space-y-2.5 text-gray-400 text-xs">
            <li><Link to="/author-guidelines" className="hover:text-white transition-colors">Author Guidelines</Link></li>
            <li><Link to="/template" className="hover:text-white transition-colors">Manuscript Template</Link></li>
            <li><Link to="/start-submission" className="hover:text-[#D4AF37] font-semibold transition-colors">Submit Manuscript</Link></li>
            <li><Link to="/call-for-papers" className="hover:text-white transition-colors">Call For Papers (Vol. II)</Link></li>
            <li><Link to="/anonymous-review" className="hover:text-white transition-colors">Anonymous Review Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-base mb-4 text-[#F9F6F0] font-serif border-b border-[#333C4D] pb-2">For Readers</h4>
          <ul className="space-y-2.5 text-gray-400 text-xs">
            <li><Link to="/current-issue" className="hover:text-white transition-colors">Current Issue (Vol. I, Iss. III)</Link></li>
            <li><Link to="/issues" className="hover:text-white transition-colors">All Articles & Directory</Link></li>
            <li><Link to="/archive" className="hover:text-white transition-colors">Archived Volumes</Link></li>
            <li><Link to="/special-collections" className="hover:text-white transition-colors">Special Collections</Link></li>
            <li><Link to="/search" className="hover:text-white transition-colors">Search Journal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-base mb-4 text-[#F9F6F0] font-serif border-b border-[#333C4D] pb-2">Policies & Legal</h4>
          <ul className="space-y-2.5 text-gray-400 text-xs">
            <li><Link to="/journal-policies" className="hover:text-white transition-colors">Journal Policies</Link></li>
            <li><Link to="/publisher-policies" className="hover:text-white transition-colors">Publisher Policies</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-of-use" className="hover:text-white transition-colors">Terms of Use</Link></li>
            <li><Link to="/accessibility" className="hover:text-white transition-colors">Accessibility Statement</Link></li>
          </ul>
        </div>
      </div>

      {/* 4. COPYRIGHT & SOCIAL BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 pt-8 border-t border-[#2D3748]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#252E3B] text-[#D4AF37] rounded-full text-[11px] font-mono font-bold border border-[#3A4556]">
            <FaAward className="text-xs" />
            <span>ISSN: 3048-7366 (ONLINE)</span>
          </span>
          <span className="text-gray-400">
            Open Access peer-reviewed journal under CC BY 4.0.
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <a 
            href="#" 
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
            aria-label="LinkedIn"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            <span>LinkedIn</span>
          </a>
          <a 
            href="#" 
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
            aria-label="Facebook"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z"/></svg>
            <span>Facebook</span>
          </a>
          <a 
            href="#" 
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
            aria-label="Twitter / X"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <span>X (Twitter)</span>
          </a>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
