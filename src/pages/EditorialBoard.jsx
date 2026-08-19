import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import { editors } from '../data/editors';
import {
  FaAward,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUniversity,
  FaSearch,
  FaUserTie,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaShieldAlt
} from 'react-icons/fa';

const EditorialBoard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEditors = editors.filter((ed) =>
    ed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ed.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ed.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ed.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-grow bg-[#F9F6F0] text-[#2C2C2C] py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <AnimatedSection animation="fade-up">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#1E2530] text-[#F9F6F0] rounded-full text-xs md:text-sm font-semibold tracking-wider shadow-sm">
                <FaAward className="text-[#D4AF37]" /> ISSN: 3048-7366 (ONLINE)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#E5E0D8] text-[#5C5446] rounded-full text-xs md:text-sm font-medium shadow-sm">
                <FaShieldAlt className="text-[#8E7C68]" /> Double-Blind Peer Review
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#E5E0D8] text-[#5C5446] rounded-full text-xs md:text-sm font-medium shadow-sm">
                <FaCheckCircle className="text-emerald-600" /> Academic Governance
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1E2530] font-serif uppercase tracking-tight mb-4">
              Editorial Board
            </h1>
            <p className="text-xl sm:text-2xl text-[#8E7C68] font-serif italic mb-6 font-medium">
              The Literary Scientist: A Multi-Disciplinary Journal for Literature and Science
            </p>
            <div className="w-24 h-1 bg-[#8E7C68] mx-auto rounded-full mb-6"></div>
            <p className="text-base sm:text-lg text-[#5C5446] font-serif max-w-3xl mx-auto leading-relaxed">
              Our distinguished editorial board brings together experienced academicians and research leaders across literature, comparative linguistics, cultural studies, and interdisciplinary sciences.
            </p>
          </div>
        </AnimatedSection>

        {/* Search Bar */}
        <AnimatedSection animation="fade-up" delay={100}>
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, university, or department..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#E5E0D8] rounded-2xl text-sm focus:outline-none focus:border-[#8E7C68] focus:ring-1 focus:ring-[#8E7C68] shadow-sm transition-all"
            />
            <FaSearch className="absolute left-3.5 top-4 text-gray-400 text-sm" />
          </div>
        </AnimatedSection>

        {/* Editorial Board Grid */}
        <AnimatedSection animation="fade-up" delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEditors.map((editor) => (
              <div
                key={editor.id}
                className="bg-white border border-[#E5E0D8] hover:border-[#8E7C68] rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Role Badge */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#FAF7F2] border-2 border-[#E5E0D8] group-hover:border-[#8E7C68] shadow-md flex items-center justify-center transition-all">
                        {editor.image ? (
                          <img
                            src={editor.image}
                            alt={editor.name}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#1E2530] to-[#2C384A] text-white flex flex-col items-center justify-center font-bold font-serif text-2xl">
                            <FaUserTie className="text-xl mb-1 text-[#8E7C68]" />
                            {editor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs">
                      {editor.role}
                    </span>
                  </div>

                  {/* Name & Designation */}
                  <div className="space-y-1.5 mb-4">
                    <h3 className="text-xl font-bold text-[#1E2530] font-serif group-hover:text-[#8E7C68] transition-colors leading-snug">
                      <Link to={`/editor/${editor.id}`}>
                        {editor.name}
                      </Link>
                    </h3>
                    <p className="text-xs font-semibold text-[#8E7C68] uppercase tracking-wide">
                      {editor.designation}
                    </p>
                  </div>

                  {/* Department & University */}
                  <div className="space-y-2 mb-5 text-xs text-[#5C5446] font-serif">
                    <div className="flex items-start gap-2">
                      <FaUniversity className="text-[#8E7C68] text-sm flex-shrink-0 mt-0.5" />
                      <span>{editor.department}, <strong>{editor.institution}</strong></span>
                    </div>

                    {editor.postalAddress && (
                      <div className="flex items-start gap-2 pt-1 border-t border-[#F0EBE1] text-[11px] text-gray-500">
                        <FaMapMarkerAlt className="text-red-500 text-xs flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{editor.postalAddress}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Emails & Link */}
                <div className="pt-4 border-t border-[#E5E0D8] space-y-2.5">
                  <div className="flex items-center gap-2 text-xs">
                    <FaEnvelope className="text-[#8E7C68] flex-shrink-0" />
                    <a
                      href={`mailto:${editor.email}`}
                      className="text-[#1E2530] hover:text-[#8E7C68] truncate font-medium underline transition-colors"
                      title={editor.email}
                    >
                      {editor.email}
                    </a>
                  </div>

                  {editor.secondaryEmail && (
                    <div className="flex items-center gap-2 text-xs">
                      <FaEnvelope className="text-gray-400 flex-shrink-0" />
                      <a
                        href={`mailto:${editor.secondaryEmail}`}
                        className="text-gray-600 hover:text-[#8E7C68] truncate font-medium underline transition-colors"
                        title={editor.secondaryEmail}
                      >
                        {editor.secondaryEmail}
                      </a>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <Link
                      to={`/editor/${editor.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8E7C68] hover:text-[#1E2530] transition-colors"
                    >
                      View Profile <FaExternalLinkAlt className="text-[10px]" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Editorial Desk Contact Notice */}
        <AnimatedSection animation="fade-up" delay={300}>
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-[#8E7C68] uppercase tracking-wider block">Editorial Correspondence</span>
              <h3 className="text-2xl font-bold text-[#1E2530] font-serif">Contact the Editorial Desk</h3>
              <p className="text-sm text-[#5C5446] font-serif">
                For peer review inquiries, manuscript correspondence, and editorial board matters:
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="mailto:editor-in-chief@theliteraryscientist.org"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#1E2530] hover:bg-[#2C384A] text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow"
              >
                <FaEnvelope className="text-[#D4AF37]" /> editor-in-chief@theliteraryscientist.org
              </a>
              <Link
                to="/start-submission"
                className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow"
              >
                Submit Paper
              </Link>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
};

export default EditorialBoard;
