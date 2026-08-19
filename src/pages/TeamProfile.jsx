import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { teamMembers } from '../data/teamMembers';
import AnimatedSection from '../components/AnimatedSection';
import {
  FaArrowLeft,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUniversity,
  FaAward,
  FaCheckCircle,
  FaCheckDouble,
  FaUsers
} from 'react-icons/fa';

const TeamProfile = () => {
  const { id } = useParams();
  const member = teamMembers.find((m) => m.id === parseInt(id));

  if (!member) {
    return (
      <div className="flex-grow py-24 px-4 bg-[#F9F6F0] flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold text-[#1E2530] mb-4 font-serif">Team Member Not Found</h2>
        <p className="text-sm text-[#5C5446] mb-6 font-serif">The requested team profile does not exist.</p>
        <Link
          to="/team"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E2530] text-white rounded-xl font-bold text-sm hover:bg-[#8E7C68] transition-colors"
        >
          <FaArrowLeft className="text-xs" /> Back to Team Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#F9F6F0] text-[#2C2C2C] py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link */}
        <AnimatedSection animation="fade-up">
          <Link
            to="/team"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#8E7C68] hover:text-[#1E2530] transition-colors font-serif"
          >
            <FaArrowLeft className="text-xs" /> Back to Team Directory
          </Link>
        </AnimatedSection>

        {/* Profile Card */}
        <AnimatedSection animation="fade-up" delay={100}>
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8 sm:gap-10 items-start">
              
              {/* Perfectly Circular Photo */}
              <div className="flex-shrink-0 mx-auto md:mx-0 text-center">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden bg-[#FAF7F2] border-4 border-[#E5E0D8] shadow-xl p-1 mx-auto">
                  <img
                    src={member.image}
                    alt={member.role}
                    className="w-full h-full object-cover object-top rounded-full"
                  />
                </div>

                <div className="mt-4">
                  <span className="inline-block px-3.5 py-1 bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
                    {member.badge}
                  </span>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="flex-grow space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E2530] font-serif leading-tight mb-2">
                    {member.role}
                  </h1>
                  <p className="text-sm font-semibold text-[#8E7C68] uppercase tracking-wide">
                    {member.department}
                  </p>
                </div>

                <div className="space-y-3 text-sm text-[#5C5446] font-serif">
                  <div className="flex items-start gap-2.5">
                    <FaUniversity className="text-[#8E7C68] text-base flex-shrink-0 mt-0.5" />
                    <span><strong>{member.institution}</strong> • {member.department}</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <FaEnvelope className="text-[#8E7C68] text-base flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <a
                        href={`mailto:${member.email}`}
                        className="text-[#1E2530] font-medium underline hover:text-[#8E7C68] transition-colors block"
                      >
                        {member.email}
                      </a>
                      {member.secondaryEmail && (
                        <a
                          href={`mailto:${member.secondaryEmail}`}
                          className="text-gray-600 font-medium underline hover:text-[#8E7C68] transition-colors block"
                        >
                          {member.secondaryEmail}
                        </a>
                      )}
                    </div>
                  </div>

                  {member.location && (
                    <div className="flex items-start gap-2.5">
                      <FaMapMarkerAlt className="text-red-500 text-base flex-shrink-0 mt-0.5" />
                      <span>{member.location}</span>
                    </div>
                  )}
                </div>

                <div className="w-full h-px bg-[#E5E0D8]"></div>

                <div>
                  <h2 className="text-xl font-bold text-[#1E2530] font-serif mb-3">
                    Overview & Profile
                  </h2>
                  <p className="text-sm sm:text-base text-[#5C5446] leading-relaxed font-serif">
                    {member.bio}
                  </p>
                </div>

                {member.responsibilities && (
                  <div>
                    <h3 className="text-base font-bold text-[#1E2530] font-serif mb-3 flex items-center gap-2">
                      <FaCheckDouble className="text-[#8E7C68] text-sm" /> Key Responsibilities & Scope:
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#5C5446] font-serif">
                      {member.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Journal Association Badges */}
                <div className="pt-4 border-t border-[#E5E0D8] flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF7F2] border border-[#E5E0D8] text-[#1E2530] rounded-lg text-xs font-semibold">
                    <FaAward className="text-[#D4AF37]" /> The Literary Scientist
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF7F2] border border-[#E5E0D8] text-[#5C5446] rounded-lg text-xs font-medium">
                    <FaUsers className="text-[#8E7C68]" /> Team Member
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF7F2] border border-[#E5E0D8] text-emerald-800 rounded-lg text-xs font-medium">
                    <FaCheckCircle className="text-emerald-600" /> Active Executive
                  </span>
                </div>

              </div>

            </div>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
};

export default TeamProfile;
