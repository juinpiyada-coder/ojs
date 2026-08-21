import React, { useState, useEffect, useMemo } from 'react';
import {
  FaCode,
  FaShieldAlt,
  FaUserSecret,
  FaDownload,
  FaCopy,
  FaUndo,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSave,
  FaTimes,
  FaSquareRootAlt,
  FaParagraph,
  FaTable,
  FaFileCode,
  FaEye,
  FaLock
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { apiFetch } from '../utils/api';

const DEFAULT_LATEX_TEMPLATE = `\\documentclass[12pt]{article}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{graphicx}
\\usepackage{hyperref}

\\title{Advances in Peer-Reviewed Knowledge Architecture and Automated Verification}
\\author{Dr. Alex Sterling}
\\affiliation{Department of Computer Science, Global University}
\\email{alex.sterling@university.edu}
\\thanks{This research was supported by the International Science Foundation Grant #8849.}

\\begin{document}
\\maketitle

\\begin{abstract}
This paper presents a formal framework for automated manuscript lifecycle synchronization, peer review workflows, and cryptographic double-blind author identity blanking. We evaluate our approach across distributed journal repositories.
\\end{abstract}

\\section{Introduction}
Modern open-access academic publishing requires strict adherence to double-blind peer review protocols. Let the author verification space be denoted by $\\mathcal{A}$ and the sanitized manuscript space by $\\mathcal{M}^*$.

\\section{Mathematical Methodology}
The evaluation function for peer review consensus is defined as:
\\begin{equation}
E(p) = \\sum_{i=1}^{n} w_i \\cdot \\frac{\\alpha_i + \\beta_i}{\\sqrt{\\sigma^2 + \\epsilon}}
\\end{equation}

Where $\\alpha_i$ represents the methodological rigor score, $\\beta_i$ denotes originality, and $\\sigma$ represents inter-reviewer variance.

\\section{Conclusion}
Our protocol eliminates human bias and guarantees double-blind compliance throughout the peer review lifecycle.

\\end{document}`;

export const sanitizeLatexCode = (latex, mode = 'blank') => {
  if (!latex) return '';
  let cleaned = latex;

  if (mode === 'blank') {
    // Blank out author name
    cleaned = cleaned.replace(/\\author(\[[^\]]*\])?\{[^\}]*\}/gi, '\\author{}');
    // Blank out affiliation & institution
    cleaned = cleaned.replace(/\\(affiliation|address|institute|inst)(\[[^\]]*\])?\{[^\}]*\}/gi, '\\$1{}');
    // Blank out email
    cleaned = cleaned.replace(/\\(email|ead|contact)(\[[^\]]*\])?\{[^\}]*\}/gi, '\\$1{}');
    // Blank out thanks / grant funding
    cleaned = cleaned.replace(/\\thanks\{[^\}]*\}/gi, '\\thanks{[REDACTED FOR DOUBLE-BLIND REVIEW]}');
    // Blank out corresponding author marks
    cleaned = cleaned.replace(/\\(corref|cortext|corresp)(\[[^\]]*\])?\{[^\}]*\}/gi, '');
  } else {
    // Placeholder mode
    cleaned = cleaned.replace(/\\author(\[[^\]]*\])?\{[^\}]*\}/gi, '\\author{[ANONYMIZED FOR DOUBLE-BLIND REVIEW]}');
    cleaned = cleaned.replace(/\\(affiliation|address|institute|inst)(\[[^\]]*\])?\{[^\}]*\}/gi, '\\$1{[ACADEMIC AFFILIATION REDACTED]}');
    cleaned = cleaned.replace(/\\(email|ead|contact)(\[[^\]]*\])?\{[^\}]*\}/gi, '\\$1{[EMAIL CONCEALED]}');
    cleaned = cleaned.replace(/\\thanks\{[^\}]*\}/gi, '\\thanks{[FUNDING & GRANT ACKNOWLEDGMENT REDACTED]}');
    cleaned = cleaned.replace(/\\(corref|cortext|corresp)(\[[^\]]*\])?\{[^\}]*\}/gi, '');
  }

  return cleaned;
};

const LatexEditorModal = ({
  isOpen,
  onClose,
  initialLatex = '',
  articleId = null,
  articleTitle = '',
  onSaved = null,
  readOnly = false
}) => {
  const [latexCode, setLatexCode] = useState('');
  const [originalCode, setOriginalCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('split'); // 'split' | 'editor' | 'preview'
  const [blankMode, setBlankMode] = useState('blank'); // 'blank' | 'mask'

  useEffect(() => {
    if (isOpen) {
      const code = initialLatex && initialLatex.trim() ? initialLatex : DEFAULT_LATEX_TEMPLATE;
      setLatexCode(code);
      setOriginalCode(code);
    }
  }, [isOpen, initialLatex]);

  // Audit for author identity leaks
  const leakAudit = useMemo(() => {
    if (!latexCode) return { count: 0, items: [] };
    const items = [];
    const authorMatches = latexCode.match(/\\author(\[[^\]]*\])?\{([^\}]*)\}/gi) || [];
    const affilMatches = latexCode.match(/\\(affiliation|address|institute|inst)(\[[^\]]*\])?\{([^\}]*)\}/gi) || [];
    const emailMatches = latexCode.match(/\\(email|ead|contact)(\[[^\]]*\])?\{([^\}]*)\}/gi) || [];
    const thanksMatches = latexCode.match(/\\thanks\{([^\}]*)\}/gi) || [];

    authorMatches.forEach(m => {
      const val = m.replace(/\\author(\[[^\]]*\])?\{/i, '').replace(/\}$/, '').trim();
      if (val && !val.includes('ANONYMIZED') && !val.includes('REDACTED') && val !== '') {
        items.push({ type: 'Author Name', raw: m, val });
      }
    });

    affilMatches.forEach(m => {
      const val = m.replace(/\\(affiliation|address|institute|inst)(\[[^\]]*\])?\{/i, '').replace(/\}$/, '').trim();
      if (val && !val.includes('REDACTED') && val !== '') {
        items.push({ type: 'Affiliation/Institution', raw: m, val });
      }
    });

    emailMatches.forEach(m => {
      const val = m.replace(/\\(email|ead|contact)(\[[^\]]*\])?\{/i, '').replace(/\}$/, '').trim();
      if (val && !val.includes('CONCEALED') && val !== '') {
        items.push({ type: 'Author Email', raw: m, val });
      }
    });

    thanksMatches.forEach(m => {
      const val = m.replace(/\\thanks\{/i, '').replace(/\}$/, '').trim();
      if (val && !val.includes('REDACTED') && val !== '') {
        items.push({ type: 'Grant/Acknowledgment', raw: m, val });
      }
    });

    return {
      count: items.length,
      items,
      isClean: items.length === 0
    };
  }, [latexCode]);

  if (!isOpen) return null;

  const insertSnippet = (snippet) => {
    setLatexCode(prev => prev + '\n' + snippet);
    toast.info('LaTeX snippet inserted');
  };

  const handleAnonymize = (mode = blankMode) => {
    const cleaned = sanitizeLatexCode(latexCode, mode);
    setLatexCode(cleaned);
    toast.success(mode === 'blank' ? 'Author & affiliation fields blanked!' : 'Author metadata replaced with anonymized placeholders!');
  };

  const handleRevert = () => {
    setLatexCode(originalCode);
    toast.info('Reverted to original LaTeX source');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(latexCode);
    toast.success('LaTeX code copied to clipboard');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([latexCode], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `manuscript_${articleId || 'anonymized'}.tex`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded .tex file');
  };

  const handleSaveToBackend = async () => {
    if (!articleId) {
      if (onSaved) onSaved(latexCode);
      onClose();
      return;
    }

    try {
      setSaving(true);
      await apiFetch(`/articles?id=${articleId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          latex_source: latexCode
        })
      });
      toast.success('LaTeX source attached to manuscript successfully!');
      if (onSaved) onSaved(latexCode);
      onClose();
    } catch (err) {
      console.error('Failed to save LaTeX source:', err);
      toast.error('Failed to save LaTeX source');
    } finally {
      setSaving(false);
    }
  };

  // Simple LaTeX preview parser
  const renderSimplePreview = (code) => {
    const titleMatch = code.match(/\\title\{([^}]*)\}/i);
    const authorMatch = code.match(/\\author(\[[^\]]*\])?\{([^}]*)\}/i);
    const affilMatch = code.match(/\\(affiliation|address|institute)\{([^}]*)\}/i);
    const abstractMatch = code.match(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/i);
    
    // Extract sections
    const sections = [];
    const sectionRegex = /\\section\{([^}]*)\}([\s\S]*?)(?=(\\section|\$|\\end\{document\}|$))/gi;
    let match;
    while ((match = sectionRegex.exec(code)) !== null) {
      sections.push({ title: match[1], body: match[2] });
    }

    const title = titleMatch ? titleMatch[1] : (articleTitle || 'Untitled Manuscript');
    const author = authorMatch ? authorMatch[2] : '';
    const affil = affilMatch ? affilMatch[2] : '';
    const abstract = abstractMatch ? abstractMatch[1].trim() : '';

    return (
      <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-[#E5E0D8] font-serif text-[#1E2530] min-h-[500px] shadow-inner space-y-6">
        {/* Title */}
        <div className="text-center pb-4 border-b border-[#E5E0D8] space-y-2">
          <h1 className="text-2xl font-black font-serif tracking-tight text-gray-900">
            {title}
          </h1>

          {/* Author Block with Anonymity Status */}
          <div className="pt-2">
            {!author || author.trim() === '' ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-mono font-bold border border-gray-300">
                <FaLock className="text-gray-500 text-[10px]" />
                [AUTHOR IDENTITY BLANKED — DOUBLE-BLIND COMPLIANT]
              </div>
            ) : author.includes('ANONYMIZED') ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-mono font-bold border border-amber-300">
                <FaShieldAlt className="text-amber-600 text-[10px]" />
                {author}
              </div>
            ) : (
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-gray-800">{author}</p>
                {affil && <p className="text-xs text-gray-500">{affil}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Abstract */}
        {abstract && (
          <div className="bg-white p-5 rounded-xl border border-[#E5E0D8] shadow-xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-900 font-sans">
              Abstract
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed italic">
              {abstract}
            </p>
          </div>
        )}

        {/* Sections */}
        {sections.length > 0 ? (
          sections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <h2 className="text-base font-bold font-serif text-gray-900 border-b border-gray-200 pb-1">
                {idx + 1}. {sec.title}
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {sec.body.replace(/\\begin\{equation\}/g, '\n[ Equation Block ]\n').replace(/\\end\{equation\}/g, '').trim()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-600 italic">
            Manuscript body parsed from LaTeX document structure.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col relative overflow-hidden border border-[#E5E0D8]">
        
        {/* 1. Modal Top Bar */}
        <div className="px-6 py-3.5 bg-[#161C24] text-white flex flex-wrap justify-between items-center gap-3 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-mono font-bold text-base border border-amber-400/30">
              <FaSquareRootAlt />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono text-amber-300 uppercase tracking-wider">
                  LaTeX Math & Manuscript Engine
                </span>
                {leakAudit.isClean ? (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
                    <FaCheckCircle /> 100% Anonymized
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] font-bold flex items-center gap-1 border border-amber-500/30">
                    <FaExclamationTriangle /> {leakAudit.count} Author Token{leakAudit.count > 1 ? 's' : ''} Detected
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white truncate max-w-md">
                {articleTitle || 'Interactive Double-Blind LaTeX Editor'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="bg-black/30 p-1 rounded-xl flex items-center gap-1 border border-white/10 text-xs">
              <button
                onClick={() => setActiveTab('split')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${activeTab === 'split' ? 'bg-amber-400 text-black' : 'text-gray-300 hover:text-white'}`}
              >
                Split View
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${activeTab === 'editor' ? 'bg-amber-400 text-black' : 'text-gray-300 hover:text-white'}`}
              >
                Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${activeTab === 'preview' ? 'bg-amber-400 text-black' : 'text-gray-300 hover:text-white'}`}
              >
                Preview
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-light leading-none p-1.5 ml-2"
            >
              &times;
            </button>
          </div>
        </div>

        {/* 2. Quick Action Toolbar */}
        <div className="px-6 py-2.5 bg-[#1F2633] text-white flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 shrink-0 text-xs">
          
          {/* Quick Snippets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-gray-400 font-mono">Insert:</span>
            <button
              onClick={() => insertSnippet('\\begin{equation}\n  E = mc^2\n\\end{equation}')}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-gray-200 transition-colors font-mono text-[11px]"
            >
              + Equation
            </button>
            <button
              onClick={() => insertSnippet('\\frac{a}{b}')}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-gray-200 transition-colors font-mono text-[11px]"
            >
              + Fraction
            </button>
            <button
              onClick={() => insertSnippet('\\sum_{i=1}^{n} x_i')}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-gray-200 transition-colors font-mono text-[11px]"
            >
              + Summation
            </button>
            <button
              onClick={() => insertSnippet('\\section{Title}')}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-gray-200 transition-colors font-mono text-[11px]"
            >
              + Section
            </button>
            <button
              onClick={() => insertSnippet(DEFAULT_LATEX_TEMPLATE)}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-gray-200 transition-colors font-mono text-[11px]"
            >
              + Template
            </button>
          </div>

          {/* Anonymizer Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAnonymize('blank')}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
              title="Automatically blanks author name, affiliation, email, and thanks tags"
            >
              <FaUserSecret /> Blank Author Info (\author{})
            </button>
            <button
              onClick={() => handleAnonymize('mask')}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-gray-200 font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <FaShieldAlt /> Mask Placeholder
            </button>
            <button
              onClick={handleRevert}
              className="p-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-colors"
              title="Revert to original"
            >
              <FaUndo />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-colors"
              title="Copy LaTeX"
            >
              <FaCopy />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-colors"
              title="Download .tex"
            >
              <FaDownload />
            </button>
          </div>
        </div>

        {/* 3. Main Split Content Workspace */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left: LaTeX Code Editor */}
          {(activeTab === 'split' || activeTab === 'editor') && (
            <div className={`flex flex-col h-full bg-[#11161F] text-emerald-300 border-r border-gray-800 ${activeTab === 'split' ? 'w-full md:w-1/2' : 'w-full'}`}>
              <div className="px-4 py-2 bg-[#0D1117] text-gray-400 text-[11px] font-mono flex justify-between items-center border-b border-gray-800">
                <span>LaTeX Source Document (.tex)</span>
                <span>{latexCode.length} Characters • {latexCode.split('\n').length} Lines</span>
              </div>
              <textarea
                value={latexCode}
                onChange={(e) => setLatexCode(e.target.value)}
                readOnly={readOnly}
                placeholder="Type or paste LaTeX manuscript source code here..."
                className="flex-1 w-full p-4 bg-[#11161F] text-emerald-300 font-mono text-xs sm:text-sm resize-none focus:outline-none focus:ring-0 leading-relaxed selection:bg-amber-400 selection:text-black"
                spellCheck={false}
              />
            </div>
          )}

          {/* Right: Live Preview & Privacy Audit */}
          {(activeTab === 'split' || activeTab === 'preview') && (
            <div className={`flex flex-col h-full bg-[#F4F1EA] overflow-y-auto p-4 sm:p-6 ${activeTab === 'split' ? 'w-full md:w-1/2' : 'w-full'}`}>
              
              {/* Privacy Warning Banner if Leaks Exist */}
              {!leakAudit.isClean && (
                <div className="mb-4 bg-amber-50 border border-amber-300 rounded-2xl p-4 text-amber-950 space-y-2 shadow-xs shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <FaExclamationTriangle className="text-amber-600" />
                      <span>Author Identifiers Detected in LaTeX Code:</span>
                    </div>
                    <button
                      onClick={() => handleAnonymize('blank')}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold transition-colors"
                    >
                      Auto-Blank Now
                    </button>
                  </div>
                  <ul className="text-xs space-y-1 pl-4 list-disc text-amber-900">
                    {leakAudit.items.map((item, idx) => (
                      <li key={idx}>
                        <strong>{item.type}:</strong> <code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono">{item.val}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rendered Preview */}
              <div className="flex-1">
                {renderSimplePreview(latexCode)}
              </div>

            </div>
          )}

        </div>

        {/* 4. Modal Footer Bar */}
        <div className="px-6 py-3.5 bg-white border-t border-[#E5E0D8] flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <FaShieldAlt className="text-amber-600 text-sm" />
            <span>
              Double-Blind protocol automatically blanks <code className="bg-gray-100 px-1 rounded">\author{}</code>, <code className="bg-gray-100 px-1 rounded">\affiliation{}</code>, and <code className="bg-gray-100 px-1 rounded">\email{}</code>.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-600 hover:text-gray-900 text-xs font-bold transition-colors"
            >
              Close
            </button>
            {!readOnly && (
              <button
                onClick={handleSaveToBackend}
                disabled={saving}
                className="px-5 py-2.5 bg-[#1E2530] hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FaSave /> {saving ? 'Saving...' : 'Save & Attach to Manuscript'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LatexEditorModal;
