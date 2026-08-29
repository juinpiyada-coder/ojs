import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import SEO from '../components/SEO';
import {
  FaBookOpen,
  FaFilePdf,
  FaAward,
  FaCalendarAlt,
  FaSearch,
  FaExpandAlt,
  FaTimes,
  FaDownload,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaUserEdit,
  FaQrcode,
  FaArrowRight
} from 'react-icons/fa';

const defaultIssueArticles = [
  {
    id: 1,
    title: "Bridging Cinematic Narratives and Literary Depths: Fusions in Contemporary Mythological Novels Concerning Amish Tripathi’s Ram Chandra Series",
    author: "Garima Singh",
    category: "MYTHOLOGICAL FICTION & CINEMA",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 26-30",
    doi: "10.5281/zenodo.1082326",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_26.pdf",
    abstract: "This paper examines the gripping cinematic structure of the Ram Chandra Series by Amish Tripathi and explores the building of gradually diversified and multi-dimensional narratives in contemporary mythical novels."
  },
  {
    id: 2,
    title: "Retelling the Past: Cinematic Narratives of Oppression and Resistance in Bolivia and Bengal",
    author: "Ahana Bhandari",
    category: "COMPARATIVE CULTURAL STUDIES",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 31-36",
    doi: "10.5281/zenodo.1082327",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_27.pdf",
    abstract: "Politics forms the backbone of the cinematic visions of Jorge Sanjines and Mrinal Sen, filmmakers from twentieth-century Bolivia and Bengal respectively."
  },
  {
    id: 3,
    title: "What Did She Know About Transformation That We Don’t?",
    author: "Lina Mandal",
    category: "LITERARY THEORY & CRITICISM",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 37-41",
    doi: "10.5281/zenodo.1082328",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_28.pdf",
    abstract: "An old woman lingers in Sir Bertilak’s castle, silent and unnoticed. Only at the end of Sir Gawain and the Green Knight is her name revealed—Morgan le Fay."
  },
  {
    id: 4,
    title: "Laapataa Ladies: A Cinematic Satire on Gendered Invisibility and Rural Agency",
    author: "Satyam Kumar",
    category: "GENDER STUDIES & FILM",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 42-47",
    doi: "10.5281/zenodo.1082330",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_30.pdf",
    abstract: "Kiran Rao’s Laapataa Ladies (2023) is a poignant and satirical exploration of women’s invisibility within the patriarchal fabric of rural India."
  },
  {
    id: 5,
    title: "Patachitra Tradition and Artist Kalam Pauta: A Theoretical Perspective on Art and Literature",
    author: "Dr. Rakesh Kaibartya",
    category: "ART, FOLK TRADITION & LITERATURE",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 48-54",
    doi: "10.5281/zenodo.1082331",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_31.pdf",
    abstract: "Explores the traditional Patachitra artistic motifs and their theoretical resonance in contemporary literary narratives."
  },
  {
    id: 6,
    title: "Beyond the Characters: Nature Shapes the Story in “Ullozhukku”",
    author: "Dona Joseph",
    category: "ECO-CRITICISM & NARRATIVE",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 55-60",
    doi: "10.5281/zenodo.1082332",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_32.pdf",
    abstract: "Ullozhukku is a 2024 Malayalam drama film exploring female agency and ecological symbolism amid Kerala floods."
  },
  {
    id: 7,
    title: "How Ideology Shapes Consumption: The Case of Oil Palm Industry and Red Meat Production",
    author: "Souvik Karmakar",
    category: "ENVIRONMENTAL SCIENCES & POLICY",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 61-68",
    doi: "10.5281/zenodo.1082333",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_.33.pdf",
    abstract: "An examination of ideological apparatuses directing agro-industrial consumption paradigms and ecological fallout."
  },
  {
    id: 8,
    title: "From ‘Little Maiden’ to ‘The Witch’: Exploring the Themes of Vampirism, Witchcraft and the Female Wanderer Through a Biographical Reading of Mary Coleridge’s “The Witch”",
    author: "Shibangi Ghose",
    category: "GOTHIC LITERATURE & GENDER",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 69-75",
    doi: "10.5281/zenodo.1082334",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_34.pdf",
    abstract: "Investigating gothic tropes, nocturnal anxiety, and female rebellion in Victorian poetry."
  },
  {
    id: 9,
    title: "The Word as Weapon: Language, Power, and Black Male Representation in Morrison’s Narratives",
    author: "Sakshi Virmani",
    category: "AFRICAN AMERICAN LITERATURE",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 76-82",
    doi: "10.5281/zenodo.1082337",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_37.pdf",
    abstract: "Analyzing the linguistic power structures and racialized masculine identities in Toni Morrison's seminal texts."
  },
  {
    id: 10,
    title: "Between Nations and Narratives: Transnational Engagement and Flexible Citizenship in American Betiya",
    author: "Kakoli Debnath and Dr. Binda Sah",
    category: "DIASPORA & TRANSNATIONALISM",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 83-90",
    doi: "10.5281/zenodo.1082338",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_.38.pdf",
    abstract: "Diasporic negotiations of identity, hybridity, and parental expectations in young adult transnational literature."
  }
];

const formatTitle = (str) => {
  if (!str) return '';
  const trimmed = str.trim();
  const upperCount = (trimmed.match(/[A-Z]/g) || []).length;
  const letterCount = (trimmed.match(/[A-Za-z]/g) || []).length;
  if (letterCount > 5 && upperCount / letterCount > 0.65) {
    return trimmed
      .toLowerCase()
      .replace(/(?:^|\s|[-“"'(/\\])\S/g, (c) => c.toUpperCase())
      .replace(/\b(And|Of|In|On|At|To|For|With|A|An|The|By|From)\b/g, (m, p1, offset) =>
        offset === 0 ? m : m.toLowerCase()
      );
  }
  return trimmed;
};

const CurrentIssue = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState(defaultIssueArticles);
  const [issueInfo, setIssueInfo] = useState({
    title: "Volume I, Issue III (July, 2025)",
    date: "July, 2025",
    volume: "Volume I",
    issue: "Issue III",
    coverImg: "/annousments/image2.png",
    description: "This edition brings together rigorous cross-disciplinary investigations exploring contemporary mythological literature, cinema, gendered rural agency, folk art traditions, eco-criticism, and transnational identities."
  });
  const [activePdfViewer, setActivePdfViewer] = useState(null);
  const [activeModalPoster, setActiveModalPoster] = useState(null);

  // Curated Volume 1 Issue 3 data remains static and verified

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.doi && a.doi.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-grow bg-[#F9F6F0] text-[#2C2C2C] py-12 md:py-20 px-4">
      <SEO
        title={`Current Issue: ${issueInfo.title} | The Literary Scientist`}
        description={`Read the latest peer-reviewed research papers published in The Literary Scientist: ${issueInfo.title}. Open access and freely downloadable.`}
        keywords="The Literary Scientist current issue, research articles, peer reviewed papers, literature and science"
        canonical="/current-issue"
      />

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Page Hero Header */}
        <AnimatedSection animation="fade-up">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#1E2530] text-[#F9F6F0] rounded-full text-xs font-semibold tracking-wider shadow-sm">
                <FaAward className="text-[#D4AF37]" /> ISSN: 3048-7366 (ONLINE)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#E5E0D8] text-[#5C5446] rounded-full text-xs font-medium shadow-sm">
                <FaCalendarAlt className="text-[#8E7C68]" /> {issueInfo.date}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-medium shadow-sm">
                <FaCheckCircle className="text-emerald-600" /> {articles.length} Articles Published
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1E2530] font-serif uppercase tracking-tight mb-4">
              Current Issue
            </h1>
            <p className="text-xl sm:text-2xl text-[#8E7C68] font-serif italic mb-6 font-medium">
              {issueInfo.title}
            </p>
            <div className="w-24 h-1 bg-[#8E7C68] mx-auto rounded-full mb-6"></div>
          </div>
        </AnimatedSection>

        {/* Issue Banner Showcase Card */}
        <AnimatedSection animation="fade-up" delay={100}>
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Cover Artwork */}
              <div className="md:col-span-4 flex justify-center">
                <div 
                  onClick={() => setActiveModalPoster({
                    src: issueInfo.coverImg,
                    title: `The Literary Scientist — ${issueInfo.title}`,
                    subtitle: "Official Issue Cover Artwork • ISSN: 3048-7366",
                    downloadName: "TLS_Current_Issue_Cover.png"
                  })}
                  className="relative group cursor-pointer w-full max-w-[240px] rounded-2xl overflow-hidden shadow-lg border-2 border-[#E5E0D8] hover:border-[#8E7C68] bg-white p-2 transition-transform duration-300 hover:scale-[1.02]"
                >
                  <img
                    src={issueInfo.coverImg}
                    alt={`${issueInfo.title} Cover`}
                    className="w-full h-auto max-h-[340px] object-contain rounded-xl block mx-auto"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 rounded-2xl">
                    <FaExpandAlt /> Enlarge Cover
                  </div>
                </div>
              </div>

              {/* Issue Description */}
              <div className="md:col-span-8 space-y-4">
                <span className="px-3 py-1 bg-[#1E2530] text-white text-[11px] font-bold uppercase tracking-wider rounded-full inline-block">
                  Official Publication Release
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E2530] font-serif leading-snug">
                  {issueInfo.title}
                </h2>
                <p className="text-sm sm:text-base text-[#5C5446] leading-relaxed font-serif">
                  {issueInfo.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <a
                    href="#toc"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E2530] hover:bg-[#2C384A] text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-all"
                  >
                    <FaBookOpen /> Jump to Table of Contents ({filteredArticles.length})
                  </a>
                  <Link
                    to="/archive"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E2530] border border-[#E5E0D8] rounded-xl text-xs sm:text-sm font-semibold transition-all"
                  >
                    <span>Browse Past Archives</span>
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </AnimatedSection>

        {/* Table of Contents Section */}
        <AnimatedSection animation="fade-up" delay={200}>
          <div id="toc" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E0D8] pb-4">
              <div>
                <span className="text-xs font-bold text-[#8E7C68] uppercase tracking-widest block mb-1">
                  Volume Contents
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E2530] font-serif">
                  Published Manuscripts ({filteredArticles.length})
                </h3>
              </div>

              <div className="w-full sm:w-72 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter manuscripts..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E0D8] rounded-xl text-xs focus:outline-none focus:border-[#8E7C68] shadow-xs"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
              </div>
            </div>

            {/* Articles List */}
            <div className="space-y-4">
              {filteredArticles.map((art, idx) => (
                <div
                  key={art.id || idx}
                  className="bg-white border border-[#E5E0D8] hover:border-[#8E7C68]/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
                >
                  <div className="flex items-start gap-4 flex-grow">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] font-bold text-xs flex items-center justify-center font-mono">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#FAF7F2] text-[#8E7C68] border border-[#EFE9DF]">
                          {art.category}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {art.volumeLabel || issueInfo.title}
                        </span>
                      </div>

                      <h4 
                        onClick={() => art.pdfUrl && setActivePdfViewer({
                          url: art.pdfUrl,
                          title: formatTitle(art.title),
                          author: art.author,
                          pages: art.pages,
                          doi: art.doi
                        })}
                        className="text-base sm:text-lg font-bold text-[#1E2530] font-serif leading-snug hover:text-[#8E7C68] transition-colors cursor-pointer"
                      >
                        {formatTitle(art.title)}
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5C5446]">
                        <span className="font-semibold flex items-center gap-1.5 text-[#2C2C2C]">
                          <FaUserEdit className="text-[#8E7C68]" /> {art.author}
                        </span>
                        {art.pages && <span className="font-mono text-gray-400">• {art.pages}</span>}
                        {art.doi && <span className="font-mono text-[#8E7C68]">• DOI: {art.doi}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#F0EBE1] flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setActivePdfViewer({
                        url: art.pdfUrl,
                        title: formatTitle(art.title),
                        author: art.author,
                        category: art.category,
                        pages: art.pages,
                        doi: art.doi
                      })}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FAF7F2] hover:bg-[#1E2530] text-[#1E2530] hover:text-white border border-[#E5E0D8] hover:border-[#1E2530] rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer group/btn"
                    >
                      <FaBookOpen className="text-[#8E7C68] group-hover/btn:text-white text-xs transition-colors" />
                      <span>Read Article</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </AnimatedSection>

      </div>

      {/* PDF Modal Reader */}
      {activePdfViewer && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setActivePdfViewer(null)}
        >
          <div 
            className="bg-[#1E2530] border border-gray-700 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#161B22] px-4 py-3 border-b border-gray-700 flex justify-between items-center text-white">
              <div className="min-w-0 pr-4">
                <span className="bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded mr-2">
                  Peer-Reviewed Publication
                </span>
                <span className="text-xs text-gray-400 font-mono">{activePdfViewer.pages} • {activePdfViewer.doi}</span>
                <h4 className="text-sm font-bold text-gray-100 truncate font-serif mt-1">
                  {activePdfViewer.title}
                </h4>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[11px] text-gray-400 font-mono hidden sm:inline bg-gray-800/80 px-2.5 py-1 rounded border border-gray-700">
                  Protected In-Browser Reader
                </span>
                <button
                  type="button"
                  onClick={() => setActivePdfViewer(null)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-neutral-900 w-full h-full relative">
              <iframe
                src={`${activePdfViewer.url}#toolbar=0&navpanes=0&scrollbar=1`}
                className="w-full h-full border-0 bg-white"
                title={activePdfViewer.title}
              />
            </div>
          </div>
        </div>
      )}

      {/* Poster Lightbox Modal */}
      {activeModalPoster && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setActiveModalPoster(null)}
        >
          <div 
            className="relative max-w-2xl w-full max-h-[92vh] flex flex-col bg-[#1E2530] border border-gray-700 rounded-2xl overflow-hidden shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-5 py-3.5 bg-[#161B22] border-b border-gray-700 text-white">
              <span className="text-sm font-semibold truncate">{activeModalPoster.title}</span>
              <button
                type="button"
                onClick={() => setActiveModalPoster(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex items-center justify-center bg-neutral-950/90">
              <img
                src={activeModalPoster.src}
                alt={activeModalPoster.title}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-gray-700"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CurrentIssue;
