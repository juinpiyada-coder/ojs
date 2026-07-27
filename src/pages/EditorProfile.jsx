import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { editors } from '../data/editors';

const EditorProfile = () => {
  const { id } = useParams();
  const editor = editors.find(e => e.id === parseInt(id));

  if (!editor) {
    return (
      <div className="flex-grow py-24 px-4 bg-white flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-[#2C2C2C] mb-4">Editor Not Found</h2>
        <Link to="/editorial-board" className="text-[#8E7C68] hover:underline">Back to Editorial Board</Link>
      </div>
    );
  }

  return (
    <div className="flex-grow py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <Link to="/editorial-board" className="inline-flex items-center text-[#8E7C68] hover:text-[#5C5446] mb-12 transition-colors font-bold tracking-wide">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Editorial Board
        </Link>
        
        <div className="bg-[#FAF9F6] p-10 md:p-14 rounded-2xl shadow-sm border border-[#F0EBE1] flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48 bg-[#E5E0D8] rounded-full shadow-inner flex items-center justify-center text-5xl text-gray-500 font-bold uppercase overflow-hidden">
            {editor.image ? (
              <img src={editor.image} alt={editor.name} className="w-full h-full object-cover" />
            ) : (
              editor.name.charAt(0)
            )}
          </div>
          
          <div className="flex-grow">
            <h1 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-2">{editor.name}</h1>
            <h2 className="text-xl md:text-2xl text-[#8E7C68] font-serif mb-4">{editor.role}</h2>
            
            <div className="flex items-center text-[#5C5446] mb-8">
              <svg className="w-5 h-5 mr-3 text-[#8E7C68]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              <span className="text-lg">{editor.affiliation}</span>
            </div>
            
            {editor.email && (
              <div className="flex items-center text-[#5C5446] mb-8">
                <svg className="w-5 h-5 mr-3 text-[#8E7C68]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <a href={`mailto:${editor.email}`} className="text-lg hover:text-[#8E7C68] transition-colors">{editor.email}</a>
              </div>
            )}
            
            <div className="w-full h-px bg-[#E5E0D8] mb-8"></div>
            
            <div>
              <h3 className="text-2xl font-bold text-[#2C2C2C] mb-4">Biography</h3>
              <p className="text-[#5C5446] leading-relaxed text-lg">
                {editor.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorProfile;
