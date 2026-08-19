import React from 'react';
import AnimatedSection from '../components/AnimatedSection';

const Accessibility = () => {
  return (
    <main className="flex-grow bg-[#F9F6F0]">
      <AnimatedSection animation="fade-up">
        <section className="bg-[#1E2530] text-[#F9F6F0] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 uppercase">Accessibility</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 font-serif italic">
              Commitment to an inclusive web experience
            </p>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection animation="fade-up">
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-10 md:p-14 rounded shadow-sm border border-[#E5E0D8] prose prose-lg text-[#5C5446] max-w-none">
              <h3 className="text-xl font-bold text-[#2C2C2C] mb-4">Our Commitment</h3>
              <p className="mb-6">
                The Literary Scientist is committed to making its website accessible to all users, regardless of technology or ability. We actively work to increase the accessibility and usability of our website and adhere to many of the available standards and guidelines.
              </p>
              <h3 className="text-xl font-bold text-[#2C2C2C] mb-4">Feedback</h3>
              <p className="mb-6">
                If you experience any difficulty in accessing any part of this website, please feel free to contact us with your feedback.
              </p>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </main>
  );
};

export default Accessibility;
