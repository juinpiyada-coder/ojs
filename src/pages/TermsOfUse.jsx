import React from 'react';

const TermsOfUse = () => {
  return (
    <main className="flex-grow bg-[#F9F6F0]">
      <section className="bg-[#1E2530] text-[#F9F6F0] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 uppercase">Terms of Use</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 font-serif italic">
            Terms governing the use of our journal website
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-10 md:p-14 rounded shadow-sm border border-[#E5E0D8] prose prose-lg text-[#5C5446] max-w-none">
            <h3 className="text-xl font-bold text-[#2C2C2C] mb-4">Acceptance of Terms</h3>
            <p className="mb-6">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
            <h3 className="text-xl font-bold text-[#2C2C2C] mb-4">Copyright</h3>
            <p className="mb-6">
              The content published on this platform is licensed under Creative Commons unless otherwise noted. Authors retain the copyright of their work while granting the journal right of first publication.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TermsOfUse;
