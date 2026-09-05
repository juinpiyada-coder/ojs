import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import {
  FaBookOpen,
  FaFilePdf,
  FaCalendarAlt,
  FaSearch,
  FaExpandAlt,
  FaTimes,
  FaDownload,
  FaExternalLinkAlt,
  FaChevronDown,
  FaChevronRight,
  FaAward,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';

const defaultArchiveVolumes = [
  {
    id: "vol-1-iss-3",
    volumeNumber: 1,
    issueNumber: 3,
    year: 2025,
    volume: "Volume I, Issue III",
    date: "July, 2025",
    status: "Latest Published Issue",
    coverImg: "/annousments/image2.png",
    description: "Features 10 peer-reviewed articles exploring contemporary mythological literature, cinema, gendered rural agency, folk art traditions, eco-criticism, and transnational identities.",
    articles: [
      {
        id: 1,
        title: "Bridging Cinematic Narratives and Literary Depths: Fusions in Contemporary Mythological Novels Concerning Amish Tripathi’s Ram Chandra Series",
        author: "Garima Singh",
        pdfUrl: "/Volume%20I%20Issue%20III/TLS20250103_26.pdf",
        category: "MYTHOLOGICAL FICTION & CINEMA",
        pages: "pp. 26-30",
        doi: "10.5281/zenodo.1082326"
      },
      {
        id: 2,
        title: "Retelling the Past: Cinematic Narratives of Oppression and Resistance in Bolivia and Bengal",
        author: "Ahana Bhandari",
        pdfUrl: "/Volume%20I%20Issue%20III/TLS20250103_27.pdf",
        category: "COMPARATIVE CULTURAL STUDIES",
        pages: "pp. 31-36",
        doi: "10.5281/zenodo.1082327"
      },
      {
        id: 3,
        title: "What Did She Know About Transformation That We Don’t?",
        author: "Lina Mandal",
        pdfUrl: "/Volume%20I%20Issue%20III/TLS20250103_28.pdf",
        category: "LITERARY THEORY & CRITICISM",
        pages: "pp. 37-41",
        doi: "10.5281/zenodo.1082328"
      },
      {
        id: 4,
        title: "Laapataa Ladies: A Cinematic Satire on Gendered Invisibility and Rural Agency",
        author: "Satyam Kumar",
        pdfUrl: "/Volume%20I%20Issue%20III/TLS20250103_30.pdf",
        category: "GENDER STUDIES & FILM",
        pages: "pp. 42-47",
        doi: "10.5281/zenodo.1082330"
      },
      {
        id: 5,
        title: "Patachitra Tradition and Artist Kalam Pauta: A Theoretical Perspective on Art and Literature",
        author: "Dr. Rakesh Kaibartya",
        pdfUrl: "/Volume%20I%20Issue%20III/TLS20250103_31.pdf",
        category: "ART, FOLK TRADITION & LITERATURE",
        pages: "pp. 48-54",
        doi: "10.5281/zenodo.1082331"
      },
      {
        id: 6,
        title: "Beyond the Characters: Nature Shapes the Story in “Ullozhukku”",
        author: "Dona Joseph",
        pdfUrl: "/Volume%20I%20Issue%20III/TLS20250103_32.pdf",
        category: "ECO-CRITICISM & NARRATIVE",
        pages: "pp. 55-60",
        doi: "10.5281/zenodo.1082332"
      },
      {
        id: 7,
        title: "How Ideology Shapes Consumption: The Case of Oil Palm Industry and Red Meat Production",
        author: "Souvik Karmakar",
        pdfUrl: "/Volume%20I%20Issue%20III/TLS20250103_.33.pdf",
        category: "ENVIRONMENTAL SCIENCES & POLICY",
        pages: "pp. 61-68",
        doi: "10.5281/zenodo.1082333"
      },
      {
        id: 8,
        title: "From ‘Little Maiden’ to ‘The Witch’: Exploring the Themes of Vampirism, Witchcraft and the Female Wanderer Through a Biographical Reading of Mary Coleridge’s “The Witch”",
        author: "Shibangi Ghose",
        pdfUrl: "/Volume%20I%20Issue%20III/TLS20250103_34.pdf",
        category: "GOTHIC LITERATURE & GENDER",
        pages: "pp. 69-75",
        doi: "10.5281/zenodo.1082334"
      },
      {
        id: 9,
        title: "The Word as Weapon: Language, Power, and Black Male Representation in Morrison’s Narratives",
        author: "Sakshi Virmani",
        pdfUrl: "/Volume%20I%20Issue%20III/TLS20250103_37.pdf",
        category: "AFRICAN AMERICAN LITERATURE",
        pages: "pp. 76-82",
        doi: "10.5281/zenodo.1082337"
      },
      {
        id: 10,
        title: "Between Nations and Narratives: Transnational Engagement and Flexible Citizenship in American Betiya",
        author: "Kakoli Debnath and Dr. Binda Sah",
        pdfUrl: "/Volume%20I%20Issue%20III/TLS20250103_.38.pdf",
        category: "DIASPORA & TRANSNATIONALISM",
        pages: "pp. 83-90",
        doi: "10.5281/zenodo.1082338"
      }
    ]
  },
  {
    id: "vol-1-iss-2",
    volumeNumber: 1,
    issueNumber: 2,
    year: 2025,
    volume: "Volume I, Issue II",
    date: "January, 2025",
    status: "Archived Issue",
    coverImg: "/annousments/image copy.png",
    description: "Featuring peer-reviewed scholarship across modern cultural hermeneutics, socio-environmental dynamics, gender discourse, and medical humanities.",
    articles: [
      {
        id: 101,
        title: "Praxis in Academic Gauging: A Critique to Scholastic Module of Neuroplasticity Dialogue on Mental Health",
        author: "Bidisha Chakraborty",
        pdfUrl: "/Volume%20I%20Issue%20II/Praxis_final.pdf",
        category: "MEDICAL HUMANITIES & NEURO-DIALOGUE",
        pages: "pp. 1-8",
        doi: "10.5281/zenodo.1082341"
      },
      {
        id: 102,
        title: "Phallic Myth and Sexual Rapport Reprogrammed: Lacanian Analysis of Bryan Forbes' Film The Stepford Wives (1975)",
        author: "Biswadip Mal",
        pdfUrl: "/Volume%20I%20Issue%20II/Phallic_Final.pdf",
        category: "FILM & PSYCHOANALYTIC THEORY",
        pages: "pp. 9-16",
        doi: "10.5281/zenodo.1082342"
      },
      {
        id: 103,
        title: "Jung’s Archetypes and Baum’s Attempt at Ethical Neutrality in The Wizard of Oz",
        author: "Sounak Banerjee",
        pdfUrl: "/Volume%20I%20Issue%20II/Sounak_final.pdf",
        category: "LITERARY CRITICISM & ARCHETYPAL THEORY",
        pages: "pp. 17-24",
        doi: "10.5281/zenodo.1082343"
      },
      {
        id: 104,
        title: "Remaining Literary Forms: Twitterature and Instapoetry as Microfiction",
        author: "Anuska Bag",
        pdfUrl: "/Volume%20I%20Issue%20II/Remaining-literacy_Final.pdf",
        category: "DIGITAL HUMANITIES & MICROFICTION",
        pages: "pp. 25-32",
        doi: "10.5281/zenodo.1082344"
      },
      {
        id: 105,
        title: "Critiquing the Eco-Narratives",
        author: "Debanjan Chakraborty",
        pdfUrl: "/Volume%20I%20Issue%20II/Critiquing_final.pdf",
        category: "ENVIRONMENTAL HUMANITIES & ECO-CRITICISM",
        pages: "pp. 33-40",
        doi: "10.5281/zenodo.1082345"
      },
      {
        id: 106,
        title: "Subverting the Patriarchal Trope by Challenging Toxic Masculinity in Feminist Revenge Fantasy: An Analysis of Anvita Dutt’s ‘Bulbbul’ and Prosit Roy’s ‘Pari’",
        author: "Quincy Tikadar",
        pdfUrl: "/Volume%20I%20Issue%20II/Subverting_final.pdf",
        category: "GENDER STUDIES & CINEMA",
        pages: "pp. 41-48",
        doi: "10.5281/zenodo.1082346"
      },
      {
        id: 107,
        title: "Intersecting Inequalities: The Role of Caste and Socioeconomic Status in Maternal Healthcare Access",
        author: "Suchismita Mitra and Samriddha Biswas",
        pdfUrl: "/Volume%20I%20Issue%20II/The-Role_Final.pdf",
        category: "PUBLIC HEALTH & SOCIAL JUSTICE",
        pages: "pp. 49-56",
        doi: "10.5281/zenodo.1082347"
      },
      {
        id: 108,
        title: "Menstrual Education Through Indian Info Comic Menstrupedia",
        author: "Firthouse Tajuddin and Dr. K. Sindhu",
        pdfUrl: "/Volume%20I%20Issue%20II/Mentrual_Final.pdf",
        category: "COMICS STUDIES & HEALTH EDUCATION",
        pages: "pp. 57-64",
        doi: "10.5281/zenodo.1082348"
      },
      {
        id: 109,
        title: "WOUNDS OF THE PAST: Feminine Histories and Silent Landscapes in Ice-Candy-Man and What the Body Remembers",
        author: "Kazmi Afrose",
        pdfUrl: "/Volume%20I%20Issue%20II/Wound-of-the-past_Final.pdf",
        category: "POST-COLONIAL & MEMORY STUDIES",
        pages: "pp. 65-72",
        doi: "10.5281/zenodo.1082349"
      },
      {
        id: 110,
        title: "Film Review: Breaking Barriers with Laughter in “Badhaai Do”",
        author: "Pallabi Gharami",
        pdfUrl: "/Volume%20I%20Issue%20II/Badhaai-Do_Final.pdf",
        category: "QUEER STUDIES & FILM REVIEW",
        pages: "pp. 73-78",
        doi: "10.5281/zenodo.1082350"
      }
    ]
  },
  {
    id: "vol-1-iss-1",
    volumeNumber: 1,
    issueNumber: 1,
    year: 2023,
    volume: "Volume I, Issue I",
    date: "December, 2023",
    status: "Inaugural Issue",
    coverImg: "/annousments/img2.png",
    description: "Inaugural volume establishing our multidisciplinary bridge between literary theory, cultural memory, and empirical scientific inquiry.",
    articles: [
      {
        id: 201,
        title: "Gendering Wartime Sexual Violence Against Women in Bangladesh: The Liberation War and the Struggles of the War Heroines in the book “Birangona”",
        author: "Quince Tikadar",
        pdfUrl: "/Volume%20I%20Issue%20I/Gendering-1.pdf",
        category: "GENDER & HISTORICAL MEMORY",
        pages: "pp. 1-9",
        doi: "10.5281/zenodo.1082201"
      },
      {
        id: 202,
        title: "ভারতীয় সাহিত্যঃ লোক সংস্কৃতি ও মিথের বহূকৌনিকের গোমোণ",
        author: "Samaresh Mondal",
        pdfUrl: "/Volume%20I%20Issue%20I/bharatiya-sahitya-1.pdf",
        category: "FOLKLORE & INDIAN LITERATURE",
        pages: "pp. 10-18",
        doi: "10.5281/zenodo.1082202"
      },
      {
        id: 203,
        title: "শ্রীগদ্যশরীর : একটি বিশ্লেষণী পাঠ",
        author: "Debasree Pal",
        pdfUrl: "/Volume%20I%20Issue%20I/goddosorir-2-1.pdf",
        category: "LITERARY CRITICISM & BENGALI PROSE",
        pages: "pp. 19-27",
        doi: "10.5281/zenodo.1082203"
      },
      {
        id: 204,
        title: "আমাদের জল জীবন",
        author: "Aritree De",
        pdfUrl: "/Volume%20I%20Issue%20I/jol-1.pdf",
        category: "ECOLOGICAL WRITING & CULTURE",
        pages: "pp. 28-35",
        doi: "10.5281/zenodo.1082204"
      },
      {
        id: 205,
        title: "Book Review: Heidegger and a Hippo Walk Through Those Pearly Gates",
        author: "Agomoni Chakraborty",
        pdfUrl: "/Volume%20I%20Issue%20I/The_BOOK.pdf",
        category: "PHILOSOPHY & BOOK REVIEW",
        pages: "pp. 36-41",
        doi: "10.5281/zenodo.1082205"
      },
      {
        id: 206,
        title: "The Euclidean Mind and the Major Archetypes in Dostoevsky’s Novel, The Brothers Karamazov",
        author: "Al Minar Mahmudur Reza",
        pdfUrl: "/Volume%20I%20Issue%20I/The-euclident-mind.pdf",
        category: "RUSSIAN LITERATURE & PHILOSOPHY",
        pages: "pp. 42-50",
        doi: "10.5281/zenodo.1082206"
      },
      {
        id: 207,
        title: "The Influence of Music Videos in Second Language Listening Development: A Study of the Undergraduate Students of Dhaka City",
        author: "Farah Ulfat Mohinee and Progga Saha",
        pdfUrl: "/Volume%20I%20Issue%20I/The-Influence.pdf",
        category: "APPLIED LINGUISTICS & PEDAGOGY",
        pages: "pp. 51-60",
        doi: "10.5281/zenodo.1082207"
      },
      {
        id: 208,
        title: "“Where words fail, music speaks”: The Role of Influential Music in Shaping Young Adults’ Identities and Perspectives",
        author: "Simanta Nandy and Sumedha Ghosh",
        pdfUrl: "/Volume%20I%20Issue%20I/The_role.pdf",
        category: "CULTURAL STUDIES & MUSICOLOGY",
        pages: "pp. 61-70",
        doi: "10.5281/zenodo.1082208"
      },
      {
        id: 209,
        title: "Delineating Eco-Epistemic Paradigms: A Multifaceted Exegesis of Environmental Morality and Hegemonic Dynamics in Mandaar and Macbeth",
        author: "Soumabha Chakraborty and Sounak Banerjee",
        pdfUrl: "/Volume%20I%20Issue%20I/Delineating.pdf",
        category: "ECO-CRITICISM & SHAKESPEARE STUDIES",
        pages: "pp. 71-80",
        doi: "10.5281/zenodo.1082209"
      },
      {
        id: 210,
        title: "The Gollem Effect: Integration of Gollem-Class AIs during the Climate Change in Online Ecosystem",
        author: "Megha Bhattacharya and Arkannel Khan",
        pdfUrl: "/Volume%20I%20Issue%20I/Golem-Effect-Final.pdf",
        category: "AI, COMPUTATIONAL ECOLOGY & MEDIA",
        pages: "pp. 81-90",
        doi: "10.5281/zenodo.1082210"
      }
    ]
  }
];

const Archive = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [volumesList, setVolumesList] = useState(defaultArchiveVolumes);
  const [loading, setLoading] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState("vol-1-iss-3");
  const [expandedYears, setExpandedYears] = useState({ 2025: true, 2023: true });
  const [fontSizeLevel, setFontSizeLevel] = useState('base'); // 'sm' | 'base' | 'lg'
  const [activeModalPoster, setActiveModalPoster] = useState(null);
  const [activePdfViewer, setActivePdfViewer] = useState(null);

  // Sync issue selection from URL query param (e.g., ?issue=vol-1-iss-2 or ?issue=vol-1-iss-1 or hash #vol-1-iss-1)
  useEffect(() => {
    const issueParam = searchParams.get('issue') || (location.hash ? location.hash.replace('#', '') : null);
    if (issueParam) {
      const match = volumesList.find(v => v.id === issueParam || v.id.toLowerCase().includes(issueParam.toLowerCase()));
      if (match) {
        setSelectedIssueId(match.id);
        if (match.year) {
          setExpandedYears(prev => ({ ...prev, [match.year]: true }));
        }
        // Smooth scroll to the issue card or reader
        setTimeout(() => {
          const el = document.getElementById(match.id) || document.getElementById('archive-content');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [searchParams, location.hash, volumesList]);

  // Set default selected issue on initial load
  useEffect(() => {
    if (!selectedIssueId && volumesList.length > 0) {
      setSelectedIssueId(volumesList[0].id);
    }
  }, [volumesList, selectedIssueId]);

  // Group volumes by Year
  const groupedByYear = volumesList.reduce((acc, issue) => {
    const y = issue.year || 2025;
    if (!acc[y]) acc[y] = [];
    acc[y].push(issue);
    return acc;
  }, {});

  // Sort years descending (e.g. 2026, 2025, 2024, 2023)
  const sortedYears = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a);

  // Compute min and max year
  const minYear = sortedYears.length > 0 ? sortedYears[sortedYears.length - 1] : 2023;
  const maxYear = sortedYears.length > 0 ? sortedYears[0] : 2026;

  // Toggle year collapse
  const toggleYear = (year) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  // Find currently active issue
  const activeIssue = volumesList.find(v => v.id === selectedIssueId) || volumesList[0] || null;
  const recentIssue = volumesList[0] || {
    id: 'latest-issue',
    volume: 'Volume 1, Issue 1',
    date: '2025',
    status: 'Latest Issue',
    coverImg: '/annousments/image2.png',
    articles: []
  };

  // Font scale class helper
  const getFontSizeClass = () => {
    switch (fontSizeLevel) {
      case 'sm': return 'text-[13px] leading-relaxed';
      case 'lg': return 'text-[17px] leading-loose';
      case 'base':
      default: return 'text-[15px] leading-normal';
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(searchTerm.trim());
  };

  return (
    <main className="min-h-screen bg-[#FDFCF7] text-gray-900 pb-20 font-sans">
      <SEO
        title="Journal Archive & Published Issues"
        description="Explore the complete archive of past volumes, issues, and peer-reviewed scholarly articles published in The Literary Scientist (ISSN: 3048-7366)."
        keywords="The Literary Scientist archives, journal issues, scholarly publications, volume archive, peer-reviewed articles, research index"
        canonical="/archive"
      />
      
      {/* Top Academic Breadcrumb / ISSN Bar */}
      <div className="border-b border-gray-200 bg-[#FAF9F6] py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-[#D32F2F] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Archives</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-gray-600">
            <span>ISSN (Online): 3048-7366</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Peer-Reviewed Open Access</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12">
        
        {/* ========================================================================= */}
        {/* 1. Header Section: Title, Accessibility Controls (A+ | A | A-), and Search */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-gray-900">
          
          {/* Main Title & Font Resizer */}
          <div className="flex flex-wrap items-baseline gap-4 sm:gap-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-gray-950 tracking-tight">
              The Literary Scientist Archive from {minYear} – {maxYear}
            </h1>
            
            {/* Font Size Accessibility Toggles */}
            <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-mono select-none">
              <button
                onClick={() => setFontSizeLevel('lg')}
                className={`hover:text-[#D32F2F] transition-colors font-bold px-1 ${fontSizeLevel === 'lg' ? 'text-[#D32F2F] underline' : ''}`}
                title="Increase text size"
              >
                A⁺
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setFontSizeLevel('base')}
                className={`hover:text-[#D32F2F] transition-colors font-bold px-1 ${fontSizeLevel === 'base' ? 'text-[#D32F2F] underline' : ''}`}
                title="Default text size"
              >
                A
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setFontSizeLevel('sm')}
                className={`hover:text-[#D32F2F] transition-colors font-bold px-1 ${fontSizeLevel === 'sm' ? 'text-[#D32F2F] underline' : ''}`}
                title="Decrease text size"
              >
                A⁻
              </button>
            </div>
          </div>

          {/* Search Bar with Red Button */}
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search archive..."
                className="w-full pl-3 pr-3 py-1.5 text-sm border border-gray-300 rounded-l focus:outline-none focus:border-gray-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold uppercase tracking-wider rounded-r transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <FaSearch className="text-[10px]" /> SEARCH
            </button>
          </form>

        </div>

        {/* ========================================================================= */}
        {/* 2. Main Body: 2-Column Academic Layout (Archive Tree vs. Recent Issues)  */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 items-start">
          
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT COLUMN: Collapsible Year Accordions & Issue Directory (8 cols)    */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className={`space-y-6 ${getFontSizeClass()}`}>
              {sortedYears.map((year) => {
                const issuesInYear = groupedByYear[year] || [];
                const isExpanded = expandedYears[year] ?? true;

                return (
                  <div key={year} className="border-b border-gray-200 pb-4">
                    
                    {/* Collapsible Year Header */}
                    <button
                      onClick={() => toggleYear(year)}
                      className="w-full flex items-center gap-2 text-left py-2 text-lg sm:text-xl font-bold font-serif text-gray-900 hover:text-[#D32F2F] transition-colors group focus:outline-none"
                    >
                      <span className="text-[#D32F2F] text-xs transition-transform duration-200">
                        {isExpanded ? '▼' : '▶'}
                      </span>
                      <span>{year}</span>
                      <span className="text-xs font-normal text-gray-400 font-sans ml-2">
                        ({issuesInYear.length} {issuesInYear.length === 1 ? 'Issue' : 'Issues'})
                      </span>
                    </button>

                    {/* Bulleted List of Issues under Year */}
                    {isExpanded && (
                      <div className="mt-3 pl-4 sm:pl-6 border-l-2 border-gray-100 space-y-2.5 animate-fadeIn">
                        {issuesInYear.map((iss) => {
                          const isSelected = selectedIssueId === iss.id;
                          return (
                            <div key={iss.id} className="space-y-2">
                              <div
                                onClick={() => setSelectedIssueId(iss.id)}
                                className={`flex items-start gap-2.5 cursor-pointer group py-1 transition-all ${
                                  isSelected ? 'text-[#D32F2F] font-bold' : 'text-gray-700 hover:text-[#D32F2F]'
                                }`}
                              >
                                <span className="text-gray-400 group-hover:text-[#D32F2F] text-sm mt-0.5">•</span>
                                <span className="font-sans text-sm sm:text-base leading-snug">
                                  {iss.volume}, {iss.date}
                                </span>
                                {isSelected && (
                                  <span className="px-2 py-0.5 text-[10px] font-mono bg-red-50 text-[#D32F2F] rounded border border-red-200 font-semibold uppercase">
                                    Active View
                                  </span>
                                )}
                              </div>

                              {/* In-Place Table of Contents for Active Issue */}
                              {isSelected && (
                                <div className="mt-4 mb-6 bg-[#FAF9F6] border border-gray-200 rounded-xl p-5 sm:p-7 space-y-5 shadow-xs animate-fadeIn">
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-200 gap-2">
                                    <div>
                                      <span className="text-xs font-bold text-[#D32F2F] uppercase tracking-wider">
                                        Table of Contents
                                      </span>
                                      <h3 className="text-lg sm:text-xl font-bold font-serif text-gray-900 mt-0.5">
                                        {iss.volume} ({iss.date})
                                      </h3>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">
                                      {iss.articles.length} Published Articles
                                    </span>
                                  </div>

                                  <div className="flex flex-col md:flex-row gap-6 items-start">
                                    {/* Issue Cover Artwork Thumbnail */}
                                    <div 
                                      onClick={() => setActiveModalPoster({
                                        src: iss.coverImg,
                                        title: `The Literary Scientist — ${iss.volume}`,
                                        subtitle: `${iss.status} • ${iss.date}`,
                                        downloadName: `The_Literary_Scientist_${iss.volume.replace(/[^a-zA-Z0-9]/g, '_')}_Cover.png`
                                      })}
                                      className="w-full sm:w-44 md:w-48 shrink-0 bg-white border border-gray-300 rounded-lg p-2 shadow-sm cursor-pointer group hover:shadow-md transition-shadow relative"
                                    >
                                      <img
                                        src={iss.coverImg}
                                        alt={`${iss.volume} Cover`}
                                        className="w-full h-auto object-contain rounded"
                                      />
                                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center text-white text-xs font-bold gap-1">
                                        <FaExpandAlt className="text-[10px]" /> Enlarge
                                      </div>
                                    </div>

                                    {/* Articles List */}
                                    <div className="flex-1 divide-y divide-gray-200 space-y-4 w-full">
                                      {iss.articles.map((art, idx) => (
                                        <div key={art.id || idx} className="pt-4 first:pt-0 space-y-2">
                                          <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                            <div className="space-y-1 max-w-xl">
                                              <h4 
                                                onClick={() => art.pdfUrl && setActivePdfViewer(art)}
                                                className={`text-sm sm:text-base font-bold text-gray-900 leading-snug ${art.pdfUrl ? 'cursor-pointer hover:text-[#D32F2F]' : ''} transition-colors`}
                                              >
                                                {art.title}
                                              </h4>
                                              <p className="text-xs font-semibold text-[#8E7C68]">
                                                By: {art.author}
                                              </p>
                                              <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 font-mono pt-1">
                                                {art.pages && <span className="bg-gray-100 px-1.5 py-0.5 rounded">{art.pages}</span>}
                                                {art.doi && <span className="bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200">DOI: {art.doi}</span>}
                                                <span className="text-gray-400">{art.category}</span>
                                              </div>
                                            </div>

                                            {art.pdfUrl && (
                                              <button
                                                type="button"
                                                onClick={() => setActivePdfViewer(art)}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#D32F2F] text-gray-800 hover:text-white border border-gray-300 hover:border-[#D32F2F] rounded text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                                              >
                                                <FaBookOpen className="text-red-600 group-hover:text-white" />
                                                <span>View PDF</span>
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

            {/* Editorial Footer Information */}
            <div className="pt-8 border-t border-gray-200 text-xs text-gray-500 space-y-2">
              <p>
                <strong>The Literary Scientist</strong> publishes peer-reviewed research across multidisciplinary domains. All archived volumes are openly accessible under Creative Commons Attribution 4.0 International (CC BY 4.0).
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 pt-1">
                <span>Indexed in Google Scholar</span> • <span>CrossRef DOI Registered</span> • <span>Open Access Journal</span>
              </div>
            </div>

          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: "Recent Issues" Sidebar Card (4 cols)                    */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-[#FAF9F6] border border-gray-200 rounded-lg shadow-sm overflow-hidden sticky top-6">
              
              {/* Card Top Red Line Header */}
              <div className="border-t-4 border-[#D32F2F] px-5 py-4 bg-white border-b border-gray-200">
                <h2 className="text-base font-bold text-gray-900 font-sans tracking-wide text-center">
                  Recent Issues
                </h2>
              </div>

              {/* Latest Issue Callout */}
              <div className="p-5 sm:p-6 text-center space-y-4">
                
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 font-sans">
                    {recentIssue?.volume || 'Volume 1, Issue 1'}, {recentIssue?.date || ''}
                  </h3>
                  <button
                    onClick={() => {
                      if (recentIssue?.id) {
                        setSelectedIssueId(recentIssue.id);
                        window.scrollTo({ top: 200, behavior: 'smooth' });
                      }
                    }}
                    className="text-xs font-bold text-[#D32F2F] hover:underline mt-1 inline-block"
                  >
                    Contents
                  </button>
                </div>

                {/* Journal Cover Art Box with Preview */}
                <div 
                  onClick={() => setActiveModalPoster({
                    src: recentIssue?.coverImg || "/annousments/image2.png",
                    title: `The Literary Scientist — ${recentIssue?.volume || 'Current Issue'}`,
                    subtitle: `${recentIssue?.status || 'Published'} • ${recentIssue?.date || ''}`,
                    downloadName: `The_Literary_Scientist_${(recentIssue?.volume || 'Issue').replace(/[^a-zA-Z0-9]/g, '_')}_Cover.png`
                  })}
                  className="relative group cursor-pointer border border-gray-300 rounded shadow-sm bg-white p-2 hover:shadow-md transition-shadow"
                >
                  <img
                    src={recentIssue?.coverImg || "/annousments/image2.png"}
                    alt={`${recentIssue?.volume || 'Current Issue'} Cover`}
                    className="w-full h-auto max-h-[380px] object-contain mx-auto"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-white rounded">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-gray-900 px-3 py-1.5 rounded shadow">
                      <FaExpandAlt className="text-[10px]" /> Enlarge Cover
                    </span>
                  </div>
                </div>

                {/* Quick List of Recent Issues */}
                <div className="text-left pt-4 border-t border-gray-200 space-y-2">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Browse Other Recent Issues:
                  </span>
                  <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
                    {volumesList.slice(0, 4).map(v => (
                      <li key={v.id}>
                        <button
                          onClick={() => {
                            setSelectedIssueId(v.id);
                            window.scrollTo({ top: 200, behavior: 'smooth' });
                          }}
                          className={`text-left hover:text-[#D32F2F] transition-colors flex items-center gap-1.5 w-full truncate ${
                            selectedIssueId === v.id ? 'text-[#D32F2F] font-bold' : ''
                          }`}
                        >
                          <span className="text-[#D32F2F]">•</span>
                          <span className="truncate">{v.volume} ({v.date})</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. Cover / Lightbox Modal                                                 */}
      {/* ========================================================================= */}
      {activeModalPoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative max-w-2xl w-full max-h-[92vh] flex flex-col bg-white border border-gray-300 rounded-xl overflow-hidden shadow-2xl">
            
            <div className="flex justify-between items-center px-5 py-3.5 bg-gray-900 text-white">
              <span className="text-sm font-bold truncate">
                {activeModalPoster.title}
              </span>
              <button
                type="button"
                onClick={() => setActiveModalPoster(null)}
                className="text-gray-400 hover:text-white text-xl font-bold leading-none p-1"
              >
                &times;
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex items-center justify-center bg-neutral-100 min-h-[300px]">
              <img
                src={activeModalPoster.src}
                alt={activeModalPoster.title}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded shadow-lg mx-auto"
              />
            </div>

            <div className="flex justify-between items-center px-5 py-3 bg-white border-t border-gray-200">
              <a
                href={activeModalPoster.src}
                download={activeModalPoster.downloadName || "cover.png"}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded transition-colors"
              >
                <FaDownload className="text-xs" /> Save Cover Image
              </a>
              <button
                type="button"
                onClick={() => setActiveModalPoster(null)}
                className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded hover:bg-gray-800"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. In-Browser PDF Reader Modal (Protected - Direct Download Dissolved)    */}
      {/* ========================================================================= */}
      {activePdfViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-fadeIn">
          <div className="bg-[#1E2530] border border-gray-700 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Reader Header */}
            <div className="bg-[#161B22] px-4 py-3 border-b border-gray-700 flex justify-between items-center text-white">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="bg-[#D32F2F] text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                    Scholarly Publication
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
                <span className="text-[11px] text-gray-400 font-mono hidden sm:inline bg-gray-800/80 px-2.5 py-1 rounded border border-gray-700">
                  Protected In-Browser Reader
                </span>
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
                src={`${activePdfViewer.pdfUrl || activePdfViewer.url}#toolbar=0&navpanes=0&scrollbar=1`}
                className="w-full h-full border-0"
                title={activePdfViewer.title}
              />
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default Archive;
