import React from 'react';
import { Link } from 'react-router-dom';
import { editors } from '../data/editors';

const Team = () => {
  return (
    <div className="flex-grow py-24 px-4 bg-[#F9F6F0]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-12">
          <h2 className="text-4xl font-bold text-[#2C2C2C]">Our Team</h2>
          <div className="ml-6 flex-grow h-px bg-[#E5E0D8]"></div>
        </div>
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-[#E5E0D8]">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 text-center">
            {editors.map((editor) => (
              <Link to={`/editor/${editor.id}`} key={editor.id} className="group block">
                <div className="w-24 h-24 bg-[#FAF9F6] border border-[#E5E0D8] rounded-full mx-auto mb-4 shadow-sm group-hover:shadow-md transition-shadow flex items-center justify-center overflow-hidden text-2xl text-gray-500 font-bold uppercase">
                  {editor.image ? (
                    <img src={editor.image} alt={editor.name} className="w-full h-full object-cover" />
                  ) : (
                    editor.name.charAt(0)
                  )}
                </div>
                <h4 className="font-bold text-[#2C2C2C] group-hover:text-[#8E7C68] transition-colors">{editor.name}</h4>
                <p className="text-xs text-[#8E7C68] uppercase tracking-wider mt-1">{editor.role}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
