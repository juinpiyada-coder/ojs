import React from 'react';
import { Link } from 'react-router-dom';

const Submission = () => {
  return (
    <div className="flex-grow py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-12">
          <h2 className="text-4xl font-bold text-[#2C2C2C]">Submission Guidelines</h2>
          <div className="ml-6 flex-grow h-px bg-[#E5E0D8]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="md:col-span-3">
            <p className="text-[#5C5446] mb-8 font-serif text-lg leading-relaxed">
              All manuscripts must be submitted via our online portal. Authors must ensure their papers adhere to the journal's strict formatting and ethical guidelines before initiating the submission process.
            </p>
            <div className="bg-[#FAF9F6] p-8 rounded-xl border border-[#F0EBE1]">
              <ul className="space-y-5 text-[#2C2C2C] font-medium">
                <li className="flex items-start">
                  <span className="text-[#8E7C68] mr-3 font-bold text-lg">01.</span> 
                  <span>Manuscripts must be in PDF or Word format and follow the official journal template.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8E7C68] mr-3 font-bold text-lg">02.</span> 
                  <span>Maximum length is 10,000 words, including references and appendices.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8E7C68] mr-3 font-bold text-lg">03.</span> 
                  <span>Include a 250-word abstract summarizing the methodology and key findings.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8E7C68] mr-3 font-bold text-lg">04.</span> 
                  <span>Ensure double-blind peer review compliance by completely removing author names from the manuscript body.</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="md:col-span-2 flex items-center justify-center bg-[#F9F6F0] p-10 border border-[#E5E0D8] rounded-2xl shadow-sm text-center">
             <div className="w-full">
               <h4 className="text-2xl font-bold mb-4 text-[#2C2C2C]">Ready to Submit?</h4>
               <p className="text-[0.95rem] text-[#8E7C68] mb-8 font-serif">You must be logged in to access the author dashboard and submit a manuscript.</p>
               <Link to="/login" className="block w-full py-4 bg-[#2C2C2C] text-white rounded-xl font-bold hover:bg-[#1A1A1A] transition-colors shadow-md">
                 Go to Login
               </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submission;
