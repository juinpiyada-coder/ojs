import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaBookOpen,
  FaFileAlt,
  FaHeading,
  FaListOl,
  FaQuoteRight,
  FaTable,
  FaSquareRootAlt,
  FaPaperclip,
  FaShieldAlt,
  FaFileWord,
  FaCheckCircle,
  FaEnvelope,
  FaUserPlus,
  FaArrowRight,
  FaSignInAlt
} from 'react-icons/fa';
import AnimatedSection from '../components/AnimatedSection';

const guidelines = [
  {
    id: 1,
    title: "1. Paper Formatting",
    icon: FaFileAlt,
    items: [
      { label: "Paper Size", value: "A4 Standard" },
      { label: "Margins", value: "1-inch (2.54 cm) on all sides" },
      { label: "Font Family", value: "Times New Roman" },
      { label: "Font Size", value: "12-point" },
      { label: "Line Spacing", value: "Double-spaced throughout" },
      { label: "Alignment", value: "Justified text" }
    ]
  },
  {
    id: 2,
    title: "2. Title Page",
    icon: FaHeading,
    items: [
      { label: "Title", value: "Centered, bold, and in title case" },
      { label: "Author(s) Name(s)", value: "Centered, with affiliations and email addresses" },
      { label: "Abstract", value: "Structured abstract of 200–250 words summarizing the paper (to be submitted on a separate page)" }
    ]
  },
  {
    id: 3,
    title: "3. Sections and Headings",
    icon: FaListOl,
    items: [
      { label: "Section Headings", value: "Bold, aligned left, numbered as 1., 2., 3., etc." },
      { label: "Subheadings", value: "Italicized, aligned left, numbered as 1.1., 1.2., 2.1., etc." }
    ]
  },
  {
    id: 4,
    title: "4. Main Text Structure",
    icon: FaBookOpen,
    description: "Manuscripts should generally follow this structured sequence:",
    sections: [
      "Introduction",
      "Literature Review",
      "Methodology",
      "Results and Discussion",
      "Conclusion"
    ]
  },
  {
    id: 5,
    title: "5. Citations and References",
    icon: FaQuoteRight,
    items: [
      { label: "Citation Style", value: "APA (American Psychological Association) 7th edition or as specified by the journal" },
      { label: "In-text Citations", value: "Author-date format (e.g., Smith, 2022)" },
      { label: "Reference List", value: "Alphabetical order with hanging indent" }
    ]
  },
  {
    id: 6,
    title: "6. Figures and Tables",
    icon: FaTable,
    items: [
      { label: "Numbering & Captions", value: "Numbered and titled with appropriate descriptive captions" },
      { label: "Placement", value: "Place within the text near their first mention" },
      { label: "Clarity", value: "Ensure all figures and tables are clear, readable, and properly labelled" }
    ]
  },
  {
    id: 7,
    title: "7. Equations",
    icon: FaSquareRootAlt,
    items: [
      { label: "Numbering", value: "Numbered sequentially (e.g., Equation 1, Equation 2, etc.)" },
      { label: "Placement", value: "Place equations in the text and align them properly" },
      { label: "In-text Mention", value: "Refer to equations by their numbers within the text" }
    ]
  },
  {
    id: 8,
    title: "8. Appendices",
    icon: FaPaperclip,
    items: [
      { label: "Supplementary Info", value: "Include appendices for supplementary information where applicable" },
      { label: "Labeling", value: "Label appendices as Appendix A, Appendix B, etc." }
    ]
  },
  {
    id: 9,
    title: "9. Ethical Considerations",
    icon: FaShieldAlt,
    items: [
      { label: "Approvals", value: "Mention any ethical approvals obtained, if applicable" },
      { label: "Integrity", value: "Follow ethical guidelines and declare any conflicts of interest" }
    ]
  },
  {
    id: 10,
    title: "10. Paper Length and Word Count",
    icon: FaFileWord,
    items: [
      { label: "Maximum Word Count", value: "As specified in the Call for Papers" },
      { label: "Abstract Word Count", value: "As specified in the Call for Papers (200–250 words)" }
    ]
  },
  {
    id: 11,
    title: "11. Submission Process",
    icon: FaCheckCircle,
    items: [
      { label: "Online System", value: "Submit the paper through the online submission system of 'The Literary Scientist' or as instructed in the Call for Papers" },
      { label: "Guidelines", value: "Please follow the specific guidelines provided by The Literary Scientist" }
    ]
  }
];

const Submission = () => {
  return (
    <div className="flex-grow bg-[#F9F6F0] text-[#2C2C2C] py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <AnimatedSection>
          {/* Header Section */}
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#1E2530] text-[#F9F6F0] rounded-full text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm">
              Online Submission System
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1E2530] font-serif uppercase tracking-tight mb-4">
              Submission Guidelines
            </h1>
            <div className="w-24 h-1 bg-[#8E7C68] mx-auto rounded-full mb-6"></div>
            <p className="text-base sm:text-lg text-[#5C5446] font-serif leading-relaxed">
              Please follow the specific guidelines provided by <em>The Literary Scientist</em> before uploading your manuscript.
            </p>
          </div>
        </AnimatedSection>

        {/* Action / Register Callout Card */}
        <div className="bg-gradient-to-r from-[#1E2530] via-[#2A3342] to-[#1E2530] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-700/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">
              Ready to Submit Your Manuscript?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-serif">
              To submit your paper, please register for an author account on our portal.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 flex-shrink-0 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm sm:text-base transition-all shadow-md"
            >
              <FaUserPlus /> Register to Submit <FaArrowRight className="text-xs" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold text-sm sm:text-base transition-all"
            >
              <FaSignInAlt /> Author Login
            </Link>
          </div>
        </div>

        {/* 11 Guidelines Accordion / Cards */}
        <AnimatedSection animation="fade-up" delay={100}>
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E0D8]">
              <h2 className="text-2xl font-bold text-[#1E2530] font-serif">
                Detailed Author Requirements
              </h2>
              <span className="text-xs font-semibold text-[#8E7C68]">11 Core Specifications</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guidelines.map((guide) => {
                const Icon = guide.icon;
                return (
                  <div
                    key={guide.id}
                    className="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#F0EBE1]">
                        <span className="w-9 h-9 rounded-lg bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4" />
                        </span>
                        <h3 className="text-lg font-bold text-[#1E2530] font-serif">
                          {guide.title}
                        </h3>
                      </div>

                      {guide.description && (
                        <p className="text-xs text-[#5C5446] mb-3 font-serif">{guide.description}</p>
                      )}

                      {guide.sections && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                          {guide.sections.map((sec, i) => (
                            <div
                              key={i}
                              className="bg-[#FAF7F2] border border-[#E5E0D8] rounded-lg p-2 text-center text-xs font-semibold text-[#1E2530]"
                            >
                              <span className="block text-[9px] text-[#8E7C68] font-mono">0{i + 1}</span>
                              {sec}
                            </div>
                          ))}
                        </div>
                      )}

                      {guide.items && (
                        <div className="space-y-2.5">
                          {guide.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-[#FAF7F2]/60 rounded-lg p-2.5 border border-[#EFE9DF]"
                            >
                              <span className="block text-[11px] font-bold text-[#8E7C68] uppercase tracking-wider mb-0.5">
                                {item.label}
                              </span>
                              <p className="text-xs text-[#2C2C2C] font-serif leading-relaxed">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* Note & Contact Desk */}
        <div className="bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8E7C68] uppercase tracking-wider">
              <FaEnvelope /> Support & Inquiries
            </div>
            <h3 className="text-2xl font-bold text-[#1E2530] font-serif">
              Questions Regarding Submissions?
            </h3>
            <p className="text-sm text-[#5C5446] font-serif">
              <strong>Note:</strong> Please consult us through <a href="mailto:contactus@theliteraryscientist.org" className="font-bold text-[#1E2530] underline hover:text-[#8E7C68]">contactus@theliteraryscientist.org</a> if further help is required.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <a
              href="mailto:contactus@theliteraryscientist.org"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E2530] border border-[#E5E0D8] rounded-xl font-bold text-sm transition-all"
            >
              <FaEnvelope className="text-[#8E7C68]" /> contactus@theliteraryscientist.org
            </a>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E2530] hover:bg-[#2C384A] text-white rounded-xl font-bold text-sm transition-all shadow"
            >
              <FaUserPlus /> Register Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Submission;
