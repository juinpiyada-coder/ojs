import React from 'react';

const EditorialBoard = () => {
  return (
    <div className="flex-grow py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-12">
          <h2 className="text-4xl font-bold text-[#2C2C2C]">Editorial Board</h2>
          <div className="ml-6 flex-grow h-px bg-[#E5E0D8]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-[#FAF9F6] p-8 rounded-xl shadow-sm border border-[#F0EBE1] text-center hover:shadow-md transition-shadow">
              <div className="w-28 h-28 bg-[#E5E0D8] rounded-full mx-auto mb-6 shadow-inner"></div>
              <h3 className="text-xl font-bold text-[#2C2C2C] mb-1">Dr. Jane Doe</h3>
              <p className="text-[#8E7C68] font-serif text-sm mb-3">Editor-in-Chief</p>
              <div className="w-8 h-px bg-[#E5E0D8] mx-auto mb-3"></div>
              <p className="text-[#5C5446] text-sm">University of Academic Excellence</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorialBoard;
