import React from 'react';
import AnimatedSection from '../components/AnimatedSection';

const BecomeReviewer = () => {
  return (
    <AnimatedSection animation="fade-up">
      <div className="flex-grow bg-[#F9F6F0] py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-10">
            <h2 className="text-4xl font-bold text-[#2C2C2C]">Become A Reviewer</h2>
            <div className="ml-6 flex-grow h-px bg-[#E5E0D8]"></div>
          </div>
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-[#E5E0D8]">
            <div className="prose prose-lg text-[#5C5446] font-serif">
              <p className="mb-6 leading-relaxed">
                Interested in becoming a peer reviewer for our journal? Find out how to apply here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default BecomeReviewer;
