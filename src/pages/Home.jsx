import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import {
  FaBookOpen,
  FaFilePdf,
  FaAward,
  FaBullhorn,
  FaExternalLinkAlt,
  FaSearch,
  FaCalendarAlt,
  FaUserEdit,
  FaCheckCircle,
  FaPrint,
  FaLanguage,
  FaShieldAlt,
  FaQuoteRight,
  FaArrowRight,
  FaExpandAlt,
  FaTimes,
  FaDownload,
  FaQrcode
} from 'react-icons/fa';

const currentArticles = [
  {
    id: 1,
    title: "BRIDGING CINEMATIC NARRATIVES AND LITERARY DEPTHS: FUSIONS IN CONTEMPORARY MYTHOLOGICAL NOVELS CONCERNING AMISH TRIPATHI’S RAM CHANDRA SERIES.",
    author: "Garima Singh",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_26.pdf",
    category: "Mythological Fiction & Cinema",
    pages: "26-30"
  },
  {
    id: 2,
    title: "Retelling the Past: Cinematic Narratives of Oppression and Resistance in Bolivia and Bengal.",
    author: "Ahana Bhandari",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_27.pdf",
    category: "Comparative Cultural Studies",
    pages: "31-36"
  },
  {
    id: 3,
    title: "What Did She Know About Transformation That We Don’t?",
    author: "Lina Mandal",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_28.pdf",
    category: "Literary Theory & Criticism",
    pages: "37-41"
  },
  {
    id: 4,
    title: "Laapataa Ladies: A Cinematic Satire on Gendered Invisibility and Rural Agency.",
    author: "Satyam Kumar",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_30.pdf",
    category: "Gender Studies & Film",
    pages: "42-47"
  },
  {
    id: 5,
    title: "Patachitra Tradition and Artist Kalam Pauta: A Theoretical Perspective on Art and Literature.",
    author: "Dr. Rakesh Kaibartya",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_31.pdf",
    category: "Art, Folk Tradition & Literature",
    pages: "48-54"
  },
  {
    id: 6,
    title: "BEYOND THE CHARACTERS: NATURE SHAPES THE STORY IN “ULLOZHUKKU”.",
    author: "Dona Joseph",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_32.pdf",
    category: "Eco-Criticism & Narrative",
    pages: "55-60"
  },
  {
    id: 7,
    title: "How ideology shapes consumption: The case of Oil Palm Industry and Red Meat Production.",
    author: "Souvik Karmakar",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_.33.pdf",
    category: "Environmental Sciences & Policy",
    pages: "61-68"
  },
  {
    id: 8,
    title: "FROM ‘LITTLE MAIDEN’ TO ‘THE WITCH’: EXPLORING THE THEMES OF VAMPIRISM, WITCHCRAFT AND THE FEMALE WANDERER THROUGH A BIOGRAPHICAL READING OF MARY COLERIDGE’S “THE WITCH”.",
    author: "Shibangi Ghose",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_34.pdf",
    category: "Gothic Literature & Gender",
    pages: "69-75"
  },
  {
    id: 9,
    title: "The Word as Weapon: Language, Power, and Black Male Representation in Morrison’s Narratives.",
    author: "Sakshi Virmani",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_37.pdf",
    category: "African American Literature",
    pages: "76-82"
  },
  {
    id: 10,
    title: "Between Nations and Narratives: Transnational Engagement and Flexible Citizenship in American Betiya.",
    author: "Kakoli Debnath and Dr. Binda Sah",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_.38.pdf",
    category: "Diaspora & Transnationalism",
    pages: "83-90"
  }
];

const previousIssues = [
  {
    volume: "Volume I Issue I",
    date: "December, 2023",
    coverImg: "/annousments/img2.png",
    description: "Inaugural issue establishing our multidisciplinary bridge between literary theory and empirical scientific inquiry.",
    status: "Inaugural Issue",
    link: "/archive",
    issn: "ISSN: 3048-7366"
  },
  {
    volume: "Volume I Issue II",
    date: "January, 2025",
    coverImg: "/annousments/image copy.png",
    description: "Second volume featuring pioneering scholarship on modern cultural hermeneutics and socio-environmental dynamics.",
    status: "Archived Issue",
    link: "/archive",
    issn: "ISSN: 3048-7366"
  }
];

const callTopics = [
  "Tiny Tales, Micro Literature as a mainstream literature",
  "Environmental Humanities",
  "Medical humanities / Neuro humanities",
  "Oral narratives in the contemporary",
  "Subaltern studies & Cultural studies",
  "Evolution of Literature & Intermediality",
  "Language & Indian Knowledge System",
  "Queer studies, Physics of speech & Literature"
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalPoster, setActiveModalPoster] = useState(null);

  const filteredArticles = currentArticles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-grow flex flex-col bg-[#F9F6F0] text-[#2C2C2C]">
      
      {/* 1. HERO SECTION */}
      <AnimatedSection animation="fade-in" duration={800}>
      <section className="bg-gradient-to-b from-white via-[#FAF7F2] to-[#F3EEE5] border-b border-[#E5E0D8] py-16 md:py-24 px-4 relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8E7C68]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1E2530]/5 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          <AnimatedSection animation="fade-up" delay={100}>
          {/* ISSN & Badges */}
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#1E2530] text-[#F9F6F0] rounded-full text-xs md:text-sm font-semibold tracking-wider shadow-sm">
              <FaAward className="text-[#D4AF37]" /> ISSN: 3048-7366 (ONLINE)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#E5E0D8] text-[#5C5446] rounded-full text-xs md:text-sm font-medium shadow-sm">
              <FaLanguage className="text-[#8E7C68]" /> Multilingual (English & Bengali)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#E5E0D8] text-[#5C5446] rounded-full text-xs md:text-sm font-medium shadow-sm">
              <FaCheckCircle className="text-emerald-600" /> Peer-Reviewed & Open Access
            </span>
          </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1E2530] tracking-tight uppercase mb-4 font-serif">
            The Literary Scientist
          </h1>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={300}>
          {/* Subtitle */}
          <p className="text-xl sm:text-2xl md:text-3xl text-[#8E7C68] font-serif italic max-w-4xl mx-auto mb-8 font-medium">
            A Multi-Disciplinary Journal for Literature and Science
          </p>

          <div className="w-24 h-1 bg-[#8E7C68] mx-auto rounded-full mb-8"></div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={400}>
          {/* Tagline / Brief Mission */}
          <p className="text-base sm:text-lg text-[#5C5446] max-w-3xl mx-auto leading-relaxed mb-10">
            Dedicated to fostering cross-disciplinary scholarship, bridging empirical scientific inquiry and creative literary exploration. Published thrice a year online since 2023 with an upcoming print edition.
          </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={500}>
          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            <a
              href="#current-issue"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1E2530] text-white rounded-lg font-bold text-sm sm:text-base shadow-md hover:bg-[#2C384A] hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <FaBookOpen /> Browse Current Issue
            </a>
            <a
              href="/annousments/Olive-Green-Doodle-Final-Project-Cover-A4-Document.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#8E7C68] text-white rounded-lg font-bold text-sm sm:text-base shadow-md hover:bg-[#7D6B57] hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <FaFilePdf /> Call For Contributions (PDF)
            </a>
            <Link
              to="/start-submission"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border border-[#8E7C68] text-[#1E2530] rounded-lg font-bold text-sm sm:text-base shadow-sm hover:bg-[#FAF7F2] hover:shadow hover:-translate-y-0.5 transition-all"
            >
              <FaUserEdit className="text-[#8E7C68]" /> Submit Manuscript
            </Link>
            <a
              href="/Review-Policy-TLS.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#EFE9DF] text-[#5C5446] rounded-lg font-semibold text-sm sm:text-base hover:bg-[#E5DDCF] hover:text-[#2C2C2C] transition-all"
            >
              <FaShieldAlt className="text-[#8E7C68]" /> Review Policy <FaExternalLinkAlt className="text-xs opacity-70" />
            </a>
          </div>
          </AnimatedSection>
        </div>
      </section>
      </AnimatedSection>

      {/* 2. NOTIFICATIONS & MILESTONE BANNER */}
      <AnimatedSection animation="fade-up" delay={100}>
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20 w-full">
        <div className="bg-white border-2 border-[#8E7C68]/30 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="p-4 bg-[#F9F6F0] rounded-2xl text-[#8E7C68] border border-[#E5E0D8] flex-shrink-0 flex items-center justify-center">
              <FaBullhorn className="w-8 h-8 text-[#1E2530]" />
            </div>

            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-3 py-0.5 rounded-full text-xs tracking-wider uppercase">
                  New Notification
                </span>
                <span className="text-xs font-semibold text-[#8E7C68]">Milestone Announcement</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#1E2530] mb-3 font-serif">
                Proud Recipient of ISSN: 3048-7366 (ONLINE)
              </h2>

              <p className="text-sm sm:text-base text-[#5C5446] leading-relaxed mb-4">
                We're thrilled to announce that <strong>The Literary Scientist</strong> now proudly holds an <strong>ISSN: 3048-7366 (ONLINE)</strong>, marking a significant milestone in our journey. This achievement underscores our commitment to fostering interdisciplinary scholarship and creativity across literature, science, and beyond.
              </p>

              <p className="text-sm sm:text-base text-[#5C5446] leading-relaxed">
                With this call for contributions, we invite young minds and seasoned researchers alike to explore groundbreaking topics—from micro literature to digital humanities, cultural studies, and more. Be part of a pioneering publication that bridges disciplines and enriches the landscape of academic thought.
              </p>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* 3. CALL FOR CONTRIBUTIONS WITH OFFICIAL ANNOUNCEMENT POSTER (image.png) */}
      <AnimatedSection animation="fade-up" delay={100}>
      <section className="max-w-6xl mx-auto px-4 py-12 w-full">
        <div className="bg-gradient-to-br from-[#1E2530] via-[#26303F] to-[#161B22] text-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl border border-gray-700/60 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Call For Contribution Is Live
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif leading-tight mb-3">
                  Vol. II Issue I (2025): Call for Contributions
                </h2>
                
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  We are pleased to announce the launch of our most recent contribution for our upcoming volume. Our Call for Contribution is already live for your upcoming volume. Take a look and share your thought within the time period.
                </p>
              </div>

              {/* Topics Highlights */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#D4AF37] mb-3">
                  Scope of Research Topics (Open for Submissions):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                  {callTopics.map((topic, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="/annousments/Olive-Green-Doodle-Final-Project-Cover-A4-Document.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#8E7C68] hover:bg-[#7D6B57] text-white rounded-lg font-bold text-sm transition-all shadow-md hover:shadow-lg"
                >
                  <FaFilePdf className="text-base" /> Document Details (PDF) <FaExternalLinkAlt className="text-xs opacity-70" />
                </a>

                <button
                  type="button"
                  onClick={() => setActiveModalPoster({
                    src: "/annousments/image.png",
                    title: "Vol. II Issue I (2025) Call for Contributions",
                    subtitle: "Official Call for Papers Announcement & Submission Details",
                    downloadName: "The_Literary_Scientist_Call_For_Contributions_Vol2_Issue1.png",
                    pdfLink: "/annousments/Olive-Green-Doodle-Final-Project-Cover-A4-Document.pdf"
                  })}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold text-sm transition-all"
                >
                  <FaExpandAlt className="text-xs" /> View Full Poster
                </button>

                <Link
                  to="/start-submission"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition-all shadow"
                >
                  Submit Paper <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>

            {/* Right Poster Preview Column (Call for Contributions Poster: image.png) */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                onClick={() => setActiveModalPoster({
                  src: "/annousments/image.png",
                  title: "Vol. II Issue I (2025) Call for Contributions",
                  subtitle: "Official Call for Papers Announcement & Submission Details",
                  downloadName: "The_Literary_Scientist_Call_For_Contributions_Vol2_Issue1.png",
                  pdfLink: "/annousments/Olive-Green-Doodle-Final-Project-Cover-A4-Document.pdf"
                })}
                className="relative group cursor-pointer max-w-[320px] sm:max-w-[340px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-900/30 p-2"
              >
                {/* Poster Image with Natural Aspect Ratio */}
                <div className="rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center">
                  <img
                    src="/annousments/image.png"
                    alt="The Literary Scientist - Call for Contributions Vol. II Issue I (2025)"
                    className="w-full h-auto max-h-[460px] object-contain block"
                    loading="lazy"
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2530]/90 via-[#1E2530]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold">Official Announcement</span>
                      <p className="text-sm font-bold">Click to enlarge poster & scan QR</p>
                    </div>
                    <span className="p-2.5 bg-white text-[#1E2530] rounded-full shadow-lg">
                      <FaExpandAlt className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Badge Tag */}
                <div className="absolute top-4 left-4 bg-[#1E2530]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold border border-white/20 shadow">
                  Vol. II Issue I (2025)
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* 4. LATEST PUBLISHED ISSUE (VOLUME I ISSUE III - JULY 2025) WITH OFFICIAL ISSUE COVER (image2.png) */}
      <AnimatedSection animation="fade-up" delay={100}>
      <section id="current-issue" className="max-w-6xl mx-auto px-4 py-8 w-full">
        
        {/* Issue Showcase Header Banner with Cover Art */}
        <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 md:p-10 mb-10 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Issue Cover Art (image2.png) */}
            <div className="md:col-span-4 lg:col-span-3 flex justify-center">
              <div
                onClick={() => setActiveModalPoster({
                  src: "/annousments/image2.png",
                  title: "The Literary Scientist — Volume I, Issue III (2025)",
                  subtitle: "Official Issue Cover Artwork • ISSN: 3048-7366 (ONLINE)",
                  downloadName: "The_Literary_Scientist_Vol1_Issue3_Cover.png",
                  pdfLink: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_26.pdf"
                })}
                className="relative group cursor-pointer w-full max-w-[210px] rounded-2xl overflow-hidden shadow-xl border border-[#E5E0D8] hover:border-[#8E7C68] transform transition-all duration-300 hover:scale-[1.03] bg-[#FAF7F2] p-1.5"
              >
                <div className="rounded-xl overflow-hidden bg-white">
                  <img
                    src="/annousments/image2.png"
                    alt="The Literary Scientist Volume I Issue III 2025 Cover"
                    className="w-full h-auto max-h-[290px] object-contain block mx-auto"
                    loading="lazy"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2530]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3 text-white">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-[#1E2530] px-3 py-1.5 rounded-full shadow">
                    <FaExpandAlt className="text-[10px]" /> Enlarge Cover
                  </span>
                </div>

                <div className="absolute top-3 left-3 bg-[#1E2530]/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow">
                  Issue Cover
                </div>
              </div>
            </div>

            {/* Issue Details & Metadata */}
            <div className="md:col-span-8 lg:col-span-9 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-[#1E2530] text-white text-xs font-bold uppercase tracking-wider rounded-full">
                  Latest Published Issue
                </span>
                <span className="px-3 py-1 bg-[#FAF7F2] text-[#8E7C68] border border-[#E5E0D8] text-xs font-semibold rounded-full flex items-center gap-1">
                  <FaCalendarAlt className="text-xs" /> July, 2025
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-full flex items-center gap-1">
                  <FaCheckCircle className="text-xs text-emerald-600" /> 10 Articles Published
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2530] font-serif leading-tight">
                Volume I, Issue III (July, 2025)
              </h2>

              <p className="text-sm sm:text-base text-[#5C5446] leading-relaxed font-serif">
                This edition brings together rigorous cross-disciplinary investigations exploring contemporary mythological literature, cinema, gendered rural agency, folk art traditions, eco-criticism, and transnational identities.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalPoster({
                    src: "/annousments/image2.png",
                    title: "The Literary Scientist — Volume I, Issue III (2025)",
                    subtitle: "Official Issue Cover Artwork • ISSN: 3048-7366 (ONLINE)",
                    downloadName: "The_Literary_Scientist_Vol1_Issue3_Cover.png",
                    pdfLink: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_26.pdf"
                  })}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E2530] border border-[#E5E0D8] rounded-lg text-xs sm:text-sm font-bold transition-all shadow-sm"
                >
                  <FaQrcode className="text-[#8E7C68]" /> View Cover & QR
                </button>

                <a
                  href="#articles-list"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E2530] hover:bg-[#2C384A] text-white rounded-lg text-xs sm:text-sm font-bold transition-all shadow"
                >
                  <FaBookOpen /> Jump to Articles ({filteredArticles.length})
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Search & Filter Header */}
        <div id="articles-list" className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-[#E5E0D8] pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#8E7C68] font-bold text-sm uppercase tracking-wider mb-2">
              <FaBookOpen /> Table of Contents
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E2530] font-serif">
              Published Research Articles
            </h3>
            <p className="text-[#5C5446] text-xs sm:text-sm mt-1">
              Select any paper below to view full details and download the peer-reviewed PDF manuscript.
            </p>
          </div>

          {/* Quick Search in Current Issue */}
          <div className="w-full md:w-72">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles or authors..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E0D8] rounded-lg text-sm focus:outline-none focus:border-[#8E7C68] focus:ring-1 focus:ring-[#8E7C68] shadow-sm"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
            </div>
          </div>
        </div>

        {/* Articles List Grid */}
        <div className="space-y-4 mb-10">
          {filteredArticles.length === 0 ? (
            <div className="bg-white p-12 rounded-xl text-center border border-[#E5E0D8] text-[#5C5446]">
              <p className="font-semibold text-lg">No articles found matching "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-3 text-sm text-[#8E7C68] underline hover:text-[#2C2C2C]"
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredArticles.map((article, index) => (
              <article
                key={article.id}
                className="bg-white border border-[#E5E0D8] hover:border-[#8E7C68]/60 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4 flex-grow">
                  {/* Article index pill */}
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] font-bold text-xs flex items-center justify-center font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#FAF7F2] text-[#8E7C68] border border-[#EFE9DF]">
                        {article.category}
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium">
                        Vol I, Issue III (July 2025)
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#1E2530] group-hover:text-[#8E7C68] transition-colors leading-snug font-serif">
                      <a href={article.pdfUrl} target="_blank" rel="noopener noreferrer">
                        {article.title}
                      </a>
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-[#5C5446]">
                      <span className="font-semibold flex items-center gap-1.5 text-[#2C2C2C]">
                        <FaUserEdit className="text-[#8E7C68]" /> {article.author}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PDF Link Button */}
                <div className="flex-shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#F0EBE1] flex justify-end">
                  <a
                    href={article.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#1E2530] text-[#1E2530] hover:text-white border border-[#E5E0D8] hover:border-[#1E2530] rounded-lg text-xs sm:text-sm font-bold transition-all shadow-sm group-hover:shadow"
                  >
                    <FaFilePdf className="text-red-600 group-hover:text-red-400" />
                    <span>Download PDF</span>
                    <FaExternalLinkAlt className="text-[10px] opacity-60" />
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
      </AnimatedSection>

      {/* 5. PREVIOUS ISSUES SECTION (PERFECT VERTICAL CARD ORIENTATION) */}
      <AnimatedSection animation="fade-up" delay={100}>
      <section className="bg-white border-y border-[#E5E0D8] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#1E2530] font-serif uppercase tracking-wide mb-3">
              Previous Issues
            </h2>
            <div className="w-16 h-1 bg-[#8E7C68] mx-auto rounded-full mb-4"></div>
            <p className="text-[#5C5446] max-w-2xl mx-auto text-sm sm:text-base font-serif">
              Explore archived volumes documenting the intellectual trajectory and foundational publications of The Literary Scientist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-10 max-w-4xl mx-auto">
            {previousIssues.map((issue, idx) => (
              <div
                key={idx}
                className="bg-[#FAF7F2] border border-[#E5E0D8] hover:border-[#8E7C68] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Header Info */}
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="px-3 py-0.5 bg-white border border-[#E5E0D8] text-[#8E7C68] rounded-full text-xs font-bold tracking-wider uppercase shadow-xs">
                      {issue.status}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                      <FaCalendarAlt className="text-[#8E7C68] text-xs" /> {issue.date}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-[#1E2530] font-serif tracking-tight">
                    {issue.volume} ({issue.date.split(',')[0]}, {issue.date.split(',')[1]?.trim()})
                  </h3>
                </div>

                {/* Centered Journal Cover (Natural Portrait Proportion - No Distortion) */}
                <div className="my-3 flex justify-center">
                  <div
                    onClick={() => setActiveModalPoster({
                      src: issue.coverImg,
                      title: `The Literary Scientist — ${issue.volume}`,
                      subtitle: `${issue.status} • Published: ${issue.date}`,
                      downloadName: `The_Literary_Scientist_${issue.volume.replace(/[^a-zA-Z0-9]/g, '_')}_Cover.png`,
                      pdfLink: null
                    })}
                    className="relative cursor-pointer w-full max-w-[220px] rounded-2xl overflow-hidden shadow-md group-hover:shadow-2xl border-2 border-white bg-white transform group-hover:scale-[1.03] transition-all duration-300 p-1"
                  >
                    <div className="rounded-xl overflow-hidden bg-neutral-50 flex items-center justify-center">
                      <img
                        src={issue.coverImg}
                        alt={`${issue.volume} Cover`}
                        className="w-full h-auto max-h-[300px] object-contain block mx-auto"
                        loading="lazy"
                      />
                    </div>

                    <div className="absolute inset-0 bg-[#1E2530]/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-white">
                      <span className="text-xs font-bold bg-white text-[#1E2530] px-3 py-1.5 rounded-full shadow flex items-center gap-1.5">
                        <FaExpandAlt className="text-[10px]" /> Enlarge Cover
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description and Action Footer */}
                <div className="mt-4 pt-4 border-t border-[#E5E0D8]">
                  <p className="text-[#5C5446] text-xs sm:text-sm leading-relaxed mb-5 font-serif text-center sm:text-left">
                    {issue.description}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalPoster({
                        src: issue.coverImg,
                        title: `The Literary Scientist — ${issue.volume}`,
                        subtitle: `${issue.status} • Published: ${issue.date}`,
                        downloadName: `The_Literary_Scientist_${issue.volume.replace(/[^a-zA-Z0-9]/g, '_')}_Cover.png`,
                        pdfLink: null
                      })}
                      className="inline-flex items-center gap-1.5 text-xs text-[#8E7C68] hover:text-[#1E2530] font-semibold transition-colors"
                    >
                      <FaQrcode className="text-xs" /> Scan QR / View Cover
                    </button>

                    <Link
                      to={issue.link}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-[#1E2530] hover:bg-[#8E7C68] text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      View Archive <FaArrowRight className="text-[10px]" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/archive"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1E2530] text-white rounded-lg font-bold text-sm sm:text-base hover:bg-[#2C384A] transition-all shadow"
            >
              Browse Complete Archive <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* 6. JOURNAL SCOPE, OPEN ACCESS & REVIEW POLICY */}
      <AnimatedSection animation="fade-up" delay={100}>
      <section className="py-16 px-4 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* About Journal Statement */}
          <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-2xl border border-[#E5E0D8] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#8E7C68] text-xs font-bold uppercase tracking-widest mb-3">
                <FaBookOpen /> Journal Information & Policy
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E2530] font-serif mb-6">
                About The Literary Scientist
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[#5C5446] leading-relaxed font-serif">
                <p>
                  <strong>The Literary Scientist</strong> is a multilingual (English, Bengali) multi-disciplinary peer-reviewed academic journal for literature and science. The Literary Scientist follows an Open Access Policy for copyright and licensing.
                </p>
                <p>
                  If you are using or reproducing content from this platform, you need to appropriately cite the author(s) and the journal name.
                </p>
                <p>
                  The journal has published its issues thrice a year online since 2023. We are going to publish in print version very soon.
                </p>
              </div>

              {/* Key Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#E5E0D8]">
                <div className="flex items-start gap-3">
                  <FaLanguage className="text-[#8E7C68] mt-1 flex-shrink-0 text-base" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1E2530] uppercase">Languages</h4>
                    <p className="text-xs text-gray-500">English & Bengali</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="text-[#8E7C68] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1E2530] uppercase">Frequency</h4>
                    <p className="text-xs text-gray-500">Thrice a Year</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaPrint className="text-[#8E7C68] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1E2530] uppercase">Formats</h4>
                    <p className="text-xs text-gray-500">Online & Print (Soon)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E0D8] flex flex-wrap gap-4">
              <Link
                to="/about"
                className="text-sm font-bold text-[#1E2530] hover:text-[#8E7C68] inline-flex items-center gap-1.5 transition-colors"
              >
                Learn More About Aims & Scope <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>

          {/* Review Policy & Submission Sidebar */}
          <div className="flex flex-col gap-6">
            
            {/* Review Policy Card */}
            <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border-2 border-[#8E7C68]/40 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#8E7C68] uppercase tracking-wider mb-2">
                  <FaShieldAlt /> Academic Integrity
                </div>
                <h3 className="text-xl font-bold text-[#1E2530] font-serif mb-3">
                  Review Policy
                </h3>
                <p className="text-sm text-[#5C5446] mb-6 leading-relaxed">
                  Our rigorous double-blind peer-review policy ensures highest standards of academic rigor, novelty, and interdisciplinary integrity.
                </p>
              </div>

              <a
                href="/Review-Policy-TLS.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1E2530] hover:bg-[#8E7C68] text-white rounded-lg font-bold text-sm transition-all shadow text-center"
              >
                <FaFilePdf /> Download Review Policy <FaExternalLinkAlt className="text-xs opacity-70" />
              </a>
            </div>

            {/* Citation & Open Access Notice Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E0D8] shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                <FaQuoteRight /> Open Access
              </div>
              <h3 className="text-lg font-bold text-[#1E2530] mb-2 font-serif">
                Citation & Attribution
              </h3>
              <p className="text-xs text-[#5C5446] leading-relaxed">
                All articles are freely accessible. Users are required to cite the author(s) and <em>The Literary Scientist</em> in all reproductions and academic references.
              </p>
              <div className="mt-4 pt-4 border-t border-[#E5E0D8]">
                <Link
                  to="/journal-policies"
                  className="text-xs font-bold text-[#8E7C68] hover:text-[#1E2530] inline-flex items-center gap-1"
                >
                  View All Journal Policies <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>
      </AnimatedSection>

      {/* 7. FULLSCREEN LIGHTBOX MODAL FOR ANY POSTER / COVER */}
      {activeModalPoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative max-w-2xl w-full max-h-[92vh] flex flex-col bg-[#1E2530] border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-5 py-3.5 bg-[#161B22] border-b border-gray-700 text-white">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-[#8E7C68] text-white rounded">
                  {activeModalPoster.title.split('—')[0] || "Poster"}
                </span>
                <span className="text-sm font-semibold hidden sm:inline text-gray-300 truncate max-w-md">
                  {activeModalPoster.subtitle || activeModalPoster.title}
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => setActiveModalPoster(null)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Scrollable Image (Guaranteed 100% Non-Cropped Fit) */}
            <div className="p-4 overflow-y-auto flex items-center justify-center bg-neutral-950/90 min-h-[300px]">
              <img
                src={activeModalPoster.src}
                alt={activeModalPoster.title}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-gray-700 mx-auto"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap justify-between items-center gap-3 px-5 py-3 bg-[#161B22] border-t border-gray-700">
              <a
                href={activeModalPoster.src}
                download={activeModalPoster.downloadName || "poster.png"}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
              >
                <FaDownload className="text-xs" /> Save Image
              </a>

              <div className="flex items-center gap-2">
                {activeModalPoster.pdfLink && (
                  <a
                    href={activeModalPoster.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8E7C68] hover:bg-[#7D6B57] text-white text-xs sm:text-sm font-bold rounded-lg transition-colors"
                  >
                    <FaFilePdf /> Details PDF
                  </a>
                )}
                <Link
                  to="/start-submission"
                  onClick={() => setActiveModalPoster(null)}
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

export default Home;
