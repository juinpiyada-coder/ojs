import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import { teamMembers } from '../data/teamMembers';
import {
  FaAward,
  FaEnvelope,
  FaShieldAlt,
  FaCheckCircle,
  FaUsers,
  FaCrown,
  FaExpandAlt,
  FaTimes,
  FaArrowRight,
  FaExternalLinkAlt
} from 'react-icons/fa';

const Team = () => {
  const [activePhoto, setActivePhoto] = useState(null);

  const executiveTeam = teamMembers.filter((m) => m.category === 'executive');
  const editorialStaff = teamMembers.filter((m) => m.category === 'editorial');

  return (
    <div className="flex-grow bg-[#F9F6F0] text-[#2C2C2C] py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* 1. Header Section */}
        <AnimatedSection animation="fade-up">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#1E2530] text-[#F9F6F0] rounded-full text-xs md:text-sm font-semibold tracking-wider shadow-sm">
                <FaAward className="text-[#D4AF37]" /> ISSN: 3048-7366 (ONLINE)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#E5E0D8] text-[#5C5446] rounded-full text-xs md:text-sm font-medium shadow-sm">
                <FaUsers className="text-[#8E7C68]" /> Executive & Editorial Council
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#E5E0D8] text-[#5C5446] rounded-full text-xs md:text-sm font-medium shadow-sm">
                <FaCheckCircle className="text-emerald-600" /> Operational Team
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1E2530] font-serif uppercase tracking-tight mb-4">
              Our Team
            </h1>
            <p className="text-xl sm:text-2xl text-[#8E7C68] font-serif italic mb-6 font-medium">
              The Literary Scientist: A Multi-Disciplinary Journal for Literature and Science
            </p>
            <div className="w-24 h-1 bg-[#8E7C68] mx-auto rounded-full mb-6"></div>
            <p className="text-base sm:text-lg text-[#5C5446] font-serif max-w-3xl mx-auto leading-relaxed">
              Meet the founders, executive leaders, and editorial coordinators driving the vision, peer-review governance, and technical architecture of <em>The Literary Scientist</em>.
            </p>
          </div>
        </AnimatedSection>

        {/* 2. Executive Leadership / Co-Founders Section */}
        <div className="space-y-8">
          <AnimatedSection animation="fade-up" delay={100}>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
              <div>
                <span className="text-xs font-bold text-[#8E7C68] uppercase tracking-wider block">Foundational Leadership</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1E2530] font-serif flex items-center gap-2">
                  <FaCrown className="text-[#D4AF37] text-xl" /> Executive Council & Co-Founders
                </h2>
              </div>
              <span className="text-xs font-semibold text-gray-500 hidden sm:inline">3 Members</span>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {executiveTeam.map((member) => (
                <div
                  key={member.id}
                  className="bg-white border-2 border-[#E5E0D8] hover:border-[#8E7C68] rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Perfectly Circular Portrait Photo */}
                    <div className="relative mb-6 flex justify-center">
                      <div
                        onClick={() => setActivePhoto(member)}
                        className="cursor-pointer relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-[#FAF7F2] border-4 border-[#E5E0D8] group-hover:border-[#8E7C68] shadow-lg transition-all group-hover:scale-105 p-1"
                      >
                        <img
                          src={member.image}
                          alt={member.role}
                          className="w-full h-full object-cover object-top rounded-full"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 rounded-full bg-[#1E2530]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                          <FaExpandAlt className="text-[10px]" /> Enlarge
                        </div>
                      </div>
                    </div>

                    {/* Role & Badge */}
                    <div className="text-center space-y-2 mb-4">
                      <span className="inline-block px-3 py-1 bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs">
                        {member.badge}
                      </span>
                      <h3 className="text-xl font-bold text-[#1E2530] font-serif leading-snug group-hover:text-[#8E7C68] transition-colors">
                        <Link to={`/team/${member.id}`}>
                          {member.role}
                        </Link>
                      </h3>
                      <p className="text-xs font-semibold text-gray-500">
                        {member.department}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#5C5446] font-serif leading-relaxed text-center mb-6">
                      {member.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-[#E5E0D8] flex items-center justify-between text-xs">
                    <a
                      href={`mailto:${member.email}`}
                      className="text-[#5C5446] hover:text-[#8E7C68] font-semibold inline-flex items-center gap-1.5 transition-colors"
                      title={member.email}
                    >
                      <FaEnvelope className="text-[#8E7C68]" /> Email
                    </a>

                    <Link
                      to={`/team/${member.id}`}
                      className="inline-flex items-center gap-1 font-bold text-[#1E2530] hover:text-[#8E7C68] transition-colors"
                    >
                      View Profile <FaExternalLinkAlt className="text-[10px]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* 3. Editorial & Technical Operations Team */}
        <div className="space-y-8">
          <AnimatedSection animation="fade-up" delay={100}>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
              <div>
                <span className="text-xs font-bold text-[#8E7C68] uppercase tracking-wider block">Editorial Operations</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1E2530] font-serif flex items-center gap-2">
                  <FaShieldAlt className="text-[#8E7C68] text-xl" /> Editorial & Technical Staff
                </h2>
              </div>
              <span className="text-xs font-semibold text-gray-500 hidden sm:inline">4 Members</span>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {editorialStaff.map((member) => (
                <div
                  key={member.id}
                  className="bg-white border border-[#E5E0D8] hover:border-[#8E7C68] rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Perfectly Circular Portrait Photo */}
                    <div className="relative mb-5 flex justify-center">
                      <div
                        onClick={() => setActivePhoto(member)}
                        className="cursor-pointer relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[#FAF7F2] border-3 border-[#E5E0D8] group-hover:border-[#8E7C68] shadow-md transition-all group-hover:scale-105 p-1"
                      >
                        <img
                          src={member.image}
                          alt={member.role}
                          className="w-full h-full object-cover object-top rounded-full"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 rounded-full bg-[#1E2530]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                          <FaExpandAlt className="text-[9px]" /> Enlarge
                        </div>
                      </div>
                    </div>

                    {/* Role & Badge */}
                    <div className="text-center space-y-1.5 mb-3">
                      <span className="inline-block px-2.5 py-0.5 bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {member.badge}
                      </span>
                      <h3 className="text-base font-bold text-[#1E2530] font-serif leading-snug group-hover:text-[#8E7C68] transition-colors">
                        <Link to={`/team/${member.id}`}>
                          {member.role}
                        </Link>
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        {member.department}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#5C5446] font-serif leading-relaxed text-center mb-4">
                      {member.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E5E0D8] flex items-center justify-between text-xs">
                    <a
                      href={`mailto:${member.email}`}
                      className="text-[#5C5446] hover:text-[#8E7C68] font-medium inline-flex items-center gap-1 transition-colors"
                      title={member.email}
                    >
                      <FaEnvelope className="text-[#8E7C68] text-xs" /> Email
                    </a>
                    <Link
                      to={`/team/${member.id}`}
                      className="inline-flex items-center gap-1 font-bold text-[#8E7C68] hover:text-[#1E2530] transition-colors"
                    >
                      Profile <FaExternalLinkAlt className="text-[9px]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* 4. Cross-Links to Editorial Board & Submissions */}
        <AnimatedSection animation="fade-up">
          <div className="bg-[#1E2530] text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-2">
              <h3 className="text-2xl font-bold font-serif">Looking for the Academic Editorial Board?</h3>
              <p className="text-sm text-gray-300 font-serif">
                Explore our distinguished professorial board across universities and research institutions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/editorial-board"
                className="px-6 py-3.5 bg-[#8E7C68] hover:bg-[#7D6B57] text-white rounded-xl font-bold text-sm transition-all shadow"
              >
                View Editorial Board <FaArrowRight className="inline ml-1 text-xs" />
              </Link>
              <Link
                to="/start-submission"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow"
              >
                Submit Manuscript
              </Link>
            </div>
          </div>
        </AnimatedSection>

      </div>

      {/* Circular Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative max-w-md w-full bg-[#1E2530] border border-gray-700 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-5 py-3.5 bg-[#161B22] border-b border-gray-700 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                {activePhoto.role}
              </span>
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 bg-neutral-950 flex flex-col items-center justify-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[#8E7C68] shadow-2xl bg-[#FAF7F2] p-1">
                <img
                  src={activePhoto.image}
                  alt={activePhoto.role}
                  className="w-full h-full object-cover object-top rounded-full"
                />
              </div>
            </div>

            <div className="p-5 bg-[#161B22] text-center border-t border-gray-700 space-y-3">
              <h4 className="text-sm font-bold text-white font-serif">{activePhoto.role}</h4>
              <p className="text-xs text-gray-300 font-serif leading-relaxed">{activePhoto.description}</p>
              <div>
                <Link
                  to={`/team/${activePhoto.id}`}
                  onClick={() => setActivePhoto(null)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8E7C68] hover:bg-[#7D6B57] text-white rounded-lg text-xs font-bold transition-all"
                >
                  View Full Profile <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Team;
