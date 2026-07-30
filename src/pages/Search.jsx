import React from 'react';

const Search = () => {
  return (
    <div className="flex-grow bg-[#F9F6F0] py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-10">
          <h2 className="text-4xl font-bold text-[#2C2C2C]">Search</h2>
          <div className="ml-6 flex-grow h-px bg-[#E5E0D8]"></div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E0D8]">
          <div className="flex flex-col space-y-4">
            <input 
              type="text" 
              placeholder="Search articles, authors, or keywords..." 
              className="w-full px-4 py-3 border border-[#E5E0D8] rounded focus:outline-none focus:border-[#8E7C68] transition-colors font-serif text-lg text-[#5C5446]"
            />
            <button className="self-end px-8 py-3 bg-[#2C2C2C] text-white rounded font-bold tracking-wide hover:bg-[#4A4A4A] transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
