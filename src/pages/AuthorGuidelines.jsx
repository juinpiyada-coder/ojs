import React from 'react';

const AuthorGuidelines = () => {
  return (
    <div className="flex-grow bg-[#F9F6F0] py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-10">
          <h2 className="text-4xl font-bold text-[#2C2C2C]">Author Guidelines</h2>
          <div className="ml-6 flex-grow h-px bg-[#E5E0D8]"></div>
        </div>
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-[#E5E0D8]">
          <div className="prose prose-lg text-[#5C5446] font-serif">
            <p className="mb-6 leading-relaxed">
              Information on formatting, style, and requirements for authors submitting manuscripts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorGuidelines;
