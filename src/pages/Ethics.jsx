import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';

const Ethics = () => {
  return (
    <main className="flex-grow bg-[#F9F6F0]">
      <AnimatedSection animation="fade-up">
        {/* Hero Section */}
        <section className="bg-[#1E2530] text-[#F9F6F0] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 uppercase">Publication Ethics</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 font-serif italic">
              Maintaining the highest standards of integrity in scholarly publishing
            </p>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection animation="fade-up">
        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-10 md:p-14 rounded shadow-sm border border-[#E5E0D8] prose prose-lg text-[#5C5446] max-w-none">
              <h2 className="text-2xl font-bold text-[#2C2C2C] mb-6 border-b border-[#E5E0D8] pb-4">Our Commitment</h2>
              <p className="mb-6">
                The Literary Scientist is committed to upholding the highest standards of publication ethics and takes all possible measures against any publication malpractices. All authors submitting their works for publication attest that the submitted works represent their contributions and have not been copied or plagiarized in whole or in part from other works.
              </p>
              
              <h3 className="text-xl font-bold text-[#2C2C2C] mt-8 mb-4">COPE Guidelines</h3>
              <p className="mb-6">
                Our ethical statements are based on the guidelines and standards developed by the Committee on Publication Ethics (COPE). We expect all parties involved in the act of publishing (the author, the journal editor(s), the peer reviewer, and the publisher) to agree upon standards of expected ethical behavior.
              </p>

              <h3 className="text-xl font-bold text-[#2C2C2C] mt-8 mb-4">Plagiarism Policy</h3>
              <p className="mb-6">
                We strictly enforce a zero-tolerance policy regarding plagiarism. All submissions are automatically screened using industry-leading similarity detection software prior to peer review. Any manuscript exhibiting significant similarities to existing published works will be immediately rejected.
              </p>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </main>
  );
};

export default Ethics;
