import React from 'react';
import { FaShieldAlt, FaBalanceScale, FaCheckCircle, FaExclamationTriangle, FaLock, FaBookOpen } from 'react-icons/fa';
import AnimatedSection from '../components/AnimatedSection';

const Ethics = () => {
  return (
    <AnimatedSection animation="fade-up">
      <div className="flex-grow bg-[#FDFBF7] py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9E8B75]">
              COPE Compliance & Scholarly Standards
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1C2024] font-serif tracking-tight">
              Publication Ethics & Malpractice Statement
            </h1>
            <p className="text-sm sm:text-base text-[#5A5043] leading-relaxed">
              <em>The Literary Scientist</em> strictly follows the Core Practices and Guidelines formulated by the Committee on Publication Ethics (COPE) to maintain ethical publication standards.
            </p>
          </div>

          {/* Ethics Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-8 rounded-3xl border border-[#E5DFD4] shadow-xs space-y-3">
              <div className="w-12 h-12 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center text-xl mb-4">
                <FaExclamationTriangle />
              </div>
              <h3 className="text-xl font-bold text-[#1C2024] font-serif">Plagiarism & Originality</h3>
              <p className="text-xs sm:text-sm text-[#5A5043] leading-relaxed">
                All submissions undergo mandatory similarity screening via iThenticate and Turnitin. Manuscripts with similarity exceeding 15% (excluding references) are rejected automatically.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#E5DFD4] shadow-xs space-y-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center text-xl mb-4">
                <FaBalanceScale />
              </div>
              <h3 className="text-xl font-bold text-[#1C2024] font-serif">Authorship & Contributions</h3>
              <p className="text-xs sm:text-sm text-[#5A5043] leading-relaxed">
                Authorship is strictly limited to individuals who made substantial intellectual contributions to conception, design, acquisition, or theoretical analysis. Ghost or guest authorship is forbidden.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#E5DFD4] shadow-xs space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center text-xl mb-4">
                <FaShieldAlt />
              </div>
              <h3 className="text-xl font-bold text-[#1C2024] font-serif">Conflict of Interest</h3>
              <p className="text-xs sm:text-sm text-[#5A5043] leading-relaxed">
                Authors, peer reviewers, and editors must declare any financial, commercial, or personal affiliations that could potentially introduce bias in the review or decision process.
              </p>
            </div>

          </div>

          {/* Detailed Ethical Guidelines */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E5DFD4] shadow-xs space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C2024] font-serif">
              Duties and Responsibilities of Reviewers & Editors
            </h2>
            
            <div className="space-y-4 text-xs sm:text-sm text-[#5A5043] leading-relaxed">
              <p>
                <strong>1. Confidentiality:</strong> Any manuscripts received for review must be treated as confidential documents. They must not be shown to or discussed with others except as authorized by the Editor-in-Chief.
              </p>
              <p>
                <strong>2. Objectivity:</strong> Reviews should be conducted objectively. Personal criticism of the author is inappropriate. Referees should express their views clearly with supporting arguments.
              </p>
              <p>
                <strong>3. Editorial Decisions:</strong> Editorial decisions are based solely on scholarly merit, originality, clarity, and relevance to the journal’s scope, without regard to the authors' race, gender, sexual orientation, religious belief, ethnic origin, citizenship, or political philosophy.
              </p>
            </div>
          </div>

        </div>
      </div>
    </AnimatedSection>
  );
};

export default Ethics;
