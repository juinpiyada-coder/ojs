import React, { useState } from 'react';
import { FaShieldAlt, FaFilePdf, FaCheckCircle, FaUserCheck, FaDownload, FaTimes, FaLock } from 'react-icons/fa';
import { autoRedactManuscriptPdf } from '../utils/pdfRedactor';
import { apiFetch, resolveFileUrl } from '../utils/api';
import { toast } from 'react-toastify';

export default function AutoAssignRedactorModal({
  isOpen,
  onClose,
  article,
  reviewers = [],
  onAssigned = () => {}
}) {
  const [authorName, setAuthorName] = useState(article?.author_name || 'Author');
  const [selectedReviewerId, setSelectedReviewerId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [redactionMode, setRedactionMode] = useState('blackout');
  const [isProcessing, setIsProcessing] = useState(false);
  const [anonymousPdfUrl, setAnonymousPdfUrl] = useState(article?.anonymous_pdf_url || null);

  if (!isOpen || !article) return null;

  const handleAssignAndRedact = async () => {
    if (!selectedReviewerId) {
      toast.error('Please select a peer reviewer to assign');
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Trigger client-side PDF redaction if PDF is available
      const sourceUrl = resolveFileUrl(article.manuscript_url || `/api/docs/stream?article_id=${article.article_id}`);
      let newAnonymousBlob = null;

      try {
        const fileRes = await fetch(sourceUrl);
        if (fileRes.ok) {
          const arrayBuffer = await fileRes.arrayBuffer();
          const redactResult = await autoRedactManuscriptPdf(arrayBuffer, {
            title: article.title,
            author: authorName,
          }, { mode: redactionMode });
          newAnonymousBlob = redactResult.anonymousBlob;
        }
      } catch (clientErr) {
        console.warn('Client-side pdf-lib redaction skipped; server pipeline will execute:', clientErr);
      }

      // 2. Assign reviewer via API
      await apiFetch('/reviews', {
        method: 'POST',
        body: {
          article_id: article.article_id,
          reviewer_user_id: parseInt(selectedReviewerId),
          due_date: dueDate || null,
          status: 'assigned'
        }
      });

      // 3. Update article status to under_review and run server-side anonymization
      await apiFetch(`/articles?id=${article.article_id}`, {
        method: 'PATCH',
        body: { status: 'under_review' }
      });

      await apiFetch(`/articles/anonymize?id=${article.article_id}`, {
        method: 'POST'
      });

      toast.success('Manuscript successfully assigned to reviewer with double-blind author redaction!');
      onAssigned();
      onClose();
    } catch (err) {
      console.error('Automated assignment & redaction failed:', err);
      toast.error(err.message || 'Failed to complete assignment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDirectDownloadAnonymous = async () => {
    try {
      setIsProcessing(true);
      const sourceUrl = resolveFileUrl(article.anonymous_pdf_url || article.manuscript_url || `/api/docs/stream?article_id=${article.article_id}`);
      const fileRes = await fetch(sourceUrl);
      const arrayBuffer = await fileRes.arrayBuffer();
      
      const redactResult = await autoRedactManuscriptPdf(arrayBuffer, {
        title: article.title,
        author: authorName,
      }, { mode: redactionMode });

      const downloadUrl = URL.createObjectURL(redactResult.anonymousBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Anonymous_Reviewer_Copy_${article.article_id}.pdf`;
      link.click();
      toast.success('Downloaded anonymous reviewer copy successfully');
    } catch (err) {
      console.error('Download failed:', err);
      toast.error('Failed to generate local redacted copy');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl">
              <FaShieldAlt className="text-base" />
            </div>
            <div>
              <h3 className="text-base font-bold font-sans">Automated Peer Reviewer Assignment & Redactor</h3>
              <p className="text-xs text-gray-400">Double-Blind Shielding: Authors are hidden from Reviewers and Editors</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-2xl font-light leading-none p-1"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Manuscript Details */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Manuscript ID #{article.article_id}</p>
            <h4 className="text-sm font-bold text-gray-900 mt-0.5">{article.title}</h4>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
              <span className="font-semibold">Author: {article.author_name || 'Protected Author'}</span>
              <span>•</span>
              <span>Status: <span className="font-bold uppercase text-amber-700">{article.status}</span></span>
            </div>
          </div>

          {/* Form Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Assign Peer Reviewer *
              </label>
              <select
                value={selectedReviewerId}
                onChange={(e) => setSelectedReviewerId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#8E7C68]"
              >
                <option value="">-- Select Qualified Reviewer --</option>
                {reviewers.map(r => (
                  <option key={r.user_id} value={r.user_id}>
                    {r.display_name} ({r.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Review Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#8E7C68]"
              />
            </div>
          </div>

          {/* Redaction Style Selector */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <FaLock className="text-amber-800 text-xs" />
              <p className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Automated Redaction Engine Protocol
              </p>
            </div>
            <p className="text-xs text-amber-900 mb-3">
              When assigned, author names, email addresses, affiliation boxes, and metadata are automatically scrubbed so the reviewer receives only the sanitized anonymous manuscript.
            </p>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-950">Visual Mask Style:</span>
              <button
                type="button"
                onClick={() => setRedactionMode('blackout')}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${redactionMode === 'blackout' ? 'bg-gray-900 text-amber-300 border-gray-900 shadow-xs' : 'bg-white text-gray-700 border-amber-300'}`}
              >
                Solid Blackout
              </button>
              <button
                type="button"
                onClick={() => setRedactionMode('blank')}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${redactionMode === 'blank' ? 'bg-white text-gray-900 font-extrabold border-gray-400 shadow-xs' : 'bg-white text-gray-700 border-amber-300'}`}
              >
                Blank Paper
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleDirectDownloadAnonymous}
              disabled={isProcessing}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <FaDownload /> Download Redacted Copy (.pdf)
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleAssignAndRedact}
                className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaUserCheck /> {isProcessing ? 'Redacting & Assigning...' : 'Assign to Reviewer & Anonymize'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
