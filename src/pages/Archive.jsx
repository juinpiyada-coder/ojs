import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBookOpen,
  FaFilePdf,
  FaAward,
  FaCalendarAlt,
  FaUserEdit,
  FaCheckCircle,
  FaLanguage,
  FaExternalLinkAlt,
  FaSearch,
  FaExpandAlt,
  FaTimes,
  FaDownload,
  FaQrcode,
  FaHeart,
  FaArrowRight
} from 'react-icons/fa';

const archivedVolumes = [
  {
    id: "vol1-issue2",
    volume: "Volume I Issue II",
    date: "January, 2025",
    status: "Archived Issue",
    coverImg: "/annousments/image copy.png",
    description: "Featuring peer-reviewed research across neuroplasticity in academic gauging, psychoanalytic film theory, microfiction, eco-narratives, and maternal healthcare access.",
    articles: [
      {
        id: 1,
        title: "Praxis in Academic Gauging: A Critique to Scholastic Module of Neuroplasticity Dialogue on Mental Health.",
        author: "Bidisha Chakraborty",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/02/Praxis_final.pdf",
        category: "Mental Health & Pedagogy"
      },
      {
        id: 2,
        title: "Phallic Myth and Sexual Rapport Reprogrammed: Lacanian Analysis of Bryan Forbes, Film The Stepford Wives (1975).",
        author: "Biswadip Mal",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/02/Phallic_Final.pdf",
        category: "Psychoanalysis & Cinema"
      },
      {
        id: 3,
        title: "Jung’s Archetypes and Baum’s Attempt at Ethical Neutrality in The Wizard of Oz.",
        author: "Sounak Banerjee",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/02/Sounak_final.pdf",
        category: "Archetypal Literary Theory"
      },
      {
        id: 4,
        title: "Remaining Literary Forms: Twitterature and Instapoetry as Microfiction.",
        author: "Anuska Bag",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/02/Remaining-literacy_Final.pdf",
        category: "Digital Humanities & Microfiction"
      },
      {
        id: 5,
        title: "Critiquing the Eco-Narratives.",
        author: "Debanjan Chakraborty",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/02/Critiquing_final.pdf",
        category: "Eco-Criticism"
      },
      {
        id: 6,
        title: "Subverting the Patriarchal Trope by Challenging Toxic Masculinity in Feminist Revenge Fantasy: An Analysis of Anvita Dutt’s ‘Bulbul’ and Prosit Roy’s ‘Pari’.",
        author: "Quincy Tikadar",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/02/Subverting_final.pdf",
        category: "Gender Studies & Film"
      },
      {
        id: 7,
        title: "Intersecting Inequalities: The Role of Caste and Socioeconomic Status in Maternal Healthcare Access.",
        author: "Suchismita Mitra and Samriddha Biswas",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/02/The-Role_Final.pdf",
        category: "Social Sciences & Public Health"
      },
      {
        id: 8,
        title: "MENSTRUAL EDUCATION THROUGH INDIAN INFO COMIC MENSTRUPEDIA.",
        author: "Firthouse Tajuddin and Dr. K. Sindhu",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/02/Mentrual_Final.pdf",
        category: "Graphic Medicine & Education"
      },
      {
        id: 9,
        title: "WOUNDS OF THE PAST: Feminine Histories and Silent Landscapes in Ice-Candy-Man and What the Body Remembers.",
        author: "Kazmi Afrose",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/02/Wound-of-the-past_Final.pdf",
        category: "Partition Literature & Memory"
      },
      {
        id: 10,
        title: "Film Review: Breaking Barriers with Laughter in “Badhaai Do”.",
        author: "Pallabi Gharami",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/02/Badhaai-Do_Final.pdf",
        category: "Queer Studies & Cinema"
      }
    ]
  },
  {
    id: "vol1-issue1",
    volume: "Volume I Issue I",
    date: "December, 2023",
    status: "Inaugural Issue",
    coverImg: "/annousments/img2.png",
    description: "Inaugural volume establishing the multidisciplinary junction between literature, physical sciences, language acquisition, and critical philosophy.",
    articles: [
      {
        id: 1,
        title: "Gendering Wartime Sexual Violence Against Women in Bangladesh: The Liberation War and the Struggles of the War Heroines in the book “Birangona”.",
        author: "Quince Tikadar",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2024/07/Gendering-1.pdf",
        category: "Gender & Historical Violence"
      },
      {
        id: 2,
        title: "ভারতীয় সাহিত্যঃ লোক সংস্কৃতি ও মিথের বহূকৌনিকের গোমোণ।",
        author: "Samaresh Mondal",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2024/07/bharatiya-sahitya-1.pdf",
        category: "Indian Literature & Folklore"
      },
      {
        id: 3,
        title: "শ্রীগদ্যশরীর : একটি বিশ্লেষণী পাঠ ।",
        author: "Debasree Pal",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2024/07/goddosorir-2-1.pdf",
        category: "Bengali Literary Criticism"
      },
      {
        id: 4,
        title: "আমাদের জল জীবন।",
        author: "Aritree De",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2024/07/jol-1.pdf",
        category: "Eco-Humanities & Culture"
      },
      {
        id: 5,
        title: "Book Review: Heidegger and a Hippo Walk Through Those Pearly Gates.",
        author: "Agomoni Chakraborty",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2024/07/The_BOOK.pdf",
        category: "Philosophy & Book Review"
      },
      {
        id: 6,
        title: "The Euclidean Mind and the major Archetypes in Dostoevsky’s novel, The Brothers Karamazov.",
        author: "Al Minar Mahmudur Reza",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2024/07/The-euclident-mind.pdf",
        category: "Mathematics & Classic Literature"
      },
      {
        id: 7,
        title: "The Influence of Music Videos in Second Language Listening Development: A Study of the Undergraduate Students of Dhaka City.",
        author: "Farah Ulfat Mohinee and Progga Saha",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2024/07/The-Influence.pdf",
        category: "Linguistics & Pedagogy"
      },
      {
        id: 8,
        title: "“Where words fail, music speaks”: The Role of Influential Music in Shaping Young Adults’ Identities and Perspectives.",
        author: "Simanta Nandy and Sumedha Ghosh",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2024/07/The_role.pdf",
        category: "Cultural Studies & Musicology"
      },
      {
        id: 9,
        title: "Delineating Eco-Epistemic Paradigms: A Multifaceted Exegesis of Environmental Morality and Hegemonic Dynamics in Mandaar and Macbeth.",
        author: "Soumabha Chakraborty and Sounak Banerjee",
        pdfUrl: null,
        category: "Comparative Drama & Eco-Epistemology"
      },
      {
        id: 10,
        title: "The Gollem Effect: Integration of Gollem-Class AIs during the Climate Change in Online Ecosystem.",
        author: "Megha Bhattacharya and Arkannel Khan",
        pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2024/07/Golem-Effect-Final.pdf",
        category: "AI, Ecology & Online Discourse"
      }
    ]
  }
];

const Archive = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVolume, setSelectedVolume] = useState('all');
  const [activeModalPoster, setActiveModalPoster] = useState(null);

  const filteredVolumes = archivedVolumes
    .filter((vol) => selectedVolume === 'all' || vol.id === selectedVolume)
    .map((vol) => {
      const filteredArticles = vol.articles.filter(
        (art) =>
          art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          art.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          art.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...vol, articles: filteredArticles };
    });

  return (
    <main className="flex-grow bg-[#F9F6F0] text-[#2C2C2C] py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* 1. Header Section */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#1E2530] text-[#F9F6F0] rounded-full text-xs md:text-sm font-semibold tracking-wider shadow-sm">
              <FaAward className="text-[#D4AF37]" /> ISSN: 3048-7366 (ONLINE)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#E5E0D8] text-[#5C5446] rounded-full text-xs md:text-sm font-medium shadow-sm">
              <FaLanguage className="text-[#8E7C68]" /> Multilingual (Bengali & English)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#E5E0D8] text-[#5C5446] rounded-full text-xs md:text-sm font-medium shadow-sm">
              <FaCheckCircle className="text-emerald-600" /> Open Access Archive
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1E2530] font-serif uppercase tracking-tight mb-4">
            Journal Archives
          </h1>
          <p className="text-xl sm:text-2xl text-[#8E7C68] font-serif italic mb-6 font-medium">
            The Literary Scientist: A Multi-Disciplinary Journal for Literature and Science
          </p>
          <div className="w-24 h-1 bg-[#8E7C68] mx-auto rounded-full mb-6"></div>
          <p className="text-base sm:text-lg text-[#5C5446] font-serif max-w-3xl mx-auto leading-relaxed">
            Explore past peer-reviewed volumes documenting the intellectual genesis and ongoing trajectory of multidisciplinary research across science and the humanities.
          </p>
        </div>

        {/* 2. Editorial Appreciation Message Banner */}
        <section className="bg-white border-2 border-[#8E7C68]/30 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] flex items-center justify-center flex-shrink-0">
              <FaHeart className="w-6 h-6 text-red-500" />
            </div>

            <div className="space-y-3">
              <span className="inline-block px-3 py-0.5 bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] rounded-full text-xs font-bold uppercase tracking-wider">
                Editorial Note & Appreciation
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1E2530] font-serif">
                A Heartfelt Thank You to Our Academic Community
              </h2>
              <p className="text-sm sm:text-base text-[#5C5446] leading-relaxed font-serif">
                A heartfelt thank you to our contributors, reviewers, and the editorial team for their dedication and expertise in making this inaugural issue a reality. This is just the beginning! Stay Tuned for future issues as we continue to explore and contribute to the ever-evolving landscape of our journal.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#8E7C68]">
                <span>The Literary Scientist</span> • <span>Published Online Since 2023</span> • <span>Thrice a Year</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Search and Volume Filter Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-[#E5E0D8] shadow-xs">
          
          {/* Volume Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedVolume('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedVolume === 'all'
                  ? 'bg-[#1E2530] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#5C5446] hover:bg-[#EFE9DF]'
              }`}
            >
              All Volumes
            </button>
            <button
              onClick={() => setSelectedVolume('vol1-issue2')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedVolume === 'vol1-issue2'
                  ? 'bg-[#1E2530] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#5C5446] hover:bg-[#EFE9DF]'
              }`}
            >
              Vol. I Issue II (Jan 2025)
            </button>
            <button
              onClick={() => setSelectedVolume('vol1-issue1')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedVolume === 'vol1-issue1'
                  ? 'bg-[#1E2530] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#5C5446] hover:bg-[#EFE9DF]'
              }`}
            >
              Vol. I Issue I (Dec 2023)
            </button>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, author, topic..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#8E7C68] focus:bg-white transition-colors"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
          </div>

        </div>

        {/* 4. Archived Volumes Showcase */}
        <div className="space-y-16">
          {filteredVolumes.map((vol) => (
            <section
              key={vol.id}
              className="bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8"
            >
              
              {/* Volume Header Banner with Cover Art */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-[#E5E0D8]">
                
                {/* Cover Image */}
                <div className="md:col-span-4 lg:col-span-3 flex justify-center">
                  <div
                    onClick={() => setActiveModalPoster({
                      src: vol.coverImg,
                      title: `The Literary Scientist — ${vol.volume}`,
                      subtitle: `${vol.status} • Published: ${vol.date}`,
                      downloadName: `The_Literary_Scientist_${vol.volume.replace(/[^a-zA-Z0-9]/g, '_')}_Cover.png`
                    })}
                    className="relative group cursor-pointer w-full max-w-[210px] rounded-2xl overflow-hidden shadow-lg border border-[#E5E0D8] hover:border-[#8E7C68] transform transition-all duration-300 hover:scale-[1.03] bg-[#FAF7F2] p-1.5"
                  >
                    <div className="rounded-xl overflow-hidden bg-white">
                      <img
                        src={vol.coverImg}
                        alt={`${vol.volume} Cover`}
                        className="w-full h-auto max-h-[290px] object-contain block mx-auto"
                        loading="lazy"
                      />
                    </div>

                    <div className="absolute inset-0 bg-[#1E2530]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3 text-white">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-[#1E2530] px-3 py-1.5 rounded-full shadow">
                        <FaExpandAlt className="text-[10px]" /> Enlarge Cover
                      </span>
                    </div>

                    <div className="absolute top-3 left-3 bg-[#1E2530]/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow">
                      {vol.status}
                    </div>
                  </div>
                </div>

                {/* Volume Details */}
                <div className="md:col-span-8 lg:col-span-9 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-[#1E2530] text-white text-xs font-bold uppercase tracking-wider rounded-full">
                      {vol.status}
                    </span>
                    <span className="px-3 py-1 bg-[#FAF7F2] text-[#8E7C68] border border-[#E5E0D8] text-xs font-semibold rounded-full flex items-center gap-1">
                      <FaCalendarAlt className="text-xs" /> {vol.date}
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-full flex items-center gap-1">
                      <FaCheckCircle className="text-xs text-emerald-600" /> {vol.articles.length} Research Papers
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2530] font-serif leading-tight">
                    {vol.volume} ({vol.date})
                  </h2>

                  <p className="text-sm sm:text-base text-[#5C5446] leading-relaxed font-serif">
                    {vol.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveModalPoster({
                        src: vol.coverImg,
                        title: `The Literary Scientist — ${vol.volume}`,
                        subtitle: `${vol.status} • Published: ${vol.date}`,
                        downloadName: `The_Literary_Scientist_${vol.volume.replace(/[^a-zA-Z0-9]/g, '_')}_Cover.png`
                      })}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E2530] border border-[#E5E0D8] rounded-lg text-xs sm:text-sm font-bold transition-all shadow-xs"
                    >
                      <FaQrcode className="text-[#8E7C68]" /> View Cover & QR
                    </button>
                    <a
                      href={`#${vol.id}-articles`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E2530] hover:bg-[#2C384A] text-white rounded-lg text-xs sm:text-sm font-bold transition-all shadow-xs"
                    >
                      <FaBookOpen /> Browse Papers ({vol.articles.length})
                    </a>
                  </div>
                </div>

              </div>

              {/* Table of Contents / Articles Grid */}
              <div id={`${vol.id}-articles`} className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-xl font-bold text-[#1E2530] font-serif flex items-center gap-2">
                    <FaBookOpen className="text-[#8E7C68] text-sm" /> Table of Contents
                  </h3>
                  <span className="text-xs font-semibold text-gray-500">
                    Showing {vol.articles.length} papers
                  </span>
                </div>

                {vol.articles.length === 0 ? (
                  <div className="bg-[#FAF7F2] p-8 rounded-xl text-center border border-[#E5E0D8] text-[#5C5446]">
                    <p className="font-semibold text-sm">No articles match your search in this volume.</p>
                  </div>
                ) : (
                  vol.articles.map((article, index) => (
                    <article
                      key={article.id}
                      className="bg-[#FAF7F2]/60 hover:bg-white border border-[#E5E0D8] hover:border-[#8E7C68]/60 rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4 flex-grow">
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-[#E5E0D8] text-[#8E7C68] font-bold text-xs flex items-center justify-center font-mono">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-white text-[#8E7C68] border border-[#EFE9DF]">
                              {article.category}
                            </span>
                            <span className="text-[11px] text-gray-500 font-medium">
                              {vol.volume} ({vol.date})
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-[#1E2530] group-hover:text-[#8E7C68] transition-colors leading-snug font-serif">
                            {article.pdfUrl ? (
                              <a href={article.pdfUrl} target="_blank" rel="noopener noreferrer">
                                {article.title}
                              </a>
                            ) : (
                              <span>{article.title}</span>
                            )}
                          </h4>

                          <div className="flex items-center gap-1.5 text-xs text-[#5C5446] font-medium">
                            <FaUserEdit className="text-[#8E7C68]" /> <span>by {article.author}</span>
                          </div>
                        </div>
                      </div>

                      {/* PDF Link Button */}
                      <div className="flex-shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#F0EBE1] flex justify-end">
                        {article.pdfUrl ? (
                          <a
                            href={article.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-[#1E2530] text-[#1E2530] hover:text-white border border-[#E5E0D8] hover:border-[#1E2530] rounded-lg text-xs font-bold transition-all shadow-xs"
                          >
                            <FaFilePdf className="text-red-600 group-hover:text-red-400" />
                            <span>Download PDF</span>
                            <FaExternalLinkAlt className="text-[9px] opacity-60" />
                          </a>
                        ) : (
                          <span className="text-xs font-semibold text-gray-400 italic px-3 py-1.5 bg-gray-100 rounded-lg">
                            Archived Record
                          </span>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>

            </section>
          ))}
        </div>

        {/* 5. Navigation Footer to Current Issue & Submit */}
        <section className="bg-gradient-to-r from-[#1E2530] via-[#2A3342] to-[#1E2530] text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold font-serif">
              Looking for the Latest Published Research?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base font-serif leading-relaxed">
              Explore our current active issue or submit your manuscript for our upcoming volume.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
              <Link
                to="/current-issue"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#8E7C68] hover:bg-[#7D6B57] text-white rounded-xl font-bold text-sm sm:text-base transition-all shadow-md"
              >
                <FaBookOpen /> View Current Issue <FaArrowRight className="text-xs" />
              </Link>
              <Link
                to="/start-submission"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm sm:text-base transition-all shadow-md"
              >
                Submit Paper <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </section>

      </div>

      {/* 6. Universal Fullscreen Lightbox Modal */}
      {activeModalPoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative max-w-2xl w-full max-h-[92vh] flex flex-col bg-[#1E2530] border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-5 py-3.5 bg-[#161B22] border-b border-gray-700 text-white">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-[#8E7C68] text-white rounded">
                  {activeModalPoster.title.split('—')[0] || "Cover"}
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

            {/* Modal Body: Non-Cropped Fit */}
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
                download={activeModalPoster.downloadName || "cover.png"}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
              >
                <FaDownload className="text-xs" /> Save Cover Image
              </a>

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
      )}

    </main>
  );
};

export default Archive;
