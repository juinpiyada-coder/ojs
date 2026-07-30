import React from 'react';
import { Link } from 'react-router-dom';

const Template = () => {
  return (
    <main className="flex-grow bg-[#F9F6F0]">
      {/* Hero Section */}
      <section className="bg-[#1E2530] text-[#F9F6F0] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 uppercase">Manuscript Template</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 font-serif italic">
            Standardize your submission with our formatting guidelines
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-10 md:p-14 rounded shadow-sm border border-[#E5E0D8] prose prose-lg text-[#5C5446] max-w-none text-center">
            
            <div className="w-20 h-20 mx-auto bg-[#FAF9F6] rounded-full flex items-center justify-center border border-[#E5E0D8] mb-6">
              <svg className="w-10 h-10 text-[#8E7C68]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-[#2C2C2C] mb-4">Download Official Template</h2>
            <p className="mb-8 max-w-2xl mx-auto">
              To expedite the review and publication process, we strongly encourage all authors to format their manuscripts using our official Microsoft Word template.
            </p>
            
            <a href="#" className="inline-flex items-center px-8 py-4 bg-[#2C2C2C] text-white font-bold rounded shadow hover:bg-[#1A1A1A] transition-all">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Download Template (.docx)
            </a>
            
            <div className="mt-12 text-left border-t border-[#E5E0D8] pt-8">
               <h3 className="text-xl font-bold text-[#2C2C2C] mb-4">Template Guidelines</h3>
               <ul className="list-disc pl-5 space-y-2 text-[#5C5446]">
                 <li>Use Times New Roman, 12pt font.</li>
                 <li>Double-space all text, including abstract and references.</li>
                 <li>Ensure all figures and tables are numbered chronologically and cited in the text.</li>
                 <li>Follow the APA 7th edition formatting for references.</li>
               </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Template;
