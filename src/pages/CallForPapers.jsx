import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import {
  FaAward,
  FaBullhorn,
  FaCheckCircle,
  FaDownload,
  FaExpandAlt,
  FaExternalLinkAlt,
  FaFilePdf,
  FaLanguage,
  FaShieldAlt,
  FaTimes,
  FaUserEdit,
  FaArrowRight,
  FaClock,
  FaCheckDouble
} from 'react-icons/fa';

const callTopics = [
  { id: 1, title: "Tiny Tales, Micro Literature as a mainstream literature" },
  { id: 2, title: "Environmental Humanities" },
  { id: 3, title: "Medical humanities / neuro humanities" },
  { id: 4, title: "Oral narratives in the contemporary" },
  { id: 5, title: "Subaltern studies" },
  { id: 6, title: "Evolution of Literature" },
  { id: 7, title: "Intermediality in Literature" },
  { id: 8, title: "Cultural studies" },
  { id: 9, title: "India as a linguistic area" },
  { id: 10, title: "Multilingualism & mother-tongue education" },
  { id: 11, title: "Language of literature" },
  { id: 12, title: "Language & Indian Knowledge System" },
  { id: 13, title: "Queer studies" },
  { id: 14, title: "Physics of speech" },
  { id: 15, title: "Literature and physics" }
];

const CallForPapers = () => {
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  return (
    <div className="flex-grow bg-[#F9F6F0] text-[#2C2C2C] py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <AnimatedSection animation="fade-up" delay={0}>
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#1E2530] text-[#F9F6F0] rounded-full text-xs md:text-sm font-semibold tracking-wider shadow-sm">
              <FaAward className="text-[#D4AF37]" /> ISSN: 3048-7366 (ONLINE)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#E5E0D8] text-[#5C5446] rounded-full text-xs md:text-sm font-medium shadow-sm">
              <FaLanguage className="text-[#8E7C68]" /> Multilingual (Bengali & English)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#E5E0D8] text-[#5C5446] rounded-full text-xs md:text-sm font-medium shadow-sm">
              <FaCheckCircle className="text-emerald-600" /> Peer-Reviewed & Open Access
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1E2530] tracking-tight uppercase mb-4 font-serif">
            Call For Contributions
          </h1>
          <p className="text-xl sm:text-2xl text-[#8E7C68] font-serif italic mb-6 font-medium">
            Please take a look at our latest Call For Contribution
          </p>
          <div className="w-24 h-1 bg-[#8E7C68] mx-auto rounded-full mb-6"></div>
          <p className="text-base sm:text-lg text-[#5C5446] leading-relaxed font-serif">
            The Literary Scientist invites young minds, seasoned researchers, and scholars across disciplines to contribute groundbreaking scholarship.
          </p>
        </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
        {/* Main Call Banner & Important Dates */}
        <section className="bg-gradient-to-br from-[#1E2530] via-[#26303F] to-[#161B22] text-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl border border-gray-700/60 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Announcement & Dates */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Submissions Currently Open
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif leading-tight text-white">
                Milestone Announcement & Invitation for Papers
              </h2>

              <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed font-serif">
                <p>
                  We’re thrilled to announce that <strong>The Literary Scientist</strong> now proudly holds an <strong>ISSN: 3048-7366 (ONLINE)</strong>, marking a significant milestone in our journey. This achievement underscores our commitment to fostering interdisciplinary scholarship and creativity across literature, science, and beyond.
                </p>

                <p>
                  With this call for contributions, we invite young minds and seasoned researchers alike to explore groundbreaking topics—from micro literature to digital humanities, cultural studies, and more. Be part of a pioneering publication that bridges disciplines and enriches the landscape of academic thought.
                </p>
              </div>

              {/* Crucial Deadlines Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
                    <FaClock /> Crucial Milestone
                  </div>
                  <p className="text-xs uppercase text-gray-400 font-semibold mb-1">Submission Deadline</p>
                  <p className="text-xl sm:text-2xl font-bold text-white font-serif">10th October 2026</p>
                </div>

                <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <FaCheckDouble /> Decision Timeline
                  </div>
                  <p className="text-xs uppercase text-gray-400 font-semibold mb-1">Notification of Acceptance</p>
                  <p className="text-xl sm:text-2xl font-bold text-white font-serif">15th October 2026</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <Link
                  to="/start-submission"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm sm:text-base transition-all shadow-md"
                >
                  <FaUserEdit /> Submit Manuscript <FaArrowRight className="text-xs" />
                </Link>

                <a
                  href="/Volume%20II,%20Issue%202026%20%20Call%20For%20Papers%20.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#8E7C68] hover:bg-[#7D6B57] text-white rounded-lg font-bold text-sm sm:text-base transition-all shadow-md"
                >
                  <FaFilePdf /> Full Call Document (PDF) <FaExternalLinkAlt className="text-xs opacity-70" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsPosterModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold text-sm transition-all"
                >
                  <FaExpandAlt className="text-xs" /> View Official Poster
                </button>
              </div>

            </div>

            {/* Right Column: Poster Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                onClick={() => setIsPosterModalOpen(true)}
                className="relative group cursor-pointer max-w-[320px] sm:max-w-[340px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-white transform transition-all duration-300 hover:scale-[1.02] p-2"
              >
                <div className="rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center">
                  <img
                    src="/annousments/call_for_papers_2026.png"
                    alt="The Literary Scientist - Call for Contributions"
                    className="w-full h-auto max-h-[460px] object-contain block mx-auto"
                    loading="lazy"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2530]/90 via-[#1E2530]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold">Official Poster</span>
                      <p className="text-sm font-bold">Click to enlarge & scan QR</p>
                    </div>
                    <span className="p-2.5 bg-white text-[#1E2530] rounded-full shadow-lg">
                      <FaExpandAlt className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="absolute top-4 left-4 bg-[#1E2530]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold border border-white/20 shadow">
                  Volume II, Issue I (2026)
                </div>
              </div>
            </div>

          </div>
        </section>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
        {/* 15 Research Topics List */}
        <section className="bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 text-[#8E7C68] font-bold text-xs uppercase tracking-widest mb-2">
              <FaBullhorn /> Open Research Topics
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2530] font-serif mb-4">
              Scope of Topics for Contributions
            </h2>
            <p className="text-[#5C5446] text-sm sm:text-base font-serif leading-relaxed">
              This call for contributions is an initiative to collaborate scholarly and artistic approaches towards multidisciplinary understanding. Submissions are invited on (but not limited to) the following topics:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {callTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-[#FAF7F2] border border-[#E5E0D8] hover:border-[#8E7C68] rounded-xl p-4 sm:p-5 transition-all flex items-start gap-3.5 group hover:bg-white"
              >
                <span className="w-7 h-7 rounded-md bg-[#1E2530] group-hover:bg-[#8E7C68] text-white text-xs font-bold font-mono flex items-center justify-center flex-shrink-0 transition-colors">
                  {String(topic.id).padStart(2, '0')}
                </span>
                <p className="text-sm font-semibold text-[#1E2530] font-serif leading-snug">
                  {topic.title}
                </p>
              </div>
            ))}
          </div>
        </section>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
        {/* Submission Guidelines & Review Policy Strip */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-7 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#8E7C68] uppercase tracking-wider mb-2">
                <FaShieldAlt /> Editorial Standards
              </div>
              <h3 className="text-xl font-bold text-[#1E2530] font-serif mb-3">
                Peer Review Policy
              </h3>
              <p className="text-sm text-[#5C5446] leading-relaxed mb-6 font-serif">
                All submitted manuscripts undergo double-blind peer review by international experts to maintain highest standards of intellectual rigor and novelty.
              </p>
            </div>
            <a
              href="/Review-Policy-TLS.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1E2530] hover:text-[#8E7C68] transition-colors"
            >
              <FaFilePdf className="text-red-600" /> Read Review Policy (PDF) <FaExternalLinkAlt className="text-xs opacity-70" />
            </a>
          </div>

          <div className="bg-white border border-[#E5E0D8] rounded-2xl p-7 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#8E7C68] uppercase tracking-wider mb-2">
                <FaLanguage /> Multilingual Submissions
              </div>
              <h3 className="text-xl font-bold text-[#1E2530] font-serif mb-3">
                English & Bengali Papers
              </h3>
              <p className="text-sm text-[#5C5446] leading-relaxed mb-6 font-serif">
                We accept original manuscripts in both English and Bengali, encouraging regional and global literary-scientific discourse.
              </p>
            </div>
            <Link
              to="/author-guidelines"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1E2530] hover:text-[#8E7C68] transition-colors"
            >
              View Author Guidelines <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </section>
        </AnimatedSection>

      </div>

      {/* Fullscreen Lightbox Modal for Poster */}
      {isPosterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative max-w-2xl w-full max-h-[92vh] flex flex-col bg-[#1E2530] border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-5 py-3.5 bg-[#161B22] border-b border-gray-700 text-white">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-[#8E7C68] text-white rounded">
                  Volume II, Issue I (2026)
                </span>
                <span className="text-sm font-semibold text-gray-300 truncate">
                  Call for Contributions Official Flyer
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto flex items-center justify-center bg-neutral-950/90">
              <img
                src="/annousments/call_for_papers_2026.png"
                alt="The Literary Scientist Call for Contributions Flyer"
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-lg shadow-xl border border-gray-700 mx-auto"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap justify-between items-center gap-3 px-5 py-3 bg-[#161B22] border-t border-gray-700">
              <a
                href="/annousments/call_for_papers_2026.png"
                download="The_Literary_Scientist_Call_For_Contributions_Vol2_Issue1_2026.png"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
              >
                <FaDownload className="text-xs" /> Save Poster Image
              </a>

              <div className="flex items-center gap-2">
                <a
                  href="/Volume%20II,%20Issue%202026%20%20Call%20For%20Papers%20.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8E7C68] hover:bg-[#7D6B57] text-white text-xs sm:text-sm font-bold rounded-lg transition-colors"
                >
                  <FaFilePdf /> Document PDF
                </a>
                <Link
                  to="/start-submission"
                  onClick={() => setIsPosterModalOpen(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors"
                >
                  Submit Paper
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CallForPapers;
