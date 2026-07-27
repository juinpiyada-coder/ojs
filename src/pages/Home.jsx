import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex-grow flex flex-col">
      {/* Hero Section */}
      <section className="bg-white border-b border-[#E5E0D8] py-32 px-4 relative overflow-hidden flex-grow flex items-center">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-[#F9F6F0] z-0"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#2C2C2C] leading-tight mb-6 tracking-tight">
            Advancing the Frontier of Academic Research
          </h1>
          <p className="text-xl md:text-2xl text-[#8E7C68] mb-12 font-serif max-w-3xl mx-auto">
            The Open Journal System is a leading peer-reviewed publication dedicated to disseminating high-quality original research across interdisciplinary fields.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/call-for-papers" className="px-8 py-4 bg-[#2C2C2C] text-[#F9F6F0] rounded shadow-lg hover:bg-[#1A1A1A] transition-all hover:-translate-y-1 font-bold text-lg">
              View Current Issue
            </Link>
            <Link to="/submission" className="px-8 py-4 bg-white border border-[#E5E0D8] text-[#2C2C2C] rounded shadow hover:shadow-md hover:bg-[#F9F6F0] transition-all hover:-translate-y-1 font-bold text-lg">
              Submit Manuscript
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
