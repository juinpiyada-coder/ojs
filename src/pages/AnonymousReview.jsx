import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaCheckCircle, FaFilePdf, FaUserSecret, FaInfoCircle, FaFileWord, FaArrowRight } from 'react-icons/fa';
import AnimatedSection from '../components/AnimatedSection';

const AnonymousReview = () => {
  return (
    <AnimatedSection animation="fade-up">
      <div className="flex-grow bg-[#FDFBF7] py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9E8B75]">
              Editorial Standards & Integrity
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1C2024] font-serif tracking-tight">
              Ensuring a Double-Blind Anonymous Review
            </h1>
            <p className="text-sm sm:text-base text-[#5A5043] leading-relaxed">
              Guidelines and requirements for preparing manuscripts to preserve strict confidentiality throughout the double-blind peer-review lifecycle.
            </p>
          </div>

          {/* Core Philosophy Banner */}
          <div className="bg-[#1C2024] text-white p-8 sm:p-10 rounded-3xl shadow-md border border-[#2D3748] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                <FaShieldAlt /> Double-Blind Protocol Enforced
              </span>
              <h2 className="text-2xl font-bold font-serif">Why Anonymity Matters</h2>
              <p className="text-xs sm:text-sm text-[#CBD5E0] max-w-2xl leading-relaxed">
                <em>The Literary Scientist</em> enforces double-blind peer review: author identities are concealed from reviewers, and reviewer identities are concealed from authors to ensure unbiased, merit-based scholarly evaluation.
              </p>
            </div>
            <Link
              to="/start-submission"
              className="px-6 py-3.5 bg-[#B83327] hover:bg-[#992218] text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-sm shrink-0 flex items-center gap-2"
            >
              <span>Submit Manuscript</span>
              <FaArrowRight />
            </Link>
          </div>

          {/* Anonymization Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white p-8 rounded-3xl border border-[#E5DFD4] shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 text-red-700 rounded-2xl">
                  <FaUserSecret className="text-xl" />
                </div>
                <h3 className="text-xl font-bold text-[#1C2024] font-serif">1. Remove Identifying Information</h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#5A5043] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-emerald-600 mt-1 shrink-0" />
                  <span>Remove all author names, institutional email addresses, and academic affiliations from the title page.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-emerald-600 mt-1 shrink-0" />
                  <span>Omit acknowledgments, funding grant references, and research institute declarations from the initial submission copy.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-emerald-600 mt-1 shrink-0" />
                  <span>Refer to your own previous works in the third person (e.g., replace <em>"in our previous study (Author, 2022)"</em> with <em>"as demonstrated in (Author, 2022)"</em>).</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#E5DFD4] shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl">
                  <FaFileWord className="text-xl" />
                </div>
                <h3 className="text-xl font-bold text-[#1C2024] font-serif">2. Clean Document File Metadata</h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#5A5043] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-emerald-600 mt-1 shrink-0" />
                  <span><strong>In Microsoft Word:</strong> Go to <em>File &rarr; Info &rarr; Check for Issues &rarr; Inspect Document</em> and click <em>Remove All</em> on Document Properties and Personal Information.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-emerald-600 mt-1 shrink-0" />
                  <span><strong>In PDF:</strong> Go to <em>File &rarr; Properties &rarr; Description</em> and ensure Author and Company fields are blank.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-emerald-600 mt-1 shrink-0" />
                  <span>Ensure the file name does not contain author surnames (e.g., name it <code>manuscript_submission.docx</code>).</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Automated System Anonymizer Callout */}
          <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#EAE4D9] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9E8B75]">
              <FaInfoCircle /> Built-in Platform Anonymization Engine
            </div>
            <h3 className="text-xl font-bold text-[#1C2024] font-serif">Automatic Redaction System</h3>
            <p className="text-xs sm:text-sm text-[#5A5043] leading-relaxed">
              Our journal system applies automated double-blind physical redactions and identity tokenization when manuscripts are routed to reviewers. However, authors are strictly responsible for verifying their source documents before final submission.
            </p>
          </div>

        </div>
      </div>
    </AnimatedSection>
  );
};

export default AnonymousReview;
