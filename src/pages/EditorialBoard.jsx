import React from 'react';
import { Link } from 'react-router-dom';
import { editors } from '../data/editors';

const EditorialBoard = () => {
  return (
    <div className="flex-grow py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-12">
          <h2 className="text-4xl font-bold text-[#2C2C2C]">Editorial Board</h2>
          <div className="ml-6 flex-grow h-px bg-[#E5E0D8]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {editors.map((editor) => (
            <Link to={`/editor/${editor.id}`} key={editor.id} className="block group">
              <div className="bg-[#FAF9F6] p-8 rounded-xl shadow-sm border border-[#F0EBE1] text-center group-hover:shadow-lg transition-all transform group-hover:-translate-y-1 h-full flex flex-col">
                <div className="w-28 h-28 bg-[#E5E0D8] rounded-full mx-auto mb-6 shadow-inner flex items-center justify-center text-3xl text-gray-500 font-bold uppercase overflow-hidden">
                  {editor.image ? (
                    <img src={editor.image} alt={editor.name} className="w-full h-full object-cover" />
                  ) : (
                    editor.name.charAt(0)
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#2C2C2C] mb-1 group-hover:text-[#8E7C68] transition-colors">{editor.name}</h3>
                <p className="text-[#8E7C68] font-serif text-sm mb-3">{editor.role}</p>
                <div className="w-8 h-px bg-[#E5E0D8] mx-auto mb-3"></div>
                <p className="text-[#5C5446] text-sm mt-auto">{editor.affiliation}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorialBoard;
