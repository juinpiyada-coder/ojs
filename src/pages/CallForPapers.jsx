import React from 'react';

const CallForPapers = () => {
  return (
    <div className="flex-grow py-24 px-4 bg-[#F9F6F0]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-12">
          <h2 className="text-4xl font-bold text-[#2C2C2C]">Call For Papers</h2>
          <div className="ml-6 flex-grow h-px bg-[#E5E0D8]"></div>
        </div>
        <div className="bg-[#2C2C2C] text-[#F9F6F0] p-12 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-[#8E7C68] text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6">Open Now</span>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Special Issue: Innovations in Technology (2027)</h3>
            <p className="mb-10 opacity-90 font-serif text-lg max-w-3xl leading-relaxed">
              We invite researchers and scholars to submit their original work for our upcoming special issue. Topics of interest include but are not limited to Artificial Intelligence, Sustainable Computing, and Quantum Algorithms.
            </p>
            <div className="flex flex-col sm:flex-row gap-10 p-6 bg-[#1A1A1A] rounded-xl border border-gray-700/50 inline-flex">
              <div>
                <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Submission Deadline</p>
                <p className="text-xl font-bold text-[#E5E0D8]">December 31, 2026</p>
              </div>
              <div className="hidden sm:block w-px bg-gray-700"></div>
              <div>
                <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Publication Date</p>
                <p className="text-xl font-bold text-[#E5E0D8]">March 15, 2027</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallForPapers;
