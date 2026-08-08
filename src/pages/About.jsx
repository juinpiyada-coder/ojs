import React from 'react';

const About = () => {
  return (
    <div className="flex-grow bg-[#F9F6F0] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#2C2C2C] mb-6 tracking-tight">About The Journal</h1>
          <div className="w-24 h-1 bg-[#8E7C68] mx-auto rounded-full mb-8"></div>
          <p className="text-lg md:text-xl text-[#5C5446] max-w-3xl mx-auto font-serif leading-relaxed">
            The Literary Scientist is a premier, peer-reviewed multi-disciplinary journal dedicated to exploring the profound intersections between literature and the sciences.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch mb-20">
          <div className="bg-white p-10 md:p-12 rounded-2xl shadow-sm border border-[#E5E0D8] flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F9F6F0] rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6 relative z-10">Our Mission</h2>
            <div className="prose prose-lg text-[#5C5446] font-serif relative z-10">
              <p className="mb-6 leading-relaxed">
                We believe that the divide between the humanities and the sciences is an artificial one. Our mission is to foster academic research that bridges this gap, providing a platform for scholars, scientists, and writers to engage in meaningful cross-disciplinary dialogue.
              </p>
              <p className="leading-relaxed">
                By publishing rigorous, innovative research, we aim to uncover how scientific advancements influence literary expression, and conversely, how literary imagination shapes scientific inquiry.
              </p>
            </div>
          </div>

          <div className="bg-[#1E2530] p-10 md:p-12 rounded-2xl shadow-lg flex flex-col justify-center text-white relative overflow-hidden group">
             <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#2A3342] rounded-tr-full -ml-20 -mb-20 transition-transform group-hover:scale-110"></div>
             <h2 className="text-2xl font-bold text-white mb-6 relative z-10">Aims & Scope</h2>
             <ul className="space-y-6 relative z-10 font-serif">
               <li className="flex items-start">
                 <svg className="w-6 h-6 text-[#8E7C68] mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 <span className="text-gray-300 leading-relaxed"><strong className="text-white font-sans block mb-1">Literature & Medicine</strong> Narratives of illness, medical ethics in fiction, and the history of medicine through literary texts.</span>
               </li>
               <li className="flex items-start">
                 <svg className="w-6 h-6 text-[#8E7C68] mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 <span className="text-gray-300 leading-relaxed"><strong className="text-white font-sans block mb-1">Science Fiction & Futurism</strong> Critical analysis of speculative fiction, technological determinism, and dystopian literatures.</span>
               </li>
               <li className="flex items-start">
                 <svg className="w-6 h-6 text-[#8E7C68] mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 <span className="text-gray-300 leading-relaxed"><strong className="text-white font-sans block mb-1">Eco-Criticism</strong> Literature's role in environmental science, climate change narratives, and the Anthropocene.</span>
               </li>
             </ul>
          </div>
        </div>

        {/* Stats / Info Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E0D8]">
            <div className="text-3xl font-bold text-[#8E7C68] mb-2">Open</div>
            <div className="text-sm font-semibold text-[#2C2C2C] uppercase tracking-wider">Access</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E0D8]">
            <div className="text-3xl font-bold text-[#8E7C68] mb-2">100%</div>
            <div className="text-sm font-semibold text-[#2C2C2C] uppercase tracking-wider">Peer Reviewed</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E0D8]">
            <div className="text-3xl font-bold text-[#8E7C68] mb-2">Global</div>
            <div className="text-sm font-semibold text-[#2C2C2C] uppercase tracking-wider">Readership</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E5E0D8]">
            <div className="text-3xl font-bold text-[#8E7C68] mb-2">Biannual</div>
            <div className="text-sm font-semibold text-[#2C2C2C] uppercase tracking-wider">Publication</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
