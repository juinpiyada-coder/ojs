import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const SHOW_NEW_DESIGN = true; // Enabled the new design

  if (SHOW_NEW_DESIGN) {
    return (
      <footer className="bg-[#1E2530] text-white py-12 mt-auto">
        
        {/* Publisher Info (First) */}
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center space-y-2 text-[15px] text-gray-400 mb-8">
          <p>
            <strong className="font-bold text-[#F9F6F0]">Publisher:</strong> Md Arif Uddin Mondal
          </p>
          <p>
            <strong className="font-bold text-[#F9F6F0]">Publisher Designation:</strong> Assistant Professor, Department of Basic science and Humanities, Swami Vivekanand institute of Science and Technology
          </p>
          <p>
            <strong className="font-bold text-[#F9F6F0]">Publisher Address:</strong> Vill- Nischintapur khodar bazar, Baruipur, West Bengal, Pin-70144
          </p>
          <p>
            <strong className="font-bold text-[#F9F6F0]">Contact:</strong> 7980206261 <span className="mx-2">|</span> 
            <strong className="font-bold text-[#F9F6F0]">Email ID:</strong> <a href="mailto:khepaarif@gmail.com" className="hover:text-white transition-colors text-white">khepaarif@gmail.com</a>
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#F9F6F0]">About</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white">Aim & Scope</Link></li>
              <li><Link to="/editorial-board" className="hover:text-white">Editorial Board</Link></li>
              <li><Link to="/ethics" className="hover:text-white">Ethics</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#F9F6F0]">Authors</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/author-guidelines" className="hover:text-white">Guidelines</Link></li>
              <li><Link to="/template" className="hover:text-white">Template</Link></li>
              <li><Link to="/start-submission" className="hover:text-white">Submit</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#F9F6F0]">Readers</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/current-issue" className="hover:text-white">Current Issue</Link></li>
              <li><Link to="/archive" className="hover:text-white">Archive</Link></li>
              <li><Link to="/search" className="hover:text-white">Search</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#F9F6F0]">Journal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms-of-use" className="hover:text-white">Terms of Use</Link></li>
              <li><Link to="/accessibility" className="hover:text-white">Accessibility</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Media (Third) */}
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-10 flex justify-center space-x-8 border-t border-[#333C4D]">
          <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003zM20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>
            <span className="text-sm font-semibold">LinkedIn</span>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span className="text-sm font-semibold">Facebook</span>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <span className="text-sm font-semibold">X (Twitter)</span>
          </a>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#1E2530] text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center space-y-2 text-[15px]">
        <p>
          <strong className="font-bold">Publisher:</strong> Md Arif Uddin Mondal
        </p>
        <p>
          <strong className="font-bold">Publisher Designation:</strong> Assistant Professor, Department of Basic science and Humanities, Swami Vivekanand institute of Science and Technology
        </p>
        <p>
          <strong className="font-bold">Publisher Address:</strong> Vill- Nischintapur khodar bazar, Baruipur, West Bengal, Pin-70144
        </p>
        <p>
          <strong className="font-bold">Contact:</strong> 7980206261 <span className="mx-2">|</span> 
          <strong className="font-bold">Email ID:</strong> <a href="mailto:khepaarif@gmail.com" className="hover:text-blue-300 transition-colors">khepaarif@gmail.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
