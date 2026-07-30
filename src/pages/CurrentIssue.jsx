import React from 'react';
import { Link } from 'react-router-dom';

const CurrentIssue = () => {
  return (
    <main className="flex-grow bg-[#F9F6F0]">
      {/* Hero Section */}
      <section className="bg-[#1E2530] text-[#F9F6F0] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 uppercase">Current Issue</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 font-serif italic">
            Volume 5, Issue 2 - Coming Soon
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white p-16 rounded shadow-sm border border-[#E5E0D8]">
             <svg className="w-16 h-16 mx-auto text-[#8E7C68] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
             <h2 className="text-2xl font-bold text-[#2C2C2C] mb-4">No published articles yet</h2>
             <p className="text-[#5C5446] mb-8 max-w-lg mx-auto">
               The current issue is being compiled. Please check back later or browse our archive for past volumes.
             </p>
             <Link to="/archive" className="px-6 py-3 bg-[#2C2C2C] text-white font-bold rounded shadow hover:bg-[#1A1A1A] transition-all">
               Browse Archive
             </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CurrentIssue;
