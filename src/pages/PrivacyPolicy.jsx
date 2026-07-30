import React from 'react';

const PrivacyPolicy = () => {
  return (
    <main className="flex-grow bg-[#F9F6F0]">
      <section className="bg-[#1E2530] text-[#F9F6F0] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 uppercase">Privacy Policy</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 font-serif italic">
            How we protect and use your data
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-10 md:p-14 rounded shadow-sm border border-[#E5E0D8] prose prose-lg text-[#5C5446] max-w-none">
            <p>
              The names and email addresses entered in this journal site will be used exclusively for the stated purposes of this journal and will not be made available for any other purpose or to any other party.
            </p>
            <h3 className="text-xl font-bold text-[#2C2C2C] mt-8 mb-4">Data Collection</h3>
            <p>
              Data collected from registered and non-registered users of this journal falls within the scope of the standard functioning of peer-reviewed journals. It includes information that makes communication possible for the editorial process; it enables collecting aggregated data on submissions and publications; and it allows tracking geopolitical and social elements of scholarly communication.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
