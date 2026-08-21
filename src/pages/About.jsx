import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import SEO from '../components/SEO';
import {
  FaBookOpen,
  FaAward,
  FaCheckCircle,
  FaLanguage,
  FaCalendarAlt,
  FaPrint,
  FaShieldAlt,
  FaArrowRight,
  FaExternalLinkAlt,
  FaMicroscope,
  FaUsers,
  FaQuoteRight,
  FaLightbulb
} from 'react-icons/fa';

const scopeTopics = [
  {
    id: 1,
    title: "Literary Representations of Scientific Concepts & Discoveries",
    description: "Analyzing how empirical hypotheses, astronomical findings, biological discoveries, and technological innovations are mirrored and reimagined in literary narratives."
  },
  {
    id: 2,
    title: "Impact of Scientific Advancements on Social & Cultural Narratives",
    description: "Investigating how technological shifts and scientific milestones reshape human perspectives, folklore, modern media, and societal belief systems."
  },
  {
    id: 3,
    title: "Societal Implications of Scientific Breakthroughs in Literature",
    description: "Evaluating the ethical dilemmas, bioethics, algorithmic realities, and futuristic quandaries portrayed through speculative, dystopian, and modern fiction."
  },
  {
    id: 4,
    title: "Scientific Themes in Literary Works & Their Social Discourse",
    description: "Exploring scientific motifs, medicine, environmental consciousness, and quantum concepts embedded in classic, modern, and post-colonial texts."
  },
  {
    id: 5,
    title: "Interdisciplinary Pedagogies & Knowledge Systems",
    description: "Promoting dialogues across English, regional languages, Indian knowledge systems, environmental humanities, and empirical scientific methodologies."
  },
  {
    id: 6,
    title: "Interdisciplinary Methodologies Across Social, Literary & Physical Sciences",
    description: "Pioneering novel hermeneutic, digital humanities, and quantitative methodologies that synthesize humanistic enquiry with scientific precision."
  }
];

const About = () => {
  return (
    <div className="flex-grow bg-[#F9F6F0] text-[#2C2C2C] py-16 md:py-24 px-4">
      <SEO
        title="About The Journal (ISSN: 3048-7366)"
        description="Learn about the aims, scope, interdisciplinary vision, and open-access publication ethos of The Literary Scientist: A Multi-Disciplinary Journal for Literature and Science."
        keywords="About The Literary Scientist, journal aims and scope, interdisciplinary literature and science, peer review policy, ISSN 3048-7366"
        canonical="/about"
      />
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* 1. Header Section */}
        <AnimatedSection animation="fade-up" delay={0}>
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
            About The Journal
          </h1>
          <p className="text-xl sm:text-2xl text-[#8E7C68] font-serif italic mb-6 font-medium">
            The Literary Scientist: A Multi-Disciplinary Journal for Literature and Science
          </p>
          <div className="w-24 h-1 bg-[#8E7C68] mx-auto rounded-full mb-6"></div>
          <p className="text-base sm:text-lg text-[#5C5446] leading-relaxed font-serif">
            Bridging the gap between academic and non-academic disciplines, fostering innovative research, and encouraging a vibrant global scholarly community.
          </p>
        </div>
        </AnimatedSection>

        {/* 2. Who Are We? Card */}
        <AnimatedSection animation="fade-up" delay={100}>
        <section className="bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FAF7F2] rounded-bl-full -mr-20 -mt-20 pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 text-[#8E7C68] font-bold text-xs uppercase tracking-widest mb-3">
              <FaBookOpen /> Editorial Profile
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2530] font-serif mb-6">
              Who Are We?
            </h2>

            <div className="space-y-5 text-base sm:text-lg text-[#5C5446] font-serif leading-relaxed">
              <p>
                <strong>The Literary Scientist: A Multi-Disciplinary Journal for Literature and Science</strong> is a multilingual (Bengali, English) multi-disciplinary peer-reviewed academic journal for literature and science.
              </p>
              
              <p>
                The Literary Scientist follows an Open Access Policy for copyright and licensing. If you are using or reproducing content from this platform, you need to appropriately cite the author(s) and the journal name.
              </p>

              <p>
                The journal has published its issues thrice a year online since 2023. We are going to publish the print version very soon.
              </p>

              <p className="bg-[#FAF7F2] border-l-4 border-[#8E7C68] p-4 sm:p-5 rounded-r-xl italic text-[#2C2C2C]">
                "The Literary Scientist, a new venture, seeks to bridge the gap between academic and 'non-academic' disciplines, fostering innovative research and encouraging a vibrant scholarly community."
              </p>
            </div>
          </div>
        </section>
        </AnimatedSection>

        {/* 3. Core Focus: Confluence of Disciplines */}
        <AnimatedSection animation="fade-up" delay={100}>
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <div className="lg:col-span-7 bg-[#1E2530] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-tl-full pointer-events-none"></div>

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-widest">
                <FaMicroscope /> Contemporary Perspectives
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif leading-tight">
                Exploring the Confluence of Social Science, Literature & Humanities
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-serif">
                With a focus on the latest and most contemporary developments, <em>The Literary Scientist</em> provides a platform for researchers, scholars, and experts to contribute their valuable insights and explore the multifaceted relationship between Social Science, Literature, and Humanities at large.
              </p>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-serif">
                By highlighting the confluence of these disciplines, the journal aims to shed light on the interconnectedness of human experience, culture, and the natural world.
              </p>
            </div>

            <div className="pt-8 border-t border-gray-700 relative z-10 flex flex-wrap gap-4">
              <Link
                to="/start-submission"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8E7C68] hover:bg-[#7D6B57] text-white font-bold text-sm rounded-lg transition-all shadow"
              >
                Submit Manuscript <FaArrowRight className="text-xs" />
              </Link>
              <a
                href="/Review-Policy-TLS.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 rounded-lg transition-all"
              >
                <FaShieldAlt /> Review Policy <FaExternalLinkAlt className="text-xs opacity-70" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[#8E7C68] font-bold text-xs uppercase tracking-widest mb-3">
                <FaUsers /> Academic Community
              </div>
              <h3 className="text-2xl font-bold text-[#1E2530] font-serif mb-4">
                Symposia, Conferences & Workshops
              </h3>
              <p className="text-[#5C5446] text-sm leading-relaxed font-serif mb-4">
                Through its rigorous peer-review process, <em>The Literary Scientist</em> maintains a commitment to scholarly excellence, ensuring that only high-quality, original research is published.
              </p>
              <p className="text-[#5C5446] text-sm leading-relaxed font-serif">
                The journal also encourages interdisciplinary conversations by organizing conferences, symposia, and workshops, providing a platform for researchers to share their findings and engage in intellectual discourse.
              </p>
            </div>

            <div className="pt-6 border-t border-[#E5E0D8]">
              <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#E5E0D8] flex items-center gap-3">
                <FaQuoteRight className="text-[#8E7C68] text-xl flex-shrink-0" />
                <p className="text-xs text-[#5C5446] italic font-serif">
                  "Combining the richness of literature with the rigour of scientific inquiry to advance human knowledge."
                </p>
              </div>
            </div>
          </div>

        </section>
        </AnimatedSection>

        {/* 4. Journal Scope & Key Research Areas */}
        <AnimatedSection animation="fade-up" delay={100}>
        <section className="bg-white border border-[#E5E0D8] rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 text-[#8E7C68] font-bold text-xs uppercase tracking-widest mb-2">
              <FaLightbulb /> Scope of the Journal
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2530] font-serif mb-4">
              Invited Topics & Research Focus Areas
            </h2>
            <p className="text-[#5C5446] text-sm sm:text-base font-serif leading-relaxed">
              The journal invites original research articles, theoretical analyses, critical reviews, and interdisciplinary perspectives that examine the complex interactions between the avenues of literature(s) and explore new possibilities. The scope of the journal encompasses a wide range of topics, including but not limited to:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scopeTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-[#FAF7F2] border border-[#E5E0D8] hover:border-[#8E7C68] rounded-2xl p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <span className="w-8 h-8 rounded-lg bg-[#1E2530] text-white text-xs font-bold font-mono flex items-center justify-center mb-4">
                    {String(topic.id).padStart(2, '0')}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#1E2530] font-serif mb-2 leading-snug">
                    {topic.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5446] leading-relaxed font-serif">
                    {topic.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        </AnimatedSection>

        {/* 5. Concluding Statement & Call to Submit */}
        <AnimatedSection animation="fade-up" delay={100}>
        <section className="bg-gradient-to-r from-[#FAF7F2] via-white to-[#FAF7F2] border-2 border-[#8E7C68]/30 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E2530] font-serif">
              Advancing Knowledge Across Boundaries
            </h2>
            <p className="text-sm sm:text-base text-[#5C5446] leading-relaxed font-serif">
              By combining the richness of literature with the rigour of scientific inquiry, <strong>The Literary Scientist</strong> contributes to the advancement of knowledge and offers fresh perspectives on the complex interplay between human society, literature, and the physical world. It invites researchers, scholars and the specialists to delve into the captivating realm where these fields converge, uncovering new insights that can shape our understanding of the world and inform future endeavour.
            </p>
            <p className="text-base sm:text-lg font-bold text-[#1E2530] font-serif">
              The Literary Scientist welcomes submissions and encourages researchers to contribute to this vibrant intellectual space.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
              <Link
                to="/start-submission"
                className="px-8 py-3.5 bg-[#1E2530] hover:bg-[#2C384A] text-white rounded-lg font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-lg"
              >
                Start Manuscript Submission
              </Link>
              <Link
                to="/author-guidelines"
                className="px-8 py-3.5 bg-white border border-[#8E7C68] text-[#1E2530] rounded-lg font-bold text-sm sm:text-base hover:bg-[#FAF7F2] transition-all shadow-sm"
              >
                Author Guidelines
              </Link>
            </div>
          </div>
        </section>
        </AnimatedSection>

        {/* 6. Publication Stats Overview */}
        <AnimatedSection animation="fade-up" delay={100}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E0D8] flex flex-col items-center justify-center">
            <FaCheckCircle className="text-[#8E7C68] text-xl mb-2" />
            <div className="text-2xl font-extrabold text-[#1E2530] mb-1 font-serif">Open Access</div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Free Full Text</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E0D8] flex flex-col items-center justify-center">
            <FaShieldAlt className="text-[#8E7C68] text-xl mb-2" />
            <div className="text-2xl font-extrabold text-[#1E2530] mb-1 font-serif">Peer-Reviewed</div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Double-Blind Review</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E0D8] flex flex-col items-center justify-center">
            <FaCalendarAlt className="text-[#8E7C68] text-xl mb-2" />
            <div className="text-2xl font-extrabold text-[#1E2530] mb-1 font-serif">Thrice a Year</div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Published Annually</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E0D8] flex flex-col items-center justify-center">
            <FaPrint className="text-[#8E7C68] text-xl mb-2" />
            <div className="text-2xl font-extrabold text-[#1E2530] mb-1 font-serif">Online & Print</div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Publication Formats</div>
          </div>
        </div>
        </AnimatedSection>

      </div>
    </div>
  );
};

export default About;
