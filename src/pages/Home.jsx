import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import SEO from '../components/SEO';
import { apiFetch, resolveFileUrl } from '../utils/api';
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
  FaQuoteLeft,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaExpandAlt,
  FaTimes,
  FaDownload,
  FaQrcode
} from 'react-icons/fa';

const featuredSliderPapers = [
  {
    id: 1,
    title: "BRIDGING CINEMATIC NARRATIVES AND LITERARY DEPTHS: FUSIONS IN CONTEMPORARY MYTHOLOGICAL NOVELS CONCERNING AMISH TRIPATHI’S RAM CHANDRA SERIES",
    author: "Garima Singh",
    category: "MYTHOLOGICAL FICTION & CINEMA",
    volume: "Vol I, Issue III (July 2025)",
    pages: "pp. 26-30",
    doi: "10.5281/zenodo.1082326",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_26.pdf",
    abstract: `Religious texts in the Indian context are perhaps the most utilised and most admired for every generation and genre. Irrespective of belonging to the contemporary age or being placed in the erstwhile era, Indian mythology and its umpteen tributaries have significantly influenced Indian Literature. The recent trends in the last decade have focused on exploring mythical tales in the light of modern literary texts and creating connections between archaeological evidence and mythical stories. The narratives in such works have been constructed as such to enamour a wider audience to take them through an emotionally resonant journey. The vivid descriptions construct a visual experience that mirrors the cinematic composition. Amish Tripathi does this experiment in the Ram Chandra Series and weaves a visual spectacle in a cinematic tapestry. This paper examines the gripping cinematic structure of the Ram Chandra Series by Amish Tripathi and explores the building of gradually diversified and multi-dimensional narratives in contemporary mythical novels. Along with that, it also attempts to analyze the book series from a modern and newly cultured perspective, creating a grand landscape and visual imagery through immersive experiences that construct a live-action substitute through contemporary literary texts.`
  },
  {
    id: 2,
    title: "Retelling the Past: Cinematic Narratives of Oppression and Resistance in Bolivia and Bengal",
    author: "Ahana Bhandari",
    category: "COMPARATIVE CULTURAL STUDIES",
    volume: "Vol I, Issue III (July 2025)",
    pages: "pp. 31-36",
    doi: "10.5281/zenodo.1082327",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_27.pdf",
    abstract: `Politics forms the backbone of the cinematic visions of Jorge Sanjines and Mrinal Sen, filmmakers from twentieth-century Bolivia and Bengal respectively. This paper examines the potential of cinema as a weapon of resistance by focusing on Sanjines’ El Corajo del Pueblo (1971) and Sen’s Akaler Sandhane (1982). Sanjines reconstructs the events of the 1967 San Juan massacre, where Bolivian government forces violently attacked striking tin miners, while Sen’s film depicts a film crew’s journey to rural Bengal to make a film about the devastating 1943 famine—a man-made tragedy linked to colonial exploitation during World War II. Both films revisit political violence through experimental cinematic forms that blur the boundaries between fiction and documentary. This paper explores how the directors’ direct engagement with oppressed communities becomes a tool for documenting collective memory and resistance. It also analyzes the use of aesthetics—non-linear narratives, montage, and self-reflexivity—as political strategies to foreground the realities of marginalized voices. In examining the coexistence of past and present within the structure of both films, the paper argues that the filmmaking process itself becomes an act of political intervention. Sanjines and Sen use cinema not just to represent, but to participate in resistance, offering a counter-narrative to dominant historical discourses. Their works demonstrate how film can function as a radical medium of protest, solidarity, and remembrance.`
  },
  {
    id: 3,
    title: "What Did She Know About Transformation That We Don’t?",
    author: "Lina Mandal",
    category: "LITERARY THEORY & CRITICISM",
    volume: "Vol I, Issue III (July 2025)",
    pages: "pp. 37-41",
    doi: "10.5281/zenodo.1082328",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_28.pdf",
    abstract: `An old woman lingers in Sir Bertilak’s castle, silent and unnoticed. Only at the end of Sir Gawain and the Green Knight is her name revealed—Morgan le Fay. A fleeting presence, a shadow behind the game. But was she merely a sorceress? Or a master of deeper knowledge, a scientist of transformation cloaked in mysticism? This paper reimagines Morgan le Fay through the lens of Le Morte d’Arthur, Vita Merlini, and medieval alchemical-herbal traditions. Far from a mere enchantress, her manipulation of life forms, elemental forces, and bodily change aligns with alchemy’s quest for transmutation, renewal and modern-day Pharmacology. Her creation of the Green Knight is no illusion—it echoes the origins of genetic manipulation. In medieval thought, metals were purified into gold through trial, just as Bertilak becomes a vessel of endurance and near-immortality to test Gawain’s virtue. The Green Knight’s seasonal return and survival of decapitation embody alchemical ideals of regeneration and the Elixir of Life. Could Morgan’s "sorcery" have roots in early proto-scientific knowledge? This interpretation is grounded in The Mirror of Alchemy (Roger Bacon), The Book of Secrets (Pseudo-Albertus Magnus), and The Emerald Tablet (Hermes Trismegistus), texts that blur the natural and the unnatural. Morgan’s imagined experimentations bridge medieval alchemy and modern debates on bioengineering, human enhancement, and life’s ethical boundaries. Perhaps Morgan wasn’t just shaping legend, but prefiguring the science and the dilemmas of the future.`
  },
  {
    id: 4,
    title: "Laapataa Ladies: A Cinematic Satire on Gendered Invisibility and Rural Agency",
    author: "Satyam Kumar",
    category: "GENDER STUDIES & FILM",
    volume: "Vol I, Issue III (July 2025)",
    pages: "pp. 42-47",
    doi: "10.5281/zenodo.1082330",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_30.pdf",
    abstract: `Kiran Rao’s Laapataa Ladies (2023) is a poignant and satirical exploration of women’s invisibility within the patriarchal fabric of rural India. Set against the backdrop of the early 2000s, the film opens with the accidental switching of two newlywed brides during a train journey—a mix-up that soon unravels into a nuanced commentary on gender, identity, and the oppressive social norms that dictate women's lives. While the plot appears light-hearted on the surface, it subtly challenges the audience to question the deep-rooted structures that normalize the marginalization of women, particularly in rural settings. This review positions Laapataa Ladies within the broader framework of feminist film discourse, examining how the film subverts conventional Bollywood tropes to foreground female subjectivity. Rao’s narrative resists the typical resolution-driven structure and instead prioritizes the internal journeys of the two protagonists as they navigate unexpected freedom, societal expectations, and self-discovery. The film’s portrayal of agency is refreshingly understated; rather than overt rebellion, the characters express resistance through small, meaningful acts that challenge the roles imposed upon them. Furthermore, the review engages with the film’s use of rural sociolinguistic textures, where dialect, humor, and silence serve as powerful tools of characterization and critique. Through authentic dialogues and situational irony, Laapataa Ladies crafts a world that is both specific and universally resonant. In doing so, Kiran Rao offers not just a story of misplaced brides, but a layered reflection on how women often find themselves lost within societal frameworks—and how they might begin to reclaim that space.`
  },
  {
    id: 5,
    title: "BEYOND THE CHARACTERS: NATURE SHAPES THE STORY IN “ULLOZHUKKU”",
    author: "Dona Joseph",
    category: "ECO-CRITICISM & NARRATIVE",
    volume: "Vol I, Issue III (July 2025)",
    pages: "pp. 55-60",
    doi: "10.5281/zenodo.1082332",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_32.pdf",
    abstract: `“Ullozhukku” (Under Current) is a 2024 Malayalam language drama film from India featuring female protagonists who represent two generations and the clash of their ideologies, experiences, and agency. It challenges the conventional positioning of women, motherhood, and the commodification of women. The dilemmas faced by the female protagonists, Anju (Parvathy Thiruvothu) and her mother-in-law, Leelamma (Urvashi), are both similar and different. The plot revolves around Anju, who has lost her husband and is pregnant with her lover’s child, and Leelamma, who feels relieved upon hearing the news of the pregnancy, even in the wake of her son’s death, as his lineage will continue. While the female-centered movie does not depict violent retributions, the weight of emotions lingers in the silences and gaps in dialogue. The film opens with the female characters constrained by societal and cultural norms; as the story progresses, they gradually loosen these ties and find solidarity in each other. Nature plays a significant role, a spectator, as the relentless rain and flooded surroundings amplify the characters' psychological distress. The direction, cinematography and narrative style add to the sensitive storyline. It is as if the rainy blues have enveloped the film, awaiting sunlight, as the characters long to breathe freely after the funeral and seek reconciliation.`
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

const defaultArticles = [
  {
    id: 1,
    title: "BRIDGING CINEMATIC NARRATIVES AND LITERARY DEPTHS: FUSIONS IN CONTEMPORARY MYTHOLOGICAL NOVELS CONCERNING AMISH TRIPATHI’S RAM CHANDRA SERIES.",
    author: "Garima Singh",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_26.pdf",
    category: "MYTHOLOGICAL FICTION & CINEMA",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 26-30",
    doi: "10.5281/zenodo.1082326"
  },
  {
    id: 2,
    title: "Retelling the Past: Cinematic Narratives of Oppression and Resistance in Bolivia and Bengal.",
    author: "Ahana Bhandari",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_27.pdf",
    category: "COMPARATIVE CULTURAL STUDIES",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 31-36",
    doi: "10.5281/zenodo.1082327"
  },
  {
    id: 3,
    title: "What Did She Know About Transformation That We Don’t?",
    author: "Lina Mandal",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_28.pdf",
    category: "LITERARY THEORY & CRITICISM",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 37-41",
    doi: "10.5281/zenodo.1082328"
  },
  {
    id: 4,
    title: "Laapataa Ladies: A Cinematic Satire on Gendered Invisibility and Rural Agency.",
    author: "Satyam Kumar",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_30.pdf",
    category: "GENDER STUDIES & FILM",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 42-47",
    doi: "10.5281/zenodo.1082330"
  },
  {
    id: 5,
    title: "Patachitra Tradition and Artist Kalam Pauta: A Theoretical Perspective on Art and Literature.",
    author: "Dr. Rakesh Kaibartya",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_31.pdf",
    category: "ART, FOLK TRADITION & LITERATURE",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 48-54",
    doi: "10.5281/zenodo.1082331"
  },
  {
    id: 6,
    title: "BEYOND THE CHARACTERS: NATURE SHAPES THE STORY IN “ULLOZHUKKU”.",
    author: "Dona Joseph",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_32.pdf",
    category: "ECO-CRITICISM & NARRATIVE",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 55-60",
    doi: "10.5281/zenodo.1082332"
  },
  {
    id: 7,
    title: "How ideology shapes consumption: The case of Oil Palm Industry and Red Meat Production.",
    author: "Souvik Karmakar",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_.33.pdf",
    category: "ENVIRONMENTAL SCIENCES & POLICY",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 61-68",
    doi: "10.5281/zenodo.1082333"
  },
  {
    id: 8,
    title: "FROM ‘LITTLE MAIDEN’ TO ‘THE WITCH’: EXPLORING THE THEMES OF VAMPIRISM, WITCHCRAFT AND THE FEMALE WANDERER THROUGH A BIOGRAPHICAL READING OF MARY COLERIDGE’S “THE WITCH”.",
    author: "Shibangi Ghose",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_34.pdf",
    category: "GOTHIC LITERATURE & GENDER",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 69-75",
    doi: "10.5281/zenodo.1082334"
  },
  {
    id: 9,
    title: "The Word as Weapon: Language, Power, and Black Male Representation in Morrison’s Narratives.",
    author: "Sakshi Virmani",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_37.pdf",
    category: "AFRICAN AMERICAN LITERATURE",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 76-82",
    doi: "10.5281/zenodo.1082337"
  },
  {
    id: 10,
    title: "Between Nations and Narratives: Transnational Engagement and Flexible Citizenship in American Betiya.",
    author: "Kakoli Debnath and Dr. Binda Sah",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_.38.pdf",
    category: "DIASPORA & TRANSNATIONALISM",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 83-90",
    doi: "10.5281/zenodo.1082338"
  }
];

const defaultPreviousIssues = [
  {
    volume: "Volume I Issue I (December, 2023)",
    date: "December, 2023",
    status: "INAUGURAL ISSUE",
    coverImg: "/annousments/img2.png",
    description: "Inaugural volume establishing our multidisciplinary bridge between literary theory and empirical scientific inquiry.",
    link: "/archive"
  },
  {
    volume: "Volume I Issue II (January, 2025)",
    date: "January, 2025",
    status: "ARCHIVED ISSUE",
    coverImg: "/annousments/image copy.png",
    description: "Featuring peer-reviewed scholarship across modern cultural hermeneutics, socio-environmental dynamics, and medical humanities.",
    link: "/archive"
  }
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalPoster, setActiveModalPoster] = useState(null);
  const [activePdfViewer, setActivePdfViewer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live Database States (Pre-populated with authentic journal edition structure)
  const [liveArticles, setLiveArticles] = useState(defaultArticles);
  const [currentIssueInfo, setCurrentIssueInfo] = useState({
    title: "Volume I, Issue III (July, 2025)",
    volume: "Volume I",
    issue: "Issue III",
    date: "July, 2025",
    description: "This edition brings together rigorous cross-disciplinary investigations exploring contemporary mythological literature, cinema, gendered rural agency, folk art traditions, eco-criticism, and transnational identities.",
    coverImg: "/annousments/image2.png",
    articlesCount: 10
  });
  const [previousIssuesList, setPreviousIssuesList] = useState(defaultPreviousIssues);

  // Live Announcements & Popup State
  const [announcements, setAnnouncements] = useState([]);
  const [activeAnnouncementIndex, setActiveAnnouncementIndex] = useState(0);
  const [showAnnouncementPopup, setShowAnnouncementPopup] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Featured Research Paper Showcase Slider State
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);

  // Auto-advance slider every 6.5s unless paused by user interaction
  useEffect(() => {
    if (isSliderPaused) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % featuredSliderPapers.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isSliderPaused]);

  const nextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % featuredSliderPapers.length);
  };

  const prevSlide = () => {
    setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : featuredSliderPapers.length - 1));
  };

  useEffect(() => {
    const fetchLiveHomeData = async () => {
      try {
        const [volRes, annRes] = await Promise.all([
          apiFetch('/volumes?with_articles=true&published_only=true'),
          apiFetch('/announcements?published_only=true')
        ]);

        // Process Volumes & Live Published Articles from Database
        if (volRes && volRes.data && volRes.data.length > 0) {
          const allIssues = [];
          volRes.data.forEach(vol => {
            if (vol.issues && vol.issues.length > 0) {
              vol.issues.forEach(iss => {
                allIssues.push({
                  ...iss,
                  volume_title: vol.volume_title,
                  volume_number: vol.volume_number,
                  publication_year: vol.publication_year,
                  vol_cover_url: vol.cover_url
                });
              });
            }
          });

          // Sort descending by date & issue number so latest published issue (Volume 1 Issue 3) is always index 0
          allIssues.sort((a, b) => {
            const dateA = new Date(a.publication_date || `${a.publication_year}-01-01`).getTime();
            const dateB = new Date(b.publication_date || `${b.publication_year}-01-01`).getTime();
            if (dateB !== dateA) return dateB - dateA;
            return (b.issue_number || 0) - (a.issue_number || 0);
          });

          if (allIssues.length > 0) {
            const latest = allIssues[0];
            const issueDateStr = latest.publication_date 
              ? new Date(latest.publication_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : `${latest.publication_year}`;

            setCurrentIssueInfo({
              title: `${latest.volume_title || `Volume ${latest.volume_number}`}, ${latest.issue_title || `Issue ${latest.issue_number}`} (${issueDateStr})`,
              volume: latest.volume_title || `Volume ${latest.volume_number}`,
              issue: latest.issue_title || `Issue ${latest.issue_number}`,
              date: issueDateStr,
              description: latest.description || "This edition brings together rigorous cross-disciplinary investigations exploring contemporary mythological literature, cinema, gendered rural agency, folk art traditions, eco-criticism, and transnational identities.",
              coverImg: resolveFileUrl(latest.cover_url || latest.vol_cover_url || "/annousments/image2.png"),
              articlesCount: latest.articles?.length || 10
            });

            if (latest.articles && latest.articles.length > 0) {
              setLiveArticles(latest.articles.map((art, idx) => ({
                id: art.article_id,
                title: art.title,
                author: art.author_name || 'Author',
                pdfUrl: resolveFileUrl(art.published_url || art.manuscript_url),
                category: (art.keywords?.split(',')[0] || (art.doi ? `DOI: ${art.doi}` : 'Research Paper')).toUpperCase(),
                pages: art.page_range || `pp. 1-${10 + idx}`,
                volumeLabel: `${latest.volume_title || `Vol ${latest.volume_number}`}, ${latest.issue_title || `Issue ${latest.issue_number}`} (${issueDateStr})`,
                keywords: art.keywords || '',
                doi: art.doi || ''
              })));
            }

            if (allIssues.length > 1) {
              setPreviousIssuesList(allIssues.slice(1).map(iss => {
                const prevDate = iss.publication_date 
                  ? new Date(iss.publication_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  : `${iss.publication_year}`;
                return {
                  volume: `${iss.volume_title || `Volume ${iss.volume_number}`} ${iss.issue_title || `Issue ${iss.issue_number}`} (${prevDate})`,
                  date: prevDate,
                  coverImg: resolveFileUrl(iss.cover_url || iss.vol_cover_url || "/annousments/img2.png"),
                  description: iss.description || `Peer-reviewed volume publication with scholarly research papers.`,
                  status: iss.issue_number === 1 ? "INAUGURAL ISSUE" : "ARCHIVED ISSUE",
                  link: "/archive",
                  issn: "ISSN: 3048-7366"
                };
              }));
            }
          }
        }

        // Process Announcements
        if (annRes && annRes.data && annRes.data.length > 0) {
          setAnnouncements(annRes.data);
          const latestAnn = annRes.data[0];
          
          const dismissedId = sessionStorage.getItem('dismissed_announcement_id');
          if (dismissedId !== String(latestAnn.announcement_id)) {
            setTimeout(() => {
              setShowAnnouncementPopup(true);
            }, 700);
          }
        }
      } catch (err) {
        console.warn('Live home data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveHomeData();
  }, []);

  const handleCloseAnnouncementPopup = () => {
    if (dontShowAgain && announcements[activeAnnouncementIndex]) {
      sessionStorage.setItem('dismissed_announcement_id', String(announcements[activeAnnouncementIndex].announcement_id));
    }
    setShowAnnouncementPopup(false);
  };

  const filteredArticles = liveArticles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.keywords && article.keywords.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-grow flex flex-col bg-[#F9F6F0] text-[#2C2C2C]">
      <SEO
        title="The Literary Scientist | A Multi-Disciplinary Journal for Literature and Science"
        description="The Literary Scientist (ISSN: 3048-7366) is an open-access, peer-reviewed journal publishing innovative multidisciplinary research at the intersection of literary theory and scientific disciplines."
        keywords="The Literary Scientist, academic journal, literature and science, ISSN 3048-7366, peer-reviewed research, multidisciplinary humanities, open access"
        canonical="/"
      />
      
      {/* 1. FULL-WIDTH JAPANDI CINEMATIC FEATURED PAPERS SLIDER (AUTO-SLIDE OPENING) */}
      <AnimatedSection animation="fade-in" duration={600}>
      <section className="w-full bg-[#181B20] text-white border-b border-gray-800 relative z-10 overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8E7C68]/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32"></div>

        <div 
          onMouseEnter={() => setIsSliderPaused(true)}
          onMouseLeave={() => setIsSliderPaused(false)}
          className="w-full relative"
        >
          {/* Main Slide Content Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Visual Artwork / Cover with subtle cinematic gradient blend */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div 
                onClick={() => setActiveModalPoster({
                  src: "/annousments/image2.png",
                  title: "The Literary Scientist — Volume I, Issue III (July 2025)",
                  subtitle: "Official Issue Cover Artwork • ISSN: 3048-7366 (ONLINE)",
                  downloadName: "The_Literary_Scientist_Vol1_Issue3_Cover.png",
                  pdfLink: featuredSliderPapers[activeSlideIndex]?.pdfUrl
                })}
                className="relative group cursor-pointer w-full max-w-[340px] lg:max-w-none h-[280px] sm:h-[320px] md:h-[360px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#12151A] flex items-center justify-center"
              >
                <img
                  src="/annousments/image2.png"
                  alt="The Literary Scientist Issue Cover"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Subtle right-side gradient vignette blending into dark background */}
                <div className="hidden lg:block absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#181B20] to-transparent pointer-events-none"></div>
                {/* Bottom gradient on mobile */}
                <div className="lg:hidden absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#181B20] to-transparent pointer-events-none"></div>
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                  <FaExpandAlt className="text-sm text-white" />
                  <span>Enlarge Cover</span>
                </div>

                <div className="absolute top-3.5 left-3.5 bg-[#181B20]/90 backdrop-blur-sm border border-white/15 text-white text-[11px] font-bold px-3 py-1 rounded shadow">
                  Vol. I Issue III (2025)
                </div>
              </div>
            </div>

            {/* Right Column: Paper Typography & Details matching Screenshot */}
            {(() => {
              const currentPaper = featuredSliderPapers[activeSlideIndex];
              return (
                <div key={activeSlideIndex} className="lg:col-span-7 flex flex-col justify-between space-y-4 animate-fadeIn">
                  
                  {/* Category Pill Tag (Vermilion Red matching Screenshot) */}
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#D32F2F] text-white text-[11px] sm:text-xs font-extrabold uppercase tracking-wider rounded-xs shadow-sm">
                      {currentPaper.category || "PERSPECTIVES"}
                    </span>
                  </div>

                  {/* Main Title */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white font-serif leading-tight tracking-tight">
                    {currentPaper.title}
                  </h2>

                  {/* Author Name */}
                  <div className="text-base sm:text-lg font-bold text-gray-200 font-serif">
                    {currentPaper.author}
                  </div>

                  {/* Abstract Text */}
                  <p className="text-gray-300 text-sm sm:text-base font-serif leading-relaxed line-clamp-5 lg:line-clamp-6">
                    {currentPaper.abstract}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    <a
                      href={currentPaper.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs sm:text-sm font-bold rounded shadow transition-colors"
                    >
                      <FaFilePdf />
                      <span>Read Paper (PDF)</span>
                      <FaExternalLinkAlt className="text-[10px]" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setActivePdfViewer({
                        url: currentPaper.pdfUrl,
                        title: currentPaper.title,
                        author: currentPaper.author,
                        pages: currentPaper.pages,
                        doi: currentPaper.doi
                      })}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#262B34] hover:bg-[#323844] text-white border border-gray-700 text-xs sm:text-sm font-semibold rounded transition-colors"
                    >
                      <FaBookOpen className="text-gray-300" />
                      <span>Quick Preview</span>
                    </button>

                    <span className="text-xs text-gray-400 font-mono ml-auto hidden sm:inline">
                      {currentPaper.pages} • {currentPaper.doi}
                    </span>
                  </div>

                </div>
              );
            })()}

          </div>

          {/* Bottom Center Pagination Bar matching Screenshot */}
          <div className="flex items-center justify-center gap-2.5 py-4 bg-[#14171C] border-t border-gray-800/80">
            {featuredSliderPapers.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlideIndex(idx)}
                className={`h-2.5 transition-all duration-300 rounded-xs ${
                  idx === activeSlideIndex 
                    ? 'w-7 bg-[#D32F2F] shadow-sm shadow-red-500/50' 
                    : 'w-2.5 bg-white/70 hover:bg-white'
                }`}
                title={`Go to slide ${idx + 1}`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>
      </AnimatedSection>

      {/* 2. JOURNAL INTRODUCTION & MISSION HERO SECTION */}
      <AnimatedSection animation="fade-in" duration={800}>
      <section className="bg-gradient-to-b from-white via-[#FAF7F2] to-[#F3EEE5] border-b border-[#E5E0D8] py-16 md:py-20 px-4 relative overflow-hidden">
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

      {/* 3. NOTIFICATIONS & ANNOUNCEMENTS BANNER (LIVE FROM BACKEND) */}
      <AnimatedSection animation="fade-up" delay={100}>
      <section className="max-w-6xl mx-auto px-4 py-6 relative z-20 w-full">
        <div className="bg-white border-2 border-[#8E7C68]/30 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 backdrop-blur-sm relative">
          
          {announcements.length > 0 ? (
            (() => {
              const currentAnn = announcements[activeAnnouncementIndex] || announcements[0];
              const isPdf = currentAnn.doc_url && (currentAnn.doc_url.match(/\.pdf$/i) || currentAnn.mime_type?.includes('pdf'));
              const pubDate = currentAnn.published_at 
                ? new Date(currentAnn.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Recent';

              return (
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="p-4 bg-[#F9F6F0] rounded-2xl text-[#8E7C68] border border-[#E5E0D8] flex-shrink-0 flex items-center justify-center">
                    <FaBullhorn className="w-8 h-8 text-[#1E2530]" />
                  </div>

                  <div className="flex-grow space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-3 py-0.5 rounded-full text-xs tracking-wider uppercase">
                          Latest Announcement
                        </span>
                        <span className="text-xs font-semibold text-[#8E7C68]">
                          Published: {pubDate}
                        </span>
                        {currentAnn.admin_name && (
                          <span className="text-xs text-gray-500">
                            • By {currentAnn.admin_name}
                          </span>
                        )}
                      </div>

                      {/* Pagination if multiple announcements */}
                      {announcements.length > 1 && (
                        <div className="flex items-center gap-1 bg-[#FAF7F2] px-2 py-1 rounded-lg border border-[#E5E0D8]">
                          <button
                            type="button"
                            onClick={() => setActiveAnnouncementIndex((prev) => (prev > 0 ? prev - 1 : announcements.length - 1))}
                            className="text-xs px-2 py-0.5 font-bold hover:bg-[#EAE6DF] rounded"
                            title="Previous Announcement"
                          >
                            ◀
                          </button>
                          <span className="text-xs font-bold text-[#8E7C68] px-1">
                            {activeAnnouncementIndex + 1} / {announcements.length}
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveAnnouncementIndex((prev) => (prev < announcements.length - 1 ? prev + 1 : 0))}
                            className="text-xs px-2 py-0.5 font-bold hover:bg-[#EAE6DF] rounded"
                            title="Next Announcement"
                          >
                            ▶
                          </button>
                        </div>
                      )}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-[#1E2530] font-serif leading-snug">
                      {currentAnn.title}
                    </h2>

                    <div className="text-sm sm:text-base text-[#5C5446] leading-relaxed whitespace-pre-line">
                      {currentAnn.content}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAnnouncementPopup(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E2530] hover:bg-[#2C384A] text-white rounded-lg font-bold text-xs sm:text-sm shadow transition-all"
                      >
                        <FaBullhorn className="text-amber-400" /> View Announcement Details & Popup
                      </button>

                      {currentAnn.doc_url && (
                        <a
                          href={resolveFileUrl(currentAnn.doc_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E2530] border border-[#E5E0D8] rounded-lg text-xs sm:text-sm font-semibold transition-all"
                        >
                          {isPdf ? <FaFilePdf className="text-red-600" /> : <FaExpandAlt className="text-[#8E7C68]" />}
                          <span>{isPdf ? 'Download Attachment (PDF)' : 'View Attachment'}</span>
                          <FaExternalLinkAlt className="text-[10px] opacity-70" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            /* Fallback Default Milestone Banner */
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
                  We’re thrilled to announce that <strong>The Literary Scientist</strong> now proudly holds an <strong>ISSN: 3048-7366 (ONLINE)</strong>, marking a significant milestone in our journey. This achievement underscores our commitment to fostering interdisciplinary scholarship and creativity across literature, science, and beyond.
                </p>

                <p className="text-sm sm:text-base text-[#5C5446] leading-relaxed">
                  With this call for contributions, we invite young minds and seasoned researchers alike to explore groundbreaking topics—from micro literature to digital humanities, cultural studies, and more. Be part of a pioneering publication that bridges disciplines and enriches the landscape of academic thought.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>
      </AnimatedSection>

      {/* 3. CALL FOR CONTRIBUTIONS (EXACT MATCH TO INPUT UI IMAGE 1) */}
      <AnimatedSection animation="fade-up" delay={100}>
      <section className="max-w-6xl mx-auto px-4 py-12 w-full">
        <div className="bg-[#1E2530] text-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl border border-gray-700/60 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#133E32] text-[#25D366] border border-[#1E5D4B] rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                  CALL FOR CONTRIBUTION IS LIVE
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif leading-tight mb-3 text-white">
                  Vol. II Issue I (2025): Call for Contributions
                </h2>

                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-serif">
                  We are pleased to announce the launch of our most recent contribution for our upcoming volume. Our Call for Contribution is already live for your upcoming volume. Take a look and share your thought within the time period.
                </p>
              </div>

              {/* Topics Highlights Box */}
              <div className="bg-[#161D27] border border-white/10 rounded-2xl p-5 sm:p-6">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#D4AF37] mb-3 font-sans">
                  SCOPE OF RESEARCH TOPICS (OPEN FOR SUBMISSIONS):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-300">
                  {callTopics.map((topic, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons matching Image 1 */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="/annousments/Olive-Green-Doodle-Final-Project-Cover-A4-Document.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#8E7C68] hover:bg-[#7D6B57] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  <FaFilePdf className="text-sm" />
                  <span>Document Details (PDF)</span>
                  <FaExternalLinkAlt className="text-[10px] opacity-70" />
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
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#26303F] hover:bg-[#323F52] text-white border border-gray-600 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  <FaExpandAlt className="text-xs" />
                  <span>View Full Poster</span>
                </button>

                <Link
                  to="/start-submission"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#009E60] hover:bg-[#008751] text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-emerald-900/40 transition-all"
                >
                  <span>Submit Paper</span>
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>

            {/* Right Poster Preview Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                onClick={() => setActiveModalPoster({
                  src: "/annousments/image.png",
                  title: "Vol. II Issue I (2025) Call for Contributions",
                  subtitle: "Official Call for Papers Announcement & Submission Details",
                  downloadName: "The_Literary_Scientist_Call_For_Contributions_Vol2_Issue1.png",
                  pdfLink: "/annousments/Olive-Green-Doodle-Final-Project-Cover-A4-Document.pdf"
                })}
                className="relative group cursor-pointer max-w-[320px] sm:max-w-[340px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white transform transition-all duration-300 hover:scale-[1.02] p-2"
              >
                <div className="rounded-2xl overflow-hidden bg-white flex items-center justify-center relative">
                  <img
                    src="/annousments/image.png"
                    alt="The Literary Scientist - Call for Contributions"
                    className="w-full h-auto max-h-[460px] object-contain block"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#1E2530]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold border border-white/20 shadow">
                    Vol. II Issue I (2025)
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* 4. LATEST PUBLISHED ISSUE (EXACT MATCH TO INPUT UI IMAGE 2) */}
      <AnimatedSection animation="fade-up" delay={100}>
      <section id="current-issue" className="max-w-6xl mx-auto px-4 py-8 w-full">
        
        {/* Issue Showcase Header Banner with Cover Art */}
        <div className="bg-white border border-[#EBE6DE] rounded-3xl p-6 sm:p-8 md:p-10 mb-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Issue Cover Art */}
            <div className="md:col-span-4 lg:col-span-3 flex justify-center">
              <div
                onClick={() => setActiveModalPoster({
                  src: currentIssueInfo?.coverImg || "/annousments/image2.png",
                  title: `The Literary Scientist — ${currentIssueInfo?.title || 'Volume I, Issue III (July, 2025)'}`,
                  subtitle: `Official Issue Cover Artwork • ISSN: 3048-7366 (ONLINE)`,
                  downloadName: "The_Literary_Scientist_Current_Cover.png",
                  pdfLink: liveArticles[0]?.pdfUrl || null
                })}
                className="relative group cursor-pointer w-full max-w-[210px] rounded-2xl overflow-hidden shadow-md border border-[#E5E0D8] hover:border-[#8E7C68] transform transition-all duration-300 hover:scale-[1.03] bg-white p-1.5"
              >
                <div className="rounded-xl overflow-hidden bg-white relative">
                  <img
                    src={currentIssueInfo?.coverImg || "/annousments/image2.png"}
                    alt={`${currentIssueInfo?.title || 'Current Issue'} Cover`}
                    className="w-full h-auto max-h-[290px] object-contain block mx-auto"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#1E2530]/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow">
                    Issue Cover
                  </div>
                </div>
              </div>
            </div>

            {/* Issue Details & Metadata */}
            <div className="md:col-span-8 lg:col-span-9 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-[#1E2530] text-white text-[11px] font-bold uppercase tracking-wider rounded-full">
                  LATEST PUBLISHED ISSUE
                </span>
                <span className="px-3 py-1 bg-[#FAF7F2] text-[#8E7C68] border border-[#E5E0D8] text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <FaCalendarAlt className="text-xs" /> {currentIssueInfo?.date || 'July, 2025'}
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <FaCheckCircle className="text-xs text-emerald-600" /> {currentIssueInfo?.articlesCount || liveArticles.length} Articles Published
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2530] font-serif leading-tight">
                {currentIssueInfo?.title || 'Volume I, Issue III (July, 2025)'}
              </h2>

              <p className="text-sm sm:text-base text-[#5C5446] leading-relaxed font-serif">
                {currentIssueInfo?.description || 'This edition brings together rigorous cross-disciplinary investigations exploring contemporary mythological literature, cinema, gendered rural agency, folk art traditions, eco-criticism, and transnational identities.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalPoster({
                    src: currentIssueInfo?.coverImg || "/annousments/image2.png",
                    title: `The Literary Scientist — ${currentIssueInfo?.title || 'Current Issue'}`,
                    subtitle: `Official Issue Cover Artwork • ISSN: 3048-7366 (ONLINE)`,
                    downloadName: "The_Literary_Scientist_Current_Cover.png",
                    pdfLink: liveArticles[0]?.pdfUrl || null
                  })}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E2530] border border-[#E5E0D8] rounded-lg text-xs sm:text-sm font-bold transition-all shadow-xs"
                >
                  <FaQrcode className="text-[#8E7C68]" /> View Cover & QR
                </button>

                <a
                  href="#articles-list"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E2530] hover:bg-[#2C384A] text-white rounded-lg text-xs sm:text-sm font-bold transition-all shadow-sm"
                >
                  <FaBookOpen /> Jump to Articles ({filteredArticles.length})
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Search & Filter Header */}
        <div id="articles-list" className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#8E7C68] font-bold text-xs uppercase tracking-widest mb-1.5">
              <FaBookOpen className="text-xs" /> TABLE OF CONTENTS
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E2530] font-serif">
              Published Research Articles
            </h3>
            <p className="text-[#5C5446] text-xs sm:text-sm mt-1">
              Select any paper below to view full details and download the peer-reviewed PDF manuscript.
            </p>
          </div>

          {/* Quick Search in Current Issue */}
          <div className="w-full md:w-80">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles or authors..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E0D8] rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#8E7C68] focus:ring-1 focus:ring-[#8E7C68] shadow-xs"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
            </div>
          </div>
        </div>

        {/* Articles List Grid (EXACT MATCH TO INPUT UI IMAGE 3) */}
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
                key={article.id || index}
                className="bg-white border border-[#EBE6DE] hover:border-[#8E7C68]/60 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4 flex-grow">
                  {/* Article index pill */}
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] font-bold text-xs flex items-center justify-center font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#FAF7F2] text-[#8E7C68] border border-[#EFE9DF]">
                        {article.category}
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {article.volumeLabel || currentIssueInfo?.title || "Vol I, Issue III (July 2025)"}
                      </span>
                    </div>

                    <h3 
                      onClick={() => article.pdfUrl && setActivePdfViewer({
                        url: article.pdfUrl,
                        title: article.title,
                        author: article.author,
                        category: article.category,
                        pages: article.pages,
                        doi: article.doi
                      })}
                      className={`text-base sm:text-lg font-bold text-[#1E2530] leading-snug font-serif ${article.pdfUrl ? 'cursor-pointer hover:text-[#8E7C68]' : ''} transition-colors`}
                    >
                      {article.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-[#5C5446]">
                      <span className="font-semibold flex items-center gap-1.5 text-[#2C2C2C]">
                        <FaUserEdit className="text-[#8E7C68]" /> {article.author}
                      </span>
                      {article.pages && (
                        <span className="text-xs text-gray-400 font-mono">
                          • {article.pages}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Download PDF Button matching Image 3 */}
                <div className="flex-shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#F0EBE1] flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setActivePdfViewer({
                      url: article.pdfUrl,
                      title: article.title,
                      author: article.author,
                      category: article.category,
                      pages: article.pages,
                      doi: article.doi
                    })}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E2530] border border-[#E5E0D8] rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    <FaFilePdf className="text-red-600 text-sm" />
                    <span>Download PDF</span>
                    <FaExternalLinkAlt className="text-[9px] opacity-60 text-gray-500" />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
      </AnimatedSection>

      {/* 5. PREVIOUS ISSUES SECTION (EXACT MATCH TO INPUT UI IMAGE 4) */}
      <AnimatedSection animation="fade-up" delay={100}>
      <section className="bg-[#FAF7F2]/40 border-y border-[#E5E0D8] py-16 px-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-10 max-w-5xl mx-auto">
            {previousIssuesList.map((issue, idx) => (
              <div
                key={idx}
                className="bg-[#FAF7F2] border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header Info */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-3 py-1 bg-white border border-[#E5E0D8] text-[#8E7C68] rounded-full text-xs font-bold tracking-wider uppercase shadow-xs">
                      {issue.status}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <FaCalendarAlt className="text-[#8E7C68] text-xs" /> {issue.date}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#1E2530] font-serif tracking-tight mb-6">
                    {issue.volume}
                  </h3>
                </div>

                {/* Centered Journal Cover */}
                <div className="my-2 flex justify-center">
                  <div
                    onClick={() => setActiveModalPoster({
                      src: issue.coverImg,
                      title: `The Literary Scientist — ${issue.volume}`,
                      subtitle: `${issue.status} • Published: ${issue.date}`,
                      downloadName: `The_Literary_Scientist_${issue.volume.replace(/[^a-zA-Z0-9]/g, '_')}_Cover.png`,
                      pdfLink: null
                    })}
                    className="relative cursor-pointer w-full max-w-[240px] rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-white transform hover:scale-[1.03] transition-all duration-300 p-1"
                  >
                    <div className="rounded-xl overflow-hidden bg-white flex items-center justify-center">
                      <img
                        src={issue.coverImg}
                        alt={`${issue.volume} Cover`}
                        className="w-full h-auto max-h-[320px] object-contain block mx-auto"
                        loading="lazy"
                      />
                    </div>
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

      {/* 8. IN-BROWSER PEER-REVIEWED PDF READER MODAL */}
      {activePdfViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-fadeIn">
          <div className="bg-[#1E2530] border border-gray-700 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Reader Header */}
            <div className="bg-[#161B22] px-4 py-3 border-b border-gray-700 flex justify-between items-center text-white">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                    Peer-Reviewed Publication
                  </span>
                  {activePdfViewer.pages && (
                    <span className="text-xs text-gray-400 font-mono">Pages: {activePdfViewer.pages}</span>
                  )}
                  {activePdfViewer.doi && (
                    <span className="text-xs text-[#D4AF37] font-mono hidden sm:inline">{activePdfViewer.doi}</span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-gray-100 truncate max-w-2xl font-serif">
                  {activePdfViewer.title}
                </h4>
                <p className="text-xs text-gray-400">By {activePdfViewer.author}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setActivePdfViewer(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Close PDF Viewer"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded Stream Viewer */}
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

      {/* 9. ANNOUNCEMENT POPUP MODAL (AUTO-OPEN ON LOAD & ON-DEMAND CLICK) */}
      {showAnnouncementPopup && announcements.length > 0 && (() => {
        const popupAnn = announcements[activeAnnouncementIndex] || announcements[0];
        const isPdf = popupAnn.doc_url && (popupAnn.doc_url.match(/\.pdf$/i) || popupAnn.mime_type?.includes('pdf'));
        const isImg = popupAnn.doc_url && (popupAnn.doc_url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) || popupAnn.mime_type?.includes('image'));
        const pubDate = popupAnn.published_at 
          ? new Date(popupAnn.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : 'Official Journal Notification';

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#FAF9F6] border-2 border-[#8E7C68] rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
              
              {/* Popup Header */}
              <div className="bg-gradient-to-r from-[#1E2530] to-[#2C384A] text-white p-5 flex justify-between items-center border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
                    <FaBullhorn className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold">
                      Important Journal Announcement
                    </span>
                    <p className="text-xs text-gray-300">{pubDate}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseAnnouncementPopup}
                  className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close Announcement Popup"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Popup Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-5 flex-1">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2530] leading-tight">
                  {popupAnn.title}
                </h3>

                {/* Attached Image Preview if available */}
                {isImg && (
                  <div className="rounded-2xl overflow-hidden border border-[#E5E0D8] bg-white shadow-sm max-h-[280px] flex items-center justify-center">
                    <img
                      src={resolveFileUrl(popupAnn.doc_url)}
                      alt={popupAnn.title}
                      className="w-full h-auto max-h-[280px] object-contain"
                    />
                  </div>
                )}

                {/* Announcement Content */}
                <div className="text-sm sm:text-base text-[#4A443D] leading-relaxed font-serif whitespace-pre-line bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-xs">
                  {popupAnn.content}
                </div>

                {/* Attached Document Notice */}
                {isPdf && (
                  <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 flex items-center gap-3">
                    <FaFilePdf className="text-red-600 text-lg flex-shrink-0" />
                    <span className="text-xs font-bold text-amber-950">Official Document Record Verified on File</span>
                  </div>
                )}
              </div>

              {/* Popup Footer */}
              <div className="bg-white p-4 sm:p-5 border-t border-[#E5E0D8] flex flex-col sm:flex-row justify-between items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#7A736B] select-none">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="rounded text-[#8E7C68] focus:ring-[#8E7C68] border-gray-300"
                  />
                  <span>Don't show this announcement again today</span>
                </label>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {popupAnn.doc_url && (
                    <a
                      href={resolveFileUrl(popupAnn.doc_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E2530] border border-[#E5E0D8] rounded-xl text-xs sm:text-sm font-bold transition-all w-full sm:w-auto"
                    >
                      <FaFilePdf className="text-red-600" /> View Document <FaExternalLinkAlt className="text-[10px]" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleCloseAnnouncementPopup}
                    className="px-5 py-2.5 bg-[#1E2530] hover:bg-[#2C384A] text-white rounded-xl text-xs sm:text-sm font-bold transition-all w-full sm:w-auto shadow-sm"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default Home;
