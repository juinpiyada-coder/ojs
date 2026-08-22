import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import SEO from '../components/SEO';
import {
  FaBookOpen,
  FaAward,
  FaCalendarAlt,
  FaArrowRight,
  FaCheckCircle,
  FaLayerGroup
} from 'react-icons/fa';

const Issues = () => {
  return (
    <div className="flex-grow bg-[#F9F6F0] text-[#2C2C2C] py-16 md:py-24 px-4">
      <SEO
        title="Journal Issues & Directory | The Literary Scientist"
        description="Browse all current and archived volumes of The Literary Scientist (ISSN: 3048-7366). Access peer-reviewed open access articles."
        keywords="The Literary Scientist issues, journal archive, volume 1 issue 3, literature and science papers"
        canonical="/issues"
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <AnimatedSection animation="fade-up">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#1E2530] text-[#F9F6F0] rounded-full text-xs font-semibold tracking-wider shadow-sm">
                <FaAward className="text-[#D4AF37]" /> ISSN: 3048-7366 (ONLINE)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#E5E0D8] text-[#5C5446] rounded-full text-xs font-medium shadow-sm">
                <FaCheckCircle className="text-emerald-600" /> Thrice a Year
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1E2530] font-serif uppercase tracking-tight mb-4">
              Journal Issues
            </h1>
            <p className="text-xl sm:text-2xl text-[#8E7C68] font-serif italic mb-6 font-medium">
              Explore Our Published Scholarly Volumes
            </p>
            <div className="w-24 h-1 bg-[#8E7C68] mx-auto rounded-full mb-6"></div>
          </div>
        </AnimatedSection>

        {/* Issues Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Current Issue Card */}
          <AnimatedSection animation="fade-up" delay={100}>
            <div className="bg-white border-2 border-[#8E7C68]/40 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-[#D32F2F] text-white text-xs font-bold uppercase rounded-full">
                    Latest Issue
                  </span>
                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <FaCalendarAlt className="text-[#8E7C68]" /> July, 2025
                  </span>
                </div>

                <h2 className="text-2xl font-bold font-serif text-[#1E2530] mb-3">
                  Volume I, Issue III (July 2025)
                </h2>
                <p className="text-sm text-[#5C5446] font-serif leading-relaxed mb-6">
                  Features 10 peer-reviewed articles covering contemporary mythological literature, cinema, gendered rural agency, folk art traditions, and transnational identities.
                </p>

                <div className="mb-6 rounded-2xl overflow-hidden bg-[#FAF7F2] p-4 flex justify-center">
                  <img
                    src="/annousments/image2.png"
                    alt="Current Issue Cover"
                    className="max-h-[220px] object-contain rounded-xl shadow"
                  />
                </div>
              </div>

              <Link
                to="/current-issue"
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#1E2530] hover:bg-[#2C384A] text-white rounded-xl font-bold text-sm transition-all shadow"
              >
                <span>Read Current Issue</span>
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </AnimatedSection>

          {/* Archived Issues Card */}
          <AnimatedSection animation="fade-up" delay={200}>
            <div className="bg-white border border-[#E5E0D8] rounded-3xl p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] text-xs font-bold uppercase rounded-full">
                    Archived Volumes
                  </span>
                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <FaLayerGroup className="text-[#8E7C68]" /> 2023 - 2025
                  </span>
                </div>

                <h2 className="text-2xl font-bold font-serif text-[#1E2530] mb-3">
                  Complete Journal Archive
                </h2>
                <p className="text-sm text-[#5C5446] font-serif leading-relaxed mb-6">
                  Browse previous publications including Volume I Issue I (Inaugural Issue, December 2023) and Volume I Issue II (January 2025).
                </p>

                <div className="mb-6 rounded-2xl overflow-hidden bg-[#FAF7F2] p-4 flex justify-center gap-4">
                  <img
                    src="/annousments/img2.png"
                    alt="Volume 1 Issue 1"
                    className="max-h-[200px] object-contain rounded-xl shadow"
                  />
                  <img
                    src="/annousments/image copy.png"
                    alt="Volume 1 Issue 2"
                    className="max-h-[200px] object-contain rounded-xl shadow hidden sm:block"
                  />
                </div>
              </div>

              <Link
                to="/archive"
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E2530] border border-[#E5E0D8] rounded-xl font-bold text-sm transition-all shadow-xs"
              >
                <span>Browse All Archived Issues</span>
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </div>
  );
};

export default Issues;
