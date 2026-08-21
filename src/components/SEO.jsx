import React, { useEffect } from 'react';

const SITE_NAME = 'The Literary Scientist';
const DEFAULT_TITLE = 'The Literary Scientist | A Multi-Disciplinary Journal for Literature and Science';
const DEFAULT_DESCRIPTION = 'The Literary Scientist (ISSN: 3048-7366) is an open-access, peer-reviewed, multi-disciplinary scholarly journal publishing high-impact academic research.';
const DEFAULT_IMAGE = 'https://theliteraryscientist.com/logo.png';
const BASE_URL = 'https://theliteraryscientist.com';

/**
 * Helper to update or create a meta tag in document.head
 */
const setMetaTag = (attrName, attrVal, content) => {
  if (!content) return;
  let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrVal);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

/**
 * Helper to update or create link[rel="canonical"]
 */
const setCanonicalLink = (url) => {
  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
};

/**
 * Helper to inject/update Schema.org JSON-LD structured data
 */
const setJsonLd = (id, data) => {
  if (!data) return;
  let element = document.getElementById(id);
  if (!element) {
    element = document.createElement('script');
    element.setAttribute('type', 'application/ld+json');
    element.setAttribute('id', id);
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
};

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  canonical,
  ogImage = DEFAULT_IMAGE,
  type = 'website',
  article = null,
  jsonLd = null,
  noIndex = false
}) => {
  useEffect(() => {
    // 1. Page Title
    const formattedTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    document.title = formattedTitle;

    // 2. Standard Search Engine Meta
    setMetaTag('name', 'description', description);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large');
    setMetaTag('name', 'googlebot', noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large');

    // 3. Canonical URL
    const canonicalUrl = canonical ? `${BASE_URL}${canonical.startsWith('/') ? canonical : '/' + canonical}` : window.location.href;
    setCanonicalLink(canonicalUrl);

    // 4. OpenGraph Meta Tags
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:image', ogImage);

    // 5. Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. Google Scholar / Academic Citation Meta Tags (for Scholarly Articles)
    if (article) {
      setMetaTag('name', 'citation_title', article.title);
      if (Array.isArray(article.authors)) {
        article.authors.forEach((author) => {
          setMetaTag('name', 'citation_author', typeof author === 'string' ? author : author.name);
        });
      } else if (article.author) {
        setMetaTag('name', 'citation_author', article.author);
      }
      if (article.publication_date || article.published_at) {
        setMetaTag('name', 'citation_publication_date', (article.publication_date || article.published_at).substring(0, 10));
      }
      setMetaTag('name', 'citation_journal_title', SITE_NAME);
      setMetaTag('name', 'citation_issn', '3048-7366');
      if (article.volume_number) setMetaTag('name', 'citation_volume', String(article.volume_number));
      if (article.issue_number) setMetaTag('name', 'citation_issue', String(article.issue_number));
      if (article.doi) setMetaTag('name', 'citation_doi', article.doi);
      if (article.pdf_url) setMetaTag('name', 'citation_pdf_url', article.pdf_url);
      setMetaTag('name', 'citation_abstract_html_url', canonicalUrl);

      // ScholarlyArticle JSON-LD
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'ScholarlyArticle',
        headline: article.title,
        description: article.abstract || description,
        datePublished: article.publication_date || article.published_at,
        url: canonicalUrl,
        isPartOf: {
          '@type': 'Periodical',
          name: SITE_NAME,
          issn: '3048-7366'
        },
        author: Array.isArray(article.authors)
          ? article.authors.map((a) => ({ '@type': 'Person', name: typeof a === 'string' ? a : a.name }))
          : [{ '@type': 'Person', name: article.author || 'Scholarly Author' }]
      };
      setJsonLd('ojs-article-jsonld', articleSchema);
    }

    // 7. Custom JSON-LD
    if (jsonLd) {
      setJsonLd('ojs-custom-jsonld', jsonLd);
    }
  }, [title, description, keywords, canonical, ogImage, type, article, jsonLd, noIndex]);

  return null;
};

export default SEO;
