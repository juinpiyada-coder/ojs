import React from 'react';

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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="group">
                <div className="w-24 h-24 bg-[#FAF9F6] border border-[#E5E0D8] rounded-full mx-auto mb-4 shadow-sm group-hover:shadow-md transition-shadow"></div>
                <h4 className="font-bold text-[#2C2C2C]">Staff Member {i}</h4>
                <p className="text-xs text-[#8E7C68] uppercase tracking-wider mt-1">Role Title</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
