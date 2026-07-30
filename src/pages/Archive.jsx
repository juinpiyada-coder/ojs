import React from 'react';
import { Link } from 'react-router-dom';

const Archive = () => {
  return (
    <main className="flex-grow bg-[#F9F6F0]">
      {/* Hero Section */}
      <section className="bg-[#1E2530] text-[#F9F6F0] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 uppercase">Archive</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 font-serif italic">
            Browse past volumes and issues
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-8">
            {/* Example Year Block */}
            <div className="bg-white p-8 rounded shadow-sm border border-[#E5E0D8]">
              <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6 border-b border-[#E5E0D8] pb-4">2026</h2>
              
              <div className="ml-4 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#5C5446] mb-3">Volume 4</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border border-[#E5E0D8] rounded hover:border-[#8E7C68] hover:bg-[#FAF9F6] transition-colors cursor-pointer">
                      <p className="font-bold text-[#2C2C2C]">Issue 1</p>
                      <p className="text-sm text-[#8E7C68]">January - June</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Example Year Block 2 */}
            <div className="bg-white p-8 rounded shadow-sm border border-[#E5E0D8]">
              <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6 border-b border-[#E5E0D8] pb-4">2025</h2>
              
              <div className="ml-4 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#5C5446] mb-3">Volume 3</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border border-[#E5E0D8] rounded hover:border-[#8E7C68] hover:bg-[#FAF9F6] transition-colors cursor-pointer">
                      <p className="font-bold text-[#2C2C2C]">Issue 2</p>
                      <p className="text-sm text-[#8E7C68]">July - December</p>
                    </div>
                    <div className="p-4 border border-[#E5E0D8] rounded hover:border-[#8E7C68] hover:bg-[#FAF9F6] transition-colors cursor-pointer">
                      <p className="font-bold text-[#2C2C2C]">Issue 1</p>
                      <p className="text-sm text-[#8E7C68]">January - June</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </main>
  );
};

export default Archive;
