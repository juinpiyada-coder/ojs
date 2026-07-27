import React from 'react';

const About = () => {
  return (
    <div className="flex-grow bg-[#F9F6F0] py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-10">
          <h2 className="text-4xl font-bold text-[#2C2C2C]">About Us</h2>
          <div className="ml-6 flex-grow h-px bg-[#E5E0D8]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white p-12 rounded-2xl shadow-sm border border-[#E5E0D8]">
          <div className="prose prose-lg text-[#5C5446] font-serif">
            <p className="mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.
            </p>
            <p className="leading-relaxed">
              Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
            </p>
          </div>
          <div className="bg-[#E5E0D8] h-80 rounded-xl shadow-inner flex items-center justify-center text-[#8E7C68] italic">
             [ Journal Image / Graphic Placeholder ]
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
