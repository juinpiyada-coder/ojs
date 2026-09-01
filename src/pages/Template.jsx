import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileWord, FaFilePdf, FaSquareRootAlt, FaDownload, FaCheckCircle, FaArrowRight, FaBookOpen } from 'react-icons/fa';
import AnimatedSection from '../components/AnimatedSection';

const Template = () => {
  return (
    <AnimatedSection animation="fade-up">
      <div className="flex-grow bg-[#FDFBF7] py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9E8B75]">
              Author Resources & Formats
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1C2024] font-serif tracking-tight">
              Official Manuscript Templates
            </h1>
            <p className="text-sm sm:text-base text-[#5A5043] leading-relaxed">
              Download standardized formatting templates in Microsoft Word (.docx) and LaTeX (.tex) adhering to <em>The Literary Scientist</em> publication guidelines.
            </p>
          </div>

          {/* Download Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Word Template Card */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E5DFD4] shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center text-2xl">
                  <FaFileWord />
                </div>
                <h3 className="text-2xl font-bold text-[#1C2024] font-serif">Microsoft Word Template (.docx)</h3>
                <p className="text-xs sm:text-sm text-[#5A5043] leading-relaxed">
                  Pre-formatted with standard typography (Georgia font body, serif headers), APA 7th edition reference styles, line numbering, and figure placement guides.
                </p>
                <ul className="space-y-2 text-xs text-[#5A5043]">
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-600 shrink-0" />
                    <span>Double-spaced, standard 1-inch margins</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-600 shrink-0" />
                    <span>Pre-styled Title, Abstract, Keywords, and Headings</span>
                  </li>
                </ul>
              </div>

              <a
                href="/template.docx"
                download="TLS_Manuscript_Template.docx"
                className="w-full py-3.5 bg-[#1C2024] hover:bg-[#2D3748] text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <FaDownload />
                <span>Download Word Template (.docx)</span>
              </a>
            </div>

            {/* LaTeX Template Card */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E5DFD4] shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center text-2xl">
                  <FaSquareRootAlt />
                </div>
                <h3 className="text-2xl font-bold text-[#1C2024] font-serif">LaTeX & Math Template (.tex)</h3>
                <p className="text-xs sm:text-sm text-[#5A5043] leading-relaxed">
                  Ideal for interdisciplinary papers containing complex mathematical formulations, data tables, algorithms, and BibTeX bibliographic database management.
                </p>
                <ul className="space-y-2 text-xs text-[#5A5043]">
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-600 shrink-0" />
                    <span>Includes <code>tls_journal.cls</code> document class</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-600 shrink-0" />
                    <span>Integrated live editor inside the Author Portal</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/start-submission"
                className="w-full py-3.5 bg-[#B83327] hover:bg-[#992218] text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <FaSquareRootAlt />
                <span>Open in LaTeX Editor</span>
              </Link>
            </div>

          </div>

          {/* Next Steps CTA */}
          <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#EAE4D9] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-bold text-[#1C2024] font-serif">Ready to submit your manuscript?</h4>
              <p className="text-xs text-[#5A5043] mt-0.5">Check author guidelines or begin online submission directly.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/author-guidelines" className="px-5 py-2.5 bg-white text-[#1C2024] border border-[#D5CDC0] rounded-xl font-bold text-xs hover:bg-[#FAF8F5]">
                Author Guidelines
              </Link>
              <Link to="/start-submission" className="px-5 py-2.5 bg-[#1C2024] text-white rounded-xl font-bold text-xs hover:bg-[#2D3748]">
                Start Submission
              </Link>
            </div>
          </div>

        </div>
      </div>
    </AnimatedSection>
  );
};

export default Template;
