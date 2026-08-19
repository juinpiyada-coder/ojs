import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
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
  FaArrowRight
} from 'react-icons/fa';

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
      { label: "Author(s) Name(s)", value: "Centered, with institutional affiliations and email addresses" },
      { label: "Abstract", value: "Structured abstract of 200–250 words summarizing the paper (to be submitted on a separate page)" }
    ]
  },
  {
    id: 3,
    title: "3. Sections and Headings",
    icon: FaListOl,
    items: [
      { label: "Section Headings", value: "Bold, aligned left, numbered sequentially as 1., 2., 3., etc." },
      { label: "Subheadings", value: "Italicized, aligned left, numbered as 1.1., 1.2., 2.1., etc." }
    ]
  },
  {
    id: 4,
    title: "4. Main Text Structure",
    icon: FaBookOpen,
    description: "Manuscripts should generally adhere to the following organized sequence:",
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
      { label: "In-text Citations", value: "Author-date format (e.g., Smith, 2022; Banerjee & Roy, 2024)" },
      { label: "Reference List", value: "Arranged in alphabetical order with a hanging indent" }
    ]
  },
  {
    id: 6,
    title: "6. Figures and Tables",
    icon: FaTable,
    items: [
      { label: "Numbering & Captions", value: "Figures and Tables must be numbered and titled with concise descriptive captions" },
      { label: "Placement", value: "Place figures and tables directly within the text, immediately near their first mention" },
      { label: "Quality & Labeling", value: "Ensure all figures and tables are high resolution, crisp, readable, and properly labelled" }
    ]
  },
  {
    id: 7,
    title: "7. Equations",
    icon: FaSquareRootAlt,
    items: [
      { label: "Sequential Numbering", value: "Equations should be numbered sequentially in parentheses (e.g., Eq. 1, Eq. 2)" },
      { label: "Placement", value: "Center equations in the text and align them properly" },
      { label: "In-text Reference", value: "Refer to equations by their numbers within the text" }
    ]
  },
  {
    id: 8,
    title: "8. Appendices",
    icon: FaPaperclip,
    items: [
      { label: "Supplementary Data", value: "If applicable, include appendices for supplementary calculations, surveys, or extended proofs" },
      { label: "Labeling", value: "Label appendices consecutively as Appendix A, Appendix B, etc." }
    ]
  },
  {
    id: 9,
    title: "9. Ethical Considerations",
    icon: FaShieldAlt,
    items: [
      { label: "Approvals", value: "Mention any institutional ethical approvals or review board clearances obtained" },
      { label: "Integrity", value: "Follow international academic integrity guidelines and explicitly declare any conflicts of interest" }
    ]
  },
  {
    id: 10,
    title: "10. Paper Length and Word Count",
    icon: FaFileWord,
    items: [
      { label: "Maximum Word Count", value: "As specified in the Call for Papers (typically 4,000 – 8,000 words including references)" },
      { label: "Abstract Word Count", value: "200–250 words structured summary" }
    ]
  },
  {
    id: 11,
    title: "11. Submission Process",
    icon: FaCheckCircle,
    items: [
      { label: "Submission Portal", value: "Submit the paper through the online submission portal of 'The Literary Scientist' or as instructed in the Call for Papers" },
      { label: "Compliance", value: "Please strictly follow the specific guidelines and author checklist provided by The Literary Scientist" }
    ]
  }
];

const AuthorGuidelines = () => {
  return (
    <AnimatedSection animation="fade-up">
    <div className="flex-grow bg-[#F9F6F0] text-[#2C2C2C] py-16 md:py-24 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#1E2530] text-[#F9F6F0] rounded-full text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm">
            The Literary Scientist • Guidelines
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E2530] font-serif uppercase tracking-tight mb-4">
            Submission Guidelines
          </h1>
          <div className="w-24 h-1 bg-[#8E7C68] mx-auto rounded-full mb-6"></div>
          <p className="text-base sm:text-lg text-[#5C5446] font-serif leading-relaxed">
            Please carefully review the following formatting, structural, ethical, and referencing requirements before submitting your manuscript to <em>The Literary Scientist</em>.
          </p>
        </div>

        {/* Guidelines Grid */}
        <div className="space-y-6">
          {guidelines.map((guide) => {
            const Icon = guide.icon;
            return (
              <div
                key={guide.id}
                className="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3.5 mb-4 pb-3 border-b border-[#F0EBE1]">
                  <span className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1E2530] font-serif">
                    {guide.title}
                  </h2>
                </div>

                {guide.description && (
                  <p className="text-sm text-[#5C5446] mb-4 font-serif">{guide.description}</p>
                )}

                {guide.sections && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {guide.sections.map((sec, i) => (
                      <div
                        key={i}
                        className="bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl p-3 text-center text-xs font-bold text-[#1E2530]"
                      >
                        <span className="block text-[10px] text-[#8E7C68] font-mono mb-1">Step 0{i + 1}</span>
                        {sec}
                      </div>
                    ))}
                  </div>
                )}

                {guide.items && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {guide.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#FAF7F2]/60 rounded-xl p-3.5 border border-[#EFE9DF]"
                      >
                        <span className="block text-xs font-bold text-[#8E7C68] uppercase tracking-wider mb-1">
                          {item.label}
                        </span>
                        <p className="text-sm text-[#2C2C2C] font-serif leading-relaxed">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Note & Support Box */}
        <div className="bg-[#FAF7F2] border-2 border-[#8E7C68]/40 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8E7C68] uppercase tracking-wider">
              <FaEnvelope /> Editorial Assistance
            </div>
            <h3 className="text-2xl font-bold text-[#1E2530] font-serif">
              Need Help With Your Submission?
            </h3>
            <p className="text-sm text-[#5C5446] font-serif">
              Please consult us through <a href="mailto:contactus@theliteraryscientist.org" className="font-bold text-[#1E2530] underline hover:text-[#8E7C68]">contactus@theliteraryscientist.org</a> if further assistance is required.
            </p>
          </div>

          <div className="flex-shrink-0">
            <a
              href="mailto:contactus@theliteraryscientist.org"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-[#E5E0D8] text-[#1E2530] rounded-xl font-bold text-sm hover:bg-[#EFE9DF] transition-all shadow-sm"
            >
              <FaEnvelope className="text-[#8E7C68]" /> Email Editorial Desk
            </a>
          </div>
        </div>

        {/* Call to Submit / Register Banner */}
        <div className="bg-[#1E2530] text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif">
              Ready to Submit Your Paper?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-serif leading-relaxed">
              Create an author account on our portal to upload your manuscript, supplementary files, and track your double-blind peer review progress.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-base transition-all shadow-lg hover:shadow-emerald-900/30"
              >
                <FaUserPlus /> Register to Submit Your Paper <FaArrowRight className="text-xs" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-semibold text-base transition-all"
              >
                Author Login
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
    </AnimatedSection>
  );
};

export default AuthorGuidelines;
