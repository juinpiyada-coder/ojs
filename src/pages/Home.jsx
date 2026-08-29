import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import SEO from '../components/SEO';
import { apiFetch, resolveFileUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';
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
  FaQrcode,
  FaLayerGroup,
  FaPlay,
  FaPause,
  FaLock,
  FaSignInAlt,
  FaUserPlus
} from 'react-icons/fa';

const featuredSliderPapers = [
  {
    id: 1,
    title: "Bridging Cinematic Narratives and Literary Depths: Fusions in Contemporary Mythological Novels Concerning Amish Tripathi’s Ram Chandra Series",
    author: "Garima Singh",
    category: "MYTHOLOGICAL FICTION & CINEMA",
    volume: "Vol I, Issue III (July 2025)",
    pages: "pp. 26-30",
    doi: "10.5281/zenodo.1082326",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_26.pdf",
    coverImg: "/annousments/image2.png",
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
    coverImg: "/annousments/image2.png",
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
    coverImg: "/annousments/image2.png",
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
    coverImg: "/annousments/image2.png",
    abstract: `Kiran Rao’s Laapataa Ladies (2023) is a poignant and satirical exploration of women’s invisibility within the patriarchal fabric of rural India. Set against the backdrop of the early 2000s, the film opens with the accidental switching of two newlywed brides during a train journey—a mix-up that soon unravels into a nuanced commentary on gender, identity, and the oppressive social norms that dictate women's lives. While the plot appears light-hearted on the surface, it subtly challenges the audience to question the deep-rooted structures that normalize the marginalization of women, particularly in rural settings. This review positions Laapataa Ladies within the broader framework of feminist film discourse, examining how the film subverts conventional Bollywood tropes to foreground female subjectivity. Rao’s narrative resists the typical resolution-driven structure and instead prioritizes the internal journeys of the two protagonists as they navigate unexpected freedom, societal expectations, and self-discovery. The film’s portrayal of agency is refreshingly understated; rather than overt rebellion, the characters express resistance through small, meaningful acts that challenge the roles imposed upon them. Furthermore, the review engages with the film’s use of rural sociolinguistic textures, where dialect, humor, and silence serve as powerful tools of characterization and critique. Through authentic dialogues and situational irony, Laapataa Ladies crafts a world that is both specific and universally resonant. In doing so, Kiran Rao offers not just a story of misplaced brides, but a layered reflection on how women often find themselves lost within societal frameworks—and how they might begin to reclaim that space.`
  },
  {
    id: 5,
    title: "Patachitra Tradition and Artist Kalam Pauta: A Theoretical Perspective on Art and Literature",
    author: "Dr. Rakesh Kaibartya",
    category: "ART, FOLK TRADITION & LITERATURE",
    volume: "Vol I, Issue III (July 2025)",
    pages: "pp. 48-54",
    doi: "10.5281/zenodo.1082331",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_31.pdf",
    coverImg: "/annousments/image2.png",
    abstract: `This paper explores the traditional Patachitra artistic motifs and their theoretical resonance in contemporary literary narratives, examining the intersection of indigenous art forms, folk oral storytelling, and evolving visual culture.`
  },
  {
    id: 6,
    title: "Beyond the Characters: Nature Shapes the Story in “Ullozhukku”",
    author: "Dona Joseph",
    category: "ECO-CRITICISM & NARRATIVE",
    volume: "Vol I, Issue III (July 2025)",
    pages: "pp. 55-60",
    doi: "10.5281/zenodo.1082332",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_32.pdf",
    coverImg: "/annousments/image2.png",
    abstract: `“Ullozhukku” (Under Current) is a 2024 Malayalam language drama film from India featuring female protagonists who represent two generations and the clash of their ideologies, experiences, and agency. It challenges the conventional positioning of women, motherhood, and the commodification of women. The dilemmas faced by the female protagonists, Anju (Parvathy Thiruvothu) and her mother-in-law, Leelamma (Urvashi), are both similar and different. Nature plays a significant role, a spectator, as the relentless rain and flooded surroundings amplify the characters' psychological distress.`
  },
  {
    id: 7,
    title: "How Ideology Shapes Consumption: The Case of Oil Palm Industry and Red Meat Production",
    author: "Souvik Karmakar",
    category: "ENVIRONMENTAL SCIENCES & POLICY",
    volume: "Vol I, Issue III (July 2025)",
    pages: "pp. 61-68",
    doi: "10.5281/zenodo.1082333",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_.33.pdf",
    coverImg: "/annousments/image2.png",
    abstract: `An examination of ideological apparatuses directing agro-industrial consumption paradigms, environmental sustainability, and ecological fallout in contemporary commodity systems.`
  },
  {
    id: 8,
    title: "From ‘Little Maiden’ to ‘The Witch’: Exploring the Themes of Vampirism, Witchcraft and the Female Wanderer Through a Biographical Reading of Mary Coleridge’s “The Witch”",
    author: "Shibangi Ghose",
    category: "GOTHIC LITERATURE & GENDER",
    volume: "Vol I, Issue III (July 2025)",
    pages: "pp. 69-75",
    doi: "10.5281/zenodo.1082334",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_34.pdf",
    coverImg: "/annousments/image2.png",
    abstract: `Investigating gothic tropes, nocturnal anxiety, female wanderers, and biographical underpinnings in Mary Coleridge's Victorian poetry through feminist and psychoanalytic lenses.`
  },
  {
    id: 9,
    title: "The Word as Weapon: Language, Power, and Black Male Representation in Morrison’s Narratives",
    author: "Sakshi Virmani",
    category: "AFRICAN AMERICAN LITERATURE",
    volume: "Vol I, Issue III (July 2025)",
    pages: "pp. 76-82",
    doi: "10.5281/zenodo.1082337",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_37.pdf",
    coverImg: "/annousments/image2.png",
    abstract: `Analyzing the linguistic power structures, historical memory, and racialized masculine identities across Toni Morrison's seminal literary texts.`
  },
  {
    id: 10,
    title: "Between Nations and Narratives: Transnational Engagement and Flexible Citizenship in American Betiya",
    author: "Kakoli Debnath and Dr. Binda Sah",
    category: "DIASPORA & TRANSNATIONALISM",
    volume: "Vol I, Issue III (July 2025)",
    pages: "pp. 83-90",
    doi: "10.5281/zenodo.1082338",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_.38.pdf",
    coverImg: "/annousments/image2.png",
    abstract: `Diasporic negotiations of identity, cultural hybridity, and parental expectations in young adult transnational literature, exploring the complex contours of flexible citizenship.`
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
    title: "Bridging Cinematic Narratives and Literary Depths: Fusions in Contemporary Mythological Novels Concerning Amish Tripathi’s Ram Chandra Series",
    author: "Garima Singh",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_26.pdf",
    category: "MYTHOLOGICAL FICTION & CINEMA",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 26-30",
    doi: "10.5281/zenodo.1082326"
  },
  {
    id: 2,
    title: "Retelling the Past: Cinematic Narratives of Oppression and Resistance in Bolivia and Bengal",
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
    title: "Laapataa Ladies: A Cinematic Satire on Gendered Invisibility and Rural Agency",
    author: "Satyam Kumar",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_30.pdf",
    category: "GENDER STUDIES & FILM",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 42-47",
    doi: "10.5281/zenodo.1082330"
  },
  {
    id: 5,
    title: "Patachitra Tradition and Artist Kalam Pauta: A Theoretical Perspective on Art and Literature",
    author: "Dr. Rakesh Kaibartya",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_31.pdf",
    category: "ART, FOLK TRADITION & LITERATURE",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 48-54",
    doi: "10.5281/zenodo.1082331"
  },
  {
    id: 6,
    title: "Beyond the Characters: Nature Shapes the Story in “Ullozhukku”",
    author: "Dona Joseph",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_32.pdf",
    category: "ECO-CRITICISM & NARRATIVE",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 55-60",
    doi: "10.5281/zenodo.1082332"
  },
  {
    id: 7,
    title: "How Ideology Shapes Consumption: The Case of Oil Palm Industry and Red Meat Production",
    author: "Souvik Karmakar",
    pdfUrl: "https://theliteraryscientist.org/wp-content/uploads/2025/07/TLS20250103_.33.pdf",
    category: "ENVIRONMENTAL SCIENCES & POLICY",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 61-68",
    doi: "10.5281/zenodo.1082333"
  },
  {
    id: 8,
    title: "From ‘Little Maiden’ to ‘The Witch’: Exploring the Themes of Vampirism, Witchcraft and the Female Wanderer Through a Biographical Reading of Mary Coleridge’s “The Witch”",
    author: "Shibangi Ghose",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_34.pdf",
    category: "GOTHIC LITERATURE & GENDER",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 69-75",
    doi: "10.5281/zenodo.1082334"
  },
  {
    id: 9,
    title: "The Word as Weapon: Language, Power, and Black Male Representation in Morrison’s Narratives",
    author: "Sakshi Virmani",
    pdfUrl: "https://image.theliteraryscientist.org/pdf/TLS20250103_37.pdf",
    category: "AFRICAN AMERICAN LITERATURE",
    volumeLabel: "Vol I, Issue III (July 2025)",
    pages: "pp. 76-82",
    doi: "10.5281/zenodo.1082337"
  },
  {
    id: 10,
    title: "Between Nations and Narratives: Transnational Engagement and Flexible Citizenship in American Betiya",
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

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalPoster, setActiveModalPoster] = useState(null);
  const [activePdfViewer, setActivePdfViewer] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingPdfItem, setPendingPdfItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Protected PDF Access Handler: Blocks unauthenticated users from opening/saving PDFs
  const handleOpenPdf = (pdfPayload) => {
    if (!isAuthenticated) {
      setPendingPdfItem(pdfPayload);
      setShowLoginPrompt(true);
      return;
    }
    setActivePdfViewer(pdfPayload);
  };

  const handleDirectPdfLink = (e, url) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setPendingPdfItem({ url });
      setShowLoginPrompt(true);
    }
  };

  // Live Database States
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
  const [slideDirection, setSlideDirection] = useState('right');
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const sliderRef = useRef(null);

  const SLIDE_DURATION = 6500; // 6.5s per slide

  const nextSlide = useCallback(() => {
    setSlideDirection('right');
    setActiveSlideIndex((prev) => (prev + 1) % featuredSliderPapers.length);
  }, []);

  const prevSlide = useCallback(() => {
    setSlideDirection('left');
    setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : featuredSliderPapers.length - 1));
  }, []);

  const goToSlide = (idx) => {
    if (idx === activeSlideIndex) return;
    setSlideDirection(idx > activeSlideIndex ? 'right' : 'left');
    setActiveSlideIndex(idx);
  };

  // Auto-advance slider
  useEffect(() => {
    if (isSliderPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isSliderPaused, nextSlide]);

  // Keyboard navigation for slider
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeModalPoster || activePdfViewer || showAnnouncementPopup) return;
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        setActiveModalPoster(null);
        setActivePdfViewer(null);
        setShowAnnouncementPopup(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, activeModalPoster, activePdfViewer, showAnnouncementPopup]);

  const handleTouchStart = (e) => {
    setIsSliderPaused(true);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsSliderPaused(false);
    if (touchStartX !== null && touchEndX !== null) {
      const distance = touchStartX - touchEndX;
      const minSwipeDistance = 40;
      if (distance > minSwipeDistance) {
        nextSlide();
      } else if (distance < -minSwipeDistance) {
        prevSlide();
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  useEffect(() => {
    const fetchLiveHomeData = async () => {
      try {
        const annRes = await apiFetch('/announcements?published_only=true');

        // Process Announcements only
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
        console.warn('Live announcements fetch error:', err);
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

  const currentPaper = featuredSliderPapers[activeSlideIndex];

  return (
    <div className="flex-grow flex flex-col bg-[#F9F6F0] text-[#2C2C2C]">
      <SEO
        title="The Literary Scientist | A Multi-Disciplinary Journal for Literature and Science"
        description="The Literary Scientist (ISSN: 3048-7366) is an open-access, peer-reviewed journal publishing innovative multidisciplinary research at the intersection of literary theory and scientific disciplines."
        keywords="The Literary Scientist, academic journal, literature and science, ISSN 3048-7366, peer-reviewed research, multidisciplinary humanities, open access"
        canonical="/"
      />
      
      {/* 1. CINEMATIC FEATURED RESEARCH PAPERS SLIDER */}
      <section 
        ref={sliderRef}
        aria-label="Featured Research Papers"
        className="w-full bg-[#16191E] text-white border-b border-gray-800/80 relative z-10 overflow-hidden select-none"
        onMouseEnter={() => setIsSliderPaused(true)}
        onMouseLeave={() => setIsSliderPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Subtle Ambient Lighting & Accents */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#8E7C68]/15 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32"></div>

        {/* Top Progress Bar for Autoplay Timer */}
        <div className="w-full h-1 bg-white/10 relative overflow-hidden">
          <div 
            key={`${activeSlideIndex}-${isSliderPaused}`}
            className="h-full bg-gradient-to-r from-[#D32F2F] to-[#D4AF37]"
            style={{
              width: '100%',
              animation: isSliderPaused ? 'none' : `progressFill ${SLIDE_DURATION}ms linear forwards`
            }}
          />
        </div>

        {/* Main Slide Content Grid */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 py-6 sm:py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center relative z-10 min-h-[380px] lg:min-h-[410px]">
          
          {/* Left Column: Visual Cover Card */}
          <div className="lg:col-span-4 xl:col-span-4 relative flex items-center justify-center">
            <div 
              onClick={() => setActiveModalPoster({
                src: currentPaper.coverImg || "/annousments/image2.png",
                title: `The Literary Scientist — ${currentPaper.volume}`,
                subtitle: `Cover Artwork • Featured: ${currentPaper.author}`,
                downloadName: `The_Literary_Scientist_Paper_${currentPaper.id}_Cover.png`,
                pdfLink: currentPaper.pdfUrl
              })}
              className="relative group cursor-pointer w-full max-w-[220px] sm:max-w-[240px] lg:max-w-[260px] h-[230px] sm:h-[260px] lg:h-[290px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/15 bg-[#12151A] flex items-center justify-center transform transition-transform duration-300 hover:scale-[1.02]"
            >
              <img
                src={currentPaper.coverImg || "/annousments/image2.png"}
                alt={`Cover for ${currentPaper.title}`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="eager"
              />
              {/* Subtle vignette gradients */}
              <div className="hidden lg:block absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#16191E] to-transparent pointer-events-none"></div>
              <div className="lg:hidden absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#16191E] to-transparent pointer-events-none"></div>
              
              {/* Enlarge Hover Overlay */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2 backdrop-blur-[2px]">
                <FaExpandAlt className="text-sm text-[#D4AF37]" />
                <span>Enlarge Cover</span>
              </div>

              {/* Volume Badge */}
              <div className="absolute top-3 left-3 bg-[#1E2530]/90 backdrop-blur-sm border border-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-md flex items-center gap-1.5">
                <FaAward className="text-[#D4AF37] text-[10px]" />
                <span>{currentPaper.volume}</span>
              </div>

              {/* Pages Pill */}
              <div className="absolute bottom-3 left-3 bg-[#12151A]/80 backdrop-blur-sm border border-white/10 text-gray-300 text-[10px] font-mono px-2 py-0.5 rounded">
                {currentPaper.pages}
              </div>
            </div>
          </div>

          {/* Right Column: Paper Typography & Detailed Actions */}
          <div 
            key={activeSlideIndex}
            className={`lg:col-span-8 xl:col-span-8 flex flex-col justify-between space-y-2.5 sm:space-y-3 ${
              slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
            }`}
          >
            {/* Category Tag & Slide Counter */}
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#D32F2F] text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider rounded-md shadow-sm">
                <span>{currentPaper.category}</span>
              </span>
              
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                <span className="text-[#D4AF37] font-bold">{String(activeSlideIndex + 1).padStart(2, '0')}</span>
                <span>/</span>
                <span>{String(featuredSliderPapers.length).padStart(2, '0')}</span>
              </div>
            </div>

            {/* Main Paper Title (Optimized Size, Line Clamping & Clickable Hyperlink) */}
            <h2 
              onClick={() => currentPaper.pdfUrl && handleOpenPdf({
                url: currentPaper.pdfUrl,
                title: formatTitle(currentPaper.title),
                author: currentPaper.author,
                pages: currentPaper.pages,
                doi: currentPaper.doi,
                category: currentPaper.category
              })}
              className={`text-lg sm:text-xl md:text-2xl lg:text-[1.6rem] font-bold text-white font-serif leading-snug tracking-tight line-clamp-2 md:line-clamp-3 transition-colors ${
                currentPaper.pdfUrl ? 'cursor-pointer hover:text-[#D4AF37] hover:underline underline-offset-4 decoration-[#D4AF37]/60' : ''
              }`}
              title={currentPaper.pdfUrl ? (isAuthenticated ? "Click to read full PDF paper" : "Sign in required to read PDF paper") : currentPaper.title}
            >
              {formatTitle(currentPaper.title)}
            </h2>

            {/* Author Attribution */}
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-200 font-serif">
              <span className="text-[#D4AF37]">By</span>
              <span>{currentPaper.author}</span>
            </div>

            {/* Abstract Text */}
            <p className="text-gray-300 text-xs sm:text-sm font-serif leading-relaxed line-clamp-3 sm:line-clamp-4">
              {currentPaper.abstract}
            </p>

            {/* Action Buttons & Metadata */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleOpenPdf({
                  url: currentPaper.pdfUrl,
                  title: formatTitle(currentPaper.title),
                  author: currentPaper.author,
                  pages: currentPaper.pages,
                  doi: currentPaper.doi,
                  category: currentPaper.category
                })}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#242933] hover:bg-[#2F3643] text-white border border-gray-700 hover:border-gray-500 text-xs sm:text-sm font-semibold rounded-lg transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                {isAuthenticated ? (
                  <FaBookOpen className="text-gray-300 text-sm" />
                ) : (
                  <FaLock className="text-amber-400 text-xs" />
                )}
                <span>Quick Preview</span>
              </button>

              {currentPaper.pdfUrl && (
                <a
                  href={currentPaper.pdfUrl}
                  onClick={(e) => handleDirectPdfLink(e, currentPaper.pdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs sm:text-sm font-semibold rounded-lg transition-all active:scale-95 cursor-pointer shadow-sm"
                  title={isAuthenticated ? "Open PDF in new tab" : "Sign in required to open PDF"}
                >
                  <FaFilePdf className="text-red-400 text-sm" />
                  <span>Open PDF</span>
                  {!isAuthenticated ? (
                    <FaLock className="text-[10px] text-amber-400 ml-0.5" />
                  ) : (
                    <FaExternalLinkAlt className="text-[10px] opacity-70" />
                  )}
                </a>
              )}

              <span className="text-xs text-gray-400 font-mono ml-auto hidden md:inline">
                DOI: {currentPaper.doi}
              </span>
            </div>

          </div>

        </div>

        {/* Bottom Pagination Indicators (Pure Automatic Auto-Play Slider) */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 px-4 sm:px-8 py-3 bg-[#111317] border-t border-gray-800">
          {/* Pagination Pill Indicators */}
          <div className="flex items-center gap-2 sm:gap-3">
            {featuredSliderPapers.map((paper, idx) => (
              <button
                key={paper.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className="p-1.5 flex items-center justify-center cursor-pointer transition-all duration-300 group"
                title={`Paper ${idx + 1}: ${paper.title.substring(0, 40)}...`}
                aria-label={`Slide ${idx + 1}`}
              >
                <span 
                  className={`block h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeSlideIndex 
                      ? 'w-8 sm:w-10 bg-[#D32F2F] shadow-sm shadow-red-500/50' 
                      : 'w-2 sm:w-2.5 bg-white/40 group-hover:bg-white/80'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

      </section>

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
          <p className="text-xl sm:text-2xl md:text-3xl text-[#8E7C68] font-serif italic max-w-4xl mx-auto mb-6 font-medium">
            A Multi-Disciplinary Journal for Literature and Science
          </p>

          <div className="w-24 h-1 bg-[#8E7C68] mx-auto rounded-full mb-8"></div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={400}>
          {/* Tagline / Brief Mission */}
          <p className="text-base sm:text-lg text-[#5C5446] max-w-3xl mx-auto leading-relaxed mb-10 font-serif">
            Dedicated to fostering cross-disciplinary scholarship, bridging empirical scientific inquiry and creative literary exploration. Published thrice a year online since 2023 with an upcoming print edition.
          </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={500}>
          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            <a
              href="#current-issue"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1E2530] text-white rounded-xl font-bold text-sm sm:text-base shadow-md hover:bg-[#2C384A] hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <FaBookOpen /> Browse Current Issue
            </a>
            <a
              href="/annousments/Olive-Green-Doodle-Final-Project-Cover-A4-Document.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#8E7C68] text-white rounded-xl font-bold text-sm sm:text-base shadow-md hover:bg-[#7D6B57] hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <FaFilePdf /> Call For Contributions (PDF)
            </a>
            <Link
              to="/start-submission"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border-2 border-[#8E7C68] text-[#1E2530] rounded-xl font-bold text-sm sm:text-base shadow-sm hover:bg-[#FAF7F2] hover:shadow hover:-translate-y-0.5 transition-all"
            >
              <FaUserEdit className="text-[#8E7C68]" /> Submit Manuscript
            </Link>
            <a
              href="/Review-Policy-TLS.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#EFE9DF] text-[#5C5446] rounded-xl font-semibold text-sm sm:text-base hover:bg-[#E5DDCF] hover:text-[#2C2C2C] transition-all"
            >
              <FaShieldAlt className="text-[#8E7C68]" /> Review Policy <FaExternalLinkAlt className="text-xs opacity-70" />
            </a>
          </div>
          </AnimatedSection>
        </div>
      </section>
      </AnimatedSection>

      {/* 3. NOTIFICATIONS & ANNOUNCEMENTS BANNER */}
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
                            className="text-xs px-2 py-0.5 font-bold hover:bg-[#EAE6DF] rounded cursor-pointer"
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
                            className="text-xs px-2 py-0.5 font-bold hover:bg-[#EAE6DF] rounded cursor-pointer"
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

                    <div className="text-sm sm:text-base text-[#5C5446] leading-relaxed whitespace-pre-line font-serif">
                      {currentAnn.content}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAnnouncementPopup(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E2530] hover:bg-[#2C384A] text-white rounded-xl font-bold text-xs sm:text-sm shadow transition-all cursor-pointer"
                      >
                        <FaBullhorn className="text-amber-400" /> View Announcement Details
                      </button>

                      {currentAnn.doc_url && (
                        <a
                          href={resolveFileUrl(currentAnn.doc_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E2530] border border-[#E5E0D8] rounded-xl text-xs sm:text-sm font-semibold transition-all"
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

                <p className="text-sm sm:text-base text-[#5C5446] leading-relaxed mb-4 font-serif">
                  We’re thrilled to announce that <strong>The Literary Scientist</strong> now proudly holds an <strong>ISSN: 3048-7366 (ONLINE)</strong>, marking a significant milestone in our journey. This achievement underscores our commitment to fostering interdisciplinary scholarship and creativity across literature, science, and beyond.
                </p>

                <p className="text-sm sm:text-base text-[#5C5446] leading-relaxed font-serif">
                  With this call for contributions, we invite young minds and seasoned researchers alike to explore groundbreaking topics—from micro literature to digital humanities, cultural studies, and more. Be part of a pioneering publication that bridges disciplines and enriches the landscape of academic thought.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>
      </AnimatedSection>

      {/* 4. CALL FOR CONTRIBUTIONS */}
      <AnimatedSection animation="fade-up" delay={100}>
      <section className="max-w-6xl mx-auto px-4 py-10 w-full">
        <div className="bg-[#1E2530] text-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl border border-gray-700/60 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#133E32] text-[#25D366] border border-[#1E5D4B] rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                  CALL FOR CONTRIBUTION IS LIVE
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif leading-tight mb-3 text-white">
                  Vol. II Issue I (2025): Call for Contributions
                </h2>

                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-serif">
                  We are pleased to announce the launch of our most recent contribution for our upcoming volume. Our Call for Contribution is already live for our upcoming volume. Take a look and share your thoughts within the submission period.
                </p>
              </div>

              {/* Topics Highlights Box */}
              <div className="bg-[#161D27] border border-white/10 rounded-2xl p-5 sm:p-6">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#D4AF37] mb-3 font-sans">
                  SCOPE OF RESEARCH TOPICS (OPEN FOR SUBMISSIONS):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-300 font-serif">
                  {callTopics.map((topic, i) => (
                    <div key={i} className="flex items-start gap-2">
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
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#8E7C68] hover:bg-[#7D6B57] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
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
                    pdfLink: "/annousments/Olive-Green-Doodle-Final-Project-Cover-A4-Document.pdf",
                    isCallForContribution: true
                  })}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#26303F] hover:bg-[#323F52] text-white border border-gray-600 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <FaExpandAlt className="text-xs" />
                  <span>View Full Poster</span>
                </button>

                <Link
                  to="/start-submission"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#009E60] hover:bg-[#008751] text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-emerald-900/40 transition-all cursor-pointer"
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
                  pdfLink: "/annousments/Olive-Green-Doodle-Final-Project-Cover-A4-Document.pdf",
                  isCallForContribution: true
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

      {/* 5. LATEST PUBLISHED ISSUE & TABLE OF CONTENTS */}
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E2530] border border-[#E5E0D8] rounded-lg text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
                >
                  <FaQrcode className="text-[#8E7C68]" /> View Cover & Details
                </button>

                <a
                  href="#articles-list"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E2530] hover:bg-[#2C384A] text-white rounded-lg text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
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
            <p className="text-[#5C5446] text-xs sm:text-sm mt-1 font-serif">
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
                placeholder="Search articles, authors, DOI..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E0D8] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#8E7C68] focus:ring-1 focus:ring-[#8E7C68] shadow-xs"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
            </div>
          </div>
        </div>

        {/* Articles List Grid */}
        <div className="space-y-4 mb-10">
          {filteredArticles.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl text-center border border-[#E5E0D8] text-[#5C5446]">
              <p className="font-semibold text-lg">No articles found matching "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-3 text-sm text-[#8E7C68] underline hover:text-[#2C2C2C] cursor-pointer"
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
                      onClick={() => article.pdfUrl && handleOpenPdf({
                        url: article.pdfUrl,
                        title: formatTitle(article.title),
                        author: article.author,
                        category: article.category,
                        pages: article.pages,
                        doi: article.doi
                      })}
                      className={`text-base sm:text-lg font-bold text-[#1E2530] leading-snug font-serif ${article.pdfUrl ? 'cursor-pointer hover:text-[#8E7C68]' : ''} transition-colors`}
                      title={article.pdfUrl ? (isAuthenticated ? "Click to read full PDF paper" : "Sign in required to read article") : article.title}
                    >
                      {formatTitle(article.title)}
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
                      {article.doi && (
                        <span className="text-xs text-[#8E7C68] font-mono hidden sm:inline">
                          • DOI: {article.doi}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Read Article & PDF Actions */}
                <div className="flex-shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#F0EBE1] flex items-center gap-2 justify-end">
                  {article.pdfUrl && (
                    <a
                      href={article.pdfUrl}
                      onClick={(e) => handleDirectPdfLink(e, article.pdfUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                      title={isAuthenticated ? "Open PDF in new tab" : "Sign in required to open PDF"}
                    >
                      <FaFilePdf className="text-red-600 text-xs" />
                      <span>PDF</span>
                      {!isAuthenticated ? (
                        <FaLock className="text-[9px] text-amber-500" />
                      ) : (
                        <FaExternalLinkAlt className="text-[9px] opacity-70" />
                      )}
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenPdf({
                      url: article.pdfUrl,
                      title: formatTitle(article.title),
                      author: article.author,
                      category: article.category,
                      pages: article.pages,
                      doi: article.doi
                    })}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E2530] border border-[#E5E0D8] rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    {isAuthenticated ? (
                      <FaBookOpen className="text-[#8E7C68] text-xs" />
                    ) : (
                      <FaLock className="text-amber-500 text-xs" />
                    )}
                    <span>Read Article</span>
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
      </AnimatedSection>

      {/* 6. PREVIOUS ISSUES SECTION */}
      <AnimatedSection animation="fade-up" delay={100}>
      <section className="bg-[#FAF7F2]/60 border-y border-[#E5E0D8] py-16 px-4">
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
                className="bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header Info */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-3 py-1 bg-[#FAF7F2] border border-[#E5E0D8] text-[#8E7C68] rounded-full text-xs font-bold tracking-wider uppercase shadow-xs">
                      {issue.status}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <FaCalendarAlt className="text-[#8E7C68] text-xs" /> {issue.date}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#1E2530] font-serif tracking-tight mb-4">
                    {issue.volume}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5446] mb-6 font-serif leading-relaxed">
                    {issue.description}
                  </p>
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
                    className="relative cursor-pointer w-full max-w-[240px] rounded-2xl overflow-hidden shadow-md border-2 border-white bg-white transform hover:scale-[1.03] transition-all duration-300 p-1"
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
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1E2530] text-white rounded-xl font-bold text-sm sm:text-base hover:bg-[#2C384A] transition-all shadow"
            >
              Browse Complete Archive <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* 7. JOURNAL SCOPE, OPEN ACCESS & REVIEW POLICY */}
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
                <p className="text-sm text-[#5C5446] mb-6 leading-relaxed font-serif">
                  Our rigorous double-blind peer-review policy ensures highest standards of academic rigor, novelty, and interdisciplinary integrity.
                </p>
              </div>

              <a
                href="/Review-Policy-TLS.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1E2530] hover:bg-[#8E7C68] text-white rounded-xl font-bold text-sm transition-all shadow text-center cursor-pointer"
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
              <p className="text-xs text-[#5C5446] leading-relaxed font-serif">
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

      {/* 8. FULLSCREEN LIGHTBOX MODAL FOR ANY POSTER / COVER */}
      {activeModalPoster && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setActiveModalPoster(null)}
        >
          <div 
            className="relative max-w-2xl w-full max-h-[92vh] flex flex-col bg-[#1E2530] border border-gray-700 rounded-2xl overflow-hidden shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-5 py-3.5 bg-[#161B22] border-b border-gray-700 text-white">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-[#8E7C68] text-white rounded">
                  {activeModalPoster.title.split('—')[0] || "Poster"}
                </span>
                <span className="text-sm font-semibold text-gray-300 truncate max-w-md">
                  {activeModalPoster.subtitle || activeModalPoster.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalPoster(null)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
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
                download={activeModalPoster.downloadName || "cover.png"}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                <FaDownload className="text-xs" /> Save Image
              </a>

              <div className="flex items-center gap-2">
                {activeModalPoster.isCallForContribution ? (
                  <Link
                    to="/start-submission"
                    onClick={() => setActiveModalPoster(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors"
                  >
                    Submit Paper
                  </Link>
                ) : (
                  <Link
                    to="/current-issue"
                    onClick={() => setActiveModalPoster(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8E7C68] hover:bg-[#7D6B57] text-white text-xs sm:text-sm font-bold rounded-lg transition-colors"
                  >
                    View Published Articles
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 9. IN-BROWSER PEER-REVIEWED PDF READER MODAL */}
      {activePdfViewer && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-fadeIn"
          onClick={() => setActivePdfViewer(null)}
        >
          <div 
            className="bg-[#1E2530] border border-gray-700 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
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
                {activePdfViewer.url && (
                  <a
                    href={activePdfViewer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 rounded-lg text-xs font-semibold transition-colors"
                    title="Open PDF in new tab"
                  >
                    <FaExternalLinkAlt className="text-[10px]" />
                    <span className="hidden sm:inline">Open in New Tab</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setActivePdfViewer(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
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

      {/* 9.5. LOGIN REQUIRED AUTH MODAL (FOR UNLOGGED USERS TRYING TO ACCESS PDF) */}
      {showLoginPrompt && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => {
            setShowLoginPrompt(false);
            setPendingPdfItem(null);
          }}
        >
          <div 
            className="bg-white border border-[#E5E0D8] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-scaleUp text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top decorative header background */}
            <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-[#D32F2F] via-[#8E7C68] to-[#1E2530]" />

            <button
              type="button"
              onClick={() => {
                setShowLoginPrompt(false);
                setPendingPdfItem(null);
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close auth prompt"
            >
              <FaTimes className="w-4 h-4" />
            </button>

            {/* Lock Icon */}
            <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-600 text-2xl shadow-sm">
              <FaLock />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#1E2530] mb-2">
              Authentication Required
            </h3>
            
            <p className="text-xs sm:text-sm text-[#5C5446] mb-6 leading-relaxed font-serif">
              Full text PDF viewing, downloading, and archival access requires an active reader or researcher account. Please sign in or register for free.
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate('/login');
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#1E2530] hover:bg-[#2C384A] text-white rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer"
              >
                <FaSignInAlt className="text-xs" /> Sign In to Access PDF
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate('/register');
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E2530] border border-[#E5E0D8] rounded-xl text-sm font-bold transition-all shadow-xs cursor-pointer"
              >
                <FaUserPlus className="text-xs text-[#8E7C68]" /> Create Free Account
              </button>
            </div>

            <p className="text-[11px] text-gray-400 mt-5 font-mono">
              The Literary Scientist • Peer-Reviewed Open Access
            </p>
          </div>
        </div>
      )}

      {/* 10. ANNOUNCEMENT POPUP MODAL */}
      {showAnnouncementPopup && announcements.length > 0 && (() => {
        const popupAnn = announcements[activeAnnouncementIndex] || announcements[0];
        const isPdf = popupAnn.doc_url && (popupAnn.doc_url.match(/\.pdf$/i) || popupAnn.mime_type?.includes('pdf'));
        const isImg = popupAnn.doc_url && (popupAnn.doc_url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) || popupAnn.mime_type?.includes('image'));
        const pubDate = popupAnn.published_at 
          ? new Date(popupAnn.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : 'Official Journal Notification';

        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
            onClick={handleCloseAnnouncementPopup}
          >
            <div 
              className="bg-[#FAF9F6] border-2 border-[#8E7C68] rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
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
                  className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
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

                {/* Attached Image Preview */}
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
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E2530] border border-[#E5E0D8] rounded-xl text-xs sm:text-sm font-bold transition-all w-full sm:w-auto cursor-pointer"
                    >
                      <FaFilePdf className="text-red-600" /> View Document <FaExternalLinkAlt className="text-[10px]" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleCloseAnnouncementPopup}
                    className="px-5 py-2.5 bg-[#1E2530] hover:bg-[#2C384A] text-white rounded-xl text-xs sm:text-sm font-bold transition-all w-full sm:w-auto shadow-sm cursor-pointer"
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
