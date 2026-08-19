import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { editors } from '../data/editors';
import AnimatedSection from '../components/AnimatedSection';
import {
  FaArrowLeft,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUniversity,
  FaUserTie,
  FaAward,
  FaCheckCircle,
  FaShieldAlt
} from 'react-icons/fa';

const EditorProfile = () => {
  const { id } = useParams();
  const editor = editors.find(e => e.id === parseInt(id));

  if (!editor) {
    return (
      <div className="flex-grow py-24 px-4 bg-[#F9F6F0] flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold text-[#1E2530] mb-4 font-serif">Board Member Not Found</h2>
        <p className="text-sm text-[#5C5446] mb-6 font-serif">The requested editorial profile does not exist.</p>
        <Link
          to="/editorial-board"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E2530] text-white rounded-xl font-bold text-sm hover:bg-[#8E7C68] transition-colors"
        >
          <FaArrowLeft className="text-xs" /> Back to Editorial Board
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
            to="/editorial-board"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#8E7C68] hover:text-[#1E2530] transition-colors font-serif"
          >
            <FaArrowLeft className="text-xs" /> Back to Editorial Board Directory
          </Link>
        </AnimatedSection>

        {/* Profile Card */}
        <AnimatedSection animation="fade-up" delay={100}>
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8 sm:gap-10 items-start">
              
              {/* Photo */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden bg-[#FAF7F2] border-2 border-[#E5E0D8] shadow-lg flex items-center justify-center">
                  {editor.image ? (
                    <img
                      src={editor.image}
                      alt={editor.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1E2530] to-[#2C384A] text-white flex flex-col items-center justify-center font-bold font-serif text-3xl">
                      <FaUserTie className="text-2xl mb-1 text-[#8E7C68]" />
                      {editor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <span className="inline-block px-3.5 py-1 bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
                    {editor.role}
                  </span>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="flex-grow space-y-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2530] font-serif leading-tight mb-1">
                    {editor.name}
                  </h1>
                  <p className="text-base font-semibold text-[#8E7C68] font-serif">
                    {editor.designation}
                  </p>
                </div>

                <div className="space-y-3 text-sm text-[#5C5446] font-serif">
                  <div className="flex items-start gap-2.5">
                    <FaUniversity className="text-[#8E7C68] text-base flex-shrink-0 mt-0.5" />
                    <span>{editor.department}, <strong>{editor.institution}</strong></span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <FaEnvelope className="text-[#8E7C68] text-base flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <a
                        href={`mailto:${editor.email}`}
                        className="text-[#1E2530] font-medium underline hover:text-[#8E7C68] transition-colors block"
                      >
                        {editor.email}
                      </a>
                      {editor.secondaryEmail && (
                        <a
                          href={`mailto:${editor.secondaryEmail}`}
                          className="text-gray-600 font-medium underline hover:text-[#8E7C68] transition-colors block"
                        >
                          {editor.secondaryEmail}
                        </a>
                      )}
                    </div>
                  </div>

                  {editor.postalAddress && (
                    <div className="flex items-start gap-2.5 pt-2 border-t border-[#F0EBE1]">
                      <FaMapMarkerAlt className="text-red-500 text-base flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed text-xs sm:text-sm text-[#5C5446]">
                        {editor.postalAddress}
                      </span>
                    </div>
                  )}
                </div>

                <div className="w-full h-px bg-[#E5E0D8]"></div>

                <div>
                  <h2 className="text-xl font-bold text-[#1E2530] font-serif mb-3">
                    Academic Background & Profile
                  </h2>
                  <p className="text-sm sm:text-base text-[#5C5446] leading-relaxed font-serif">
                    {editor.bio}
                  </p>
                </div>

                {/* Journal Association Badges */}
                <div className="pt-4 border-t border-[#E5E0D8] flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF7F2] border border-[#E5E0D8] text-[#1E2530] rounded-lg text-xs font-semibold">
                    <FaAward className="text-[#D4AF37]" /> The Literary Scientist
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF7F2] border border-[#E5E0D8] text-[#5C5446] rounded-lg text-xs font-medium">
                    <FaShieldAlt className="text-[#8E7C68]" /> Peer Reviewer
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF7F2] border border-[#E5E0D8] text-emerald-800 rounded-lg text-xs font-medium">
                    <FaCheckCircle className="text-emerald-600" /> Active Member
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

export default EditorProfile;
