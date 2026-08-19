import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import {
  FaShieldAlt,
  FaAward,
  FaCheckCircle,
  FaCoins,
  FaUserGraduate,
  FaSearch,
  FaEnvelope,
  FaExclamationTriangle,
  FaLock,
  FaFileContract,
  FaArrowRight,
  FaSyncAlt,
  FaHandHoldingHeart
} from 'react-icons/fa';

const publicationFees = [
  { category: "Undergraduate & Postgraduate Students", fee: "₹100", description: "Nominal subsidized fee to encourage early-stage academic inquiry" },
  { category: "Research Scholars (M.Phil / Ph.D.)", fee: "₹250", description: "Subsidized fee for doctoral and post-graduate researchers" },
  { category: "Faculty & Independent Scholars", fee: "₹1000", description: "Standard contribution towards server, indexing, and publication costs" }
];

const JournalPolicies = () => {
  return (
    <main className="flex-grow bg-[#F9F6F0] text-[#2C2C2C]">
      <AnimatedSection animation="fade-up">
        
        {/* Header Hero */}
        <section className="bg-gradient-to-b from-[#1E2530] to-[#252F3E] text-white py-16 md:py-20 px-4 border-b border-gray-700">
          <div className="max-w-5xl mx-auto text-center space-y-4">
            <div className="flex flex-wrap justify-center items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-xs font-semibold tracking-wider">
                <FaAward className="text-[#D4AF37]" /> ISSN: 3048-7366 (ONLINE)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold">
                <FaHandHoldingHeart /> Not-For-Profit Initiative
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-xs font-semibold">
                <FaCheckCircle className="text-emerald-400" /> Open Access
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif uppercase tracking-tight">
              Journal Policy Document
            </h1>
            <p className="text-base sm:text-lg text-[#D5C7B7] font-serif italic max-w-3xl mx-auto">
              The Literary Scientist — A Multi-Disciplinary Journal for Literature and Science (December, 2023)
            </p>
            <div className="w-20 h-1 bg-[#8E7C68] mx-auto rounded-full mt-4"></div>
          </div>
        </section>

      </AnimatedSection>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        
        {/* 1. Main Objective */}
        <AnimatedSection animation="fade-up">
          <section className="bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#F0EBE1]">
              <span className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] flex items-center justify-center flex-shrink-0">
                <FaShieldAlt className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-bold text-[#8E7C68] uppercase tracking-wider block">Foundational Mission</span>
                <h2 className="text-2xl font-bold text-[#1E2530] font-serif">Main Objective</h2>
              </div>
            </div>

            <p className="text-base sm:text-lg text-[#5C5446] font-serif leading-relaxed">
              <strong>The Literary Scientist</strong> hones to prioritise Undergraduate and Postgraduate students in their endeavours to publish original research materials with nominal amount for publication purposes. It is a <strong>NOT FOR PROFIT</strong> publication platform, aiming to provide a broad spectrum for research enthusiasts.
            </p>
          </section>
        </AnimatedSection>

        {/* 2. Publication Policy & Charges */}
        <AnimatedSection animation="fade-up">
          <section className="bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-[#F0EBE1]">
              <span className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] flex items-center justify-center flex-shrink-0">
                <FaCoins className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-bold text-[#8E7C68] uppercase tracking-wider block">Publication Policy</span>
                <h2 className="text-2xl font-bold text-[#1E2530] font-serif">Regarding Charges Of Publication</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {publicationFees.map((tier, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF7F2] border border-[#E5E0D8] rounded-2xl p-6 flex flex-col justify-between hover:border-[#8E7C68] transition-colors"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8E7C68] block mb-1">
                      {tier.category.split(' ')[0]} Category
                    </span>
                    <h3 className="text-base font-bold text-[#1E2530] font-serif mb-2">
                      {tier.category}
                    </h3>
                    <p className="text-xs text-[#5C5446] font-serif leading-relaxed mb-4">
                      {tier.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#E5E0D8]">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#1E2530] font-mono">
                      {tier.fee}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">/ accepted paper</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#FAF7F2] border-l-4 border-[#8E7C68] p-4 sm:p-5 rounded-r-xl text-xs sm:text-sm text-[#5C5446] font-serif">
              <strong>Non-Profit Disclosure:</strong> It is to be noted that the fees taken on account of publication is solely for the purposes of publication, website building, server maintenance, indexing, and management, and <strong>not for profit</strong>.
            </div>
          </section>
        </AnimatedSection>

        {/* 3. Selection & Peer Review Procedure */}
        <AnimatedSection animation="fade-up">
          <section className="bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-[#F0EBE1]">
              <span className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] flex items-center justify-center flex-shrink-0">
                <FaUserGraduate className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-bold text-[#8E7C68] uppercase tracking-wider block">Editorial Workflow</span>
                <h2 className="text-2xl font-bold text-[#1E2530] font-serif">Regarding Selection & Review</h2>
              </div>
            </div>

            <ul className="space-y-4 text-sm sm:text-base text-[#5C5446] font-serif">
              <li className="flex items-start gap-3 bg-[#FAF7F2]/60 p-4 rounded-xl border border-[#EFE9DF]">
                <span className="w-6 h-6 rounded-full bg-[#1E2530] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">1</span>
                <span>
                  <strong>Formatting Adjustments:</strong> Students of UG and PG shall be allowed to make necessary changes in their submissions on the grounds of incorrect formatting according to TLS' stylesheet (as per the <Link to="/author-guidelines" className="font-bold text-[#1E2530] underline hover:text-[#8E7C68]">Submission Guidelines</Link> tab).
                </span>
              </li>

              <li className="flex items-start gap-3 bg-[#FAF7F2]/60 p-4 rounded-xl border border-[#EFE9DF]">
                <span className="w-6 h-6 rounded-full bg-[#1E2530] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">2</span>
                <span>
                  <strong>Two-Segment Review:</strong> Papers are to be sent for blind review to the Editorial Board in two segments — for students and for scholars/faculties.
                </span>
              </li>

              <li className="flex items-start gap-3 bg-[#FAF7F2]/60 p-4 rounded-xl border border-[#EFE9DF]">
                <span className="w-6 h-6 rounded-full bg-[#1E2530] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">3</span>
                <span>
                  <strong>Critical Analysis:</strong> Reviewers shall engage in critically analysing the papers, keeping in mind the rigorous guidelines of double-blind reviewing.
                </span>
              </li>

              <li className="flex items-start gap-3 bg-[#FAF7F2]/60 p-4 rounded-xl border border-[#EFE9DF]">
                <span className="w-6 h-6 rounded-full bg-[#1E2530] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">4</span>
                <span>
                  <strong>Student Mentorship & Re-submission:</strong> Students will be e-mailed after the review if there are unavoidable mistakes and non-literary conduct in their research papers. They will be given guidance accordingly and be allowed to re-submit their document after proofreading.
                </span>
              </li>
            </ul>
          </section>
        </AnimatedSection>

        {/* 4. Results & Online Fee Portal */}
        <AnimatedSection animation="fade-up">
          <section className="bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-10 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#F0EBE1]">
              <span className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] flex items-center justify-center flex-shrink-0">
                <FaFileContract className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-bold text-[#8E7C68] uppercase tracking-wider block">Announcement & Settlement</span>
                <h2 className="text-2xl font-bold text-[#1E2530] font-serif">Regarding Results & Payment</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#5C5446] font-serif">
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E5E0D8]">
                <h3 className="text-base font-bold text-[#1E2530] mb-2 font-serif">Procurement of Result</h3>
                <p className="leading-relaxed">
                  The Literary Scientist will procure a date after the submission portal is closed (according to the given date in CFP), and publish the names of those whose papers have been selected for publication.
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E5E0D8]">
                <h3 className="text-base font-bold text-[#1E2530] mb-2 font-serif">Payment Method</h3>
                <p className="leading-relaxed">
                  The nominal publication fees shall be paid thereafter through an online payment portal provided on the official website upon formal acceptance.
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* 5. Guidelines for Blind Review */}
        <AnimatedSection animation="fade-up">
          <section className="bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-[#F0EBE1]">
              <span className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] flex items-center justify-center flex-shrink-0">
                <FaSearch className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-bold text-[#8E7C68] uppercase tracking-wider block">Reviewer Conduct</span>
                <h2 className="text-2xl font-bold text-[#1E2530] font-serif">Guidelines for Blind Review</h2>
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[#5C5446] font-serif leading-relaxed">
              <p>
                The editorial board or the review committee members will note down the changes/alterations to be done in their respective research papers and comment their guidances to improve the paper (if necessary), and email us back to:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="mailto:editor-in-chief@theliteraryscientist.org"
                  className="p-4 bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#E5E0D8] rounded-xl flex items-center gap-3 transition-colors"
                >
                  <FaEnvelope className="text-[#8E7C68] text-lg flex-shrink-0" />
                  <span className="text-xs font-bold text-[#1E2530] truncate">editor-in-chief@theliteraryscientist.org</span>
                </a>
                <a
                  href="mailto:swagata_assistanteditor@theliteraryscientist.org"
                  className="p-4 bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#E5E0D8] rounded-xl flex items-center gap-3 transition-colors"
                >
                  <FaEnvelope className="text-[#8E7C68] text-lg flex-shrink-0" />
                  <span className="text-xs font-bold text-[#1E2530] truncate">swagata_assistanteditor@theliteraryscientist.org</span>
                </a>
              </div>

              <p className="pt-2">
                This enables the editorial desk to send constructive feedback back to the respective authors and coordinate author cooperation. Reviewers are requested to guide researchers in their purpose and actively encourage their participation alongside critical notes.
              </p>
            </div>
          </section>
        </AnimatedSection>

        {/* 6. Plagiarism Policy */}
        <AnimatedSection animation="fade-up">
          <section className="bg-gradient-to-r from-red-50/70 via-white to-amber-50/70 border-2 border-red-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-red-200">
              <span className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
                <FaExclamationTriangle className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider block">Academic Rigor</span>
                <h2 className="text-2xl font-bold text-[#1E2530] font-serif">Plagiarism Policy (Max 10%)</h2>
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[#5C5446] font-serif leading-relaxed">
              <p>
                Author(s) are requested to ensure that their submission(s) <strong>do not have more than 10% plagiarism</strong>.
              </p>
              <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-xs">
                <p className="text-sm font-semibold text-[#1E2530]">
                  Mandatory Submission Requirement:
                </p>
                <p className="text-xs sm:text-sm text-[#5C5446] mt-1">
                  Author(s) are requested to submit an authentic plagiarism report (e.g., Turnitin, Urkund/Ouriginal, DrillBit) along with their respective manuscript submission(s) at the time of submitting their contributions to <em>The Literary Scientist: A Multi-Disciplinary Journal for Literature and Science</em>.
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* 7. Data Privacy & Confidentiality */}
        <AnimatedSection animation="fade-up">
          <section className="bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-10 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#F0EBE1]">
              <span className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] flex items-center justify-center flex-shrink-0">
                <FaLock className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-bold text-[#8E7C68] uppercase tracking-wider block">Confidentiality Guarantee</span>
                <h2 className="text-2xl font-bold text-[#1E2530] font-serif">Data Privacy & Protection</h2>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[#5C5446] font-serif leading-relaxed">
              <p>
                The names, email addresses, institutional affiliations, and submitted manuscript files entered in this journal site will be used exclusively for the stated peer-review and academic publication purposes of this journal and will not be made available for any other purpose or sold/distributed to any third party.
              </p>
              <p>
                Data collected from registered and non-registered users falls within the standard functioning of peer-reviewed journals to enable editorial communication, archival indexing, and aggregated scholarly metrics.
              </p>
            </div>
          </section>
        </AnimatedSection>

        {/* 8. Amendment Notice */}
        <AnimatedSection animation="fade-up">
          <div className="bg-[#FAF7F2] border border-[#E5E0D8] rounded-2xl p-6 flex items-start gap-4 text-xs text-[#5C5446] font-serif">
            <FaSyncAlt className="text-[#8E7C68] text-base flex-shrink-0 mt-0.5" />
            <p>
              <strong>Policy Amendment Notice:</strong> This policy document is subject to change whenever necessary. The document can be amended in future and in case of such an action the renewed amended policy shall be uploaded to the official website.
            </p>
          </div>
        </AnimatedSection>

        {/* Quick CTA */}
        <AnimatedSection animation="fade-up">
          <div className="bg-[#1E2530] text-white rounded-3xl p-8 text-center shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-xl font-bold font-serif">Ready to Submit Your Research?</h3>
              <p className="text-xs text-gray-300 font-serif">Review our author guidelines and register to upload your paper with plagiarism report.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/start-submission"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow"
              >
                Submit Manuscript <FaArrowRight className="inline ml-1 text-xs" />
              </Link>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </main>
  );
};

export default JournalPolicies;
