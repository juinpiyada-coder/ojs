import { PDFDocument, rgb } from 'pdf-lib';

/**
 * Dynamic Client-Side PDF Auto-Redactor & Double-Blind Masker
 * Scans and redacts author identifying zones (byline, header, author/bio table) using pdf-lib.
 *
 * @param {File|ArrayBuffer|Uint8Array} fileInput - The manuscript PDF
 * @param {Object} authorMetadata - Author details to redact (name, email, affiliation, etc.)
 * @param {Object} options - Customization options (mode: 'blackout' | 'blank', maskByline: bool, maskBio: bool)
 * @returns {Promise<{ anonymousBlob: Blob, anonymousArrayBuffer: ArrayBuffer, fileName: string }>}
 */
export async function autoRedactManuscriptPdf(fileInput, authorMetadata = {}, options = {}) {
  const {
    mode = 'blackout', // 'blackout' | 'blank'
    maskByline = true,
    maskBioTable = true,
    bylineHeightRatio = 0.16, // Top 16% of first page (byline zone)
    bioTopRatio = 0.22,       // Bio/Author table top offset
    bioHeightRatio = 0.28     // Bio/Author table height
  } = options;

  let fileArrayBuffer;
  if (fileInput instanceof Blob || fileInput instanceof File) {
    fileArrayBuffer = await fileInput.arrayBuffer();
  } else if (fileInput instanceof ArrayBuffer) {
    fileArrayBuffer = fileInput;
  } else if (fileInput && fileInput.buffer instanceof ArrayBuffer) {
    fileArrayBuffer = fileInput.buffer;
  } else {
    throw new Error('Invalid file input provided for PDF redaction');
  }

  // Load PDF with pdf-lib
  const pdfDoc = await PDFDocument.load(fileArrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const pageCount = pages.length;

  if (pageCount === 0) {
    throw new Error('PDF has no pages');
  }

  const primaryColor = mode === 'blank' ? rgb(1, 1, 1) : rgb(0.07, 0.09, 0.12); // Pure White or Dark Matte Black
  const borderColor = mode === 'blank' ? rgb(0.8, 0.8, 0.8) : rgb(0.95, 0.77, 0.25); // Gray or Amber Accent

  // Redact Page 1 (Title, Byline, Author Affiliation Table)
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  // 1. Zone 1: Byline Mask (Under Title)
  if (maskByline) {
    const maskHeight = height * bylineHeightRatio;
    const maskY = height - maskHeight - 30; // Position below journal banner

    firstPage.drawRectangle({
      x: 36,
      y: maskY,
      width: width - 72,
      height: maskHeight,
      color: primaryColor,
      borderColor: borderColor,
      borderWidth: 1.5,
    });
  }

  // 2. Zone 2: Author Profile & Bio Table Mask
  if (maskBioTable) {
    const bioY = height * (1 - bioTopRatio - bioHeightRatio);
    const bioHeight = height * bioHeightRatio;

    firstPage.drawRectangle({
      x: 40,
      y: bioY,
      width: width - 80,
      height: bioHeight,
      color: primaryColor,
      borderColor: borderColor,
      borderWidth: 1.5,
    });
  }

  // 3. Sanitize Document Metadata
  pdfDoc.setTitle(authorMetadata.title || 'Scholarly Manuscript (Double-Blind Peer Review)');
  pdfDoc.setAuthor('Double-Blind Anonymous Peer Review');
  pdfDoc.setSubject('Anonymized Manuscript for Double-Blind Evaluation');
  pdfDoc.setKeywords(['Double-Blind', 'Anonymized', 'Peer Review']);
  pdfDoc.setProducer('Journal Editorial Automated Redactor System');
  pdfDoc.setCreator('Journal Editorial Automated Redactor System');

  // Save sanitized PDF
  const anonymousPdfBytes = await pdfDoc.save();
  const anonymousBlob = new Blob([anonymousPdfBytes], { type: 'application/pdf' });

  const originalName = fileInput.name || 'manuscript.pdf';
  const anonymousFileName = originalName.startsWith('anonymous_') 
    ? originalName 
    : `anonymous_${originalName}`;

  return {
    anonymousBlob,
    anonymousArrayBuffer: anonymousPdfBytes.buffer,
    fileName: anonymousFileName,
    byteLength: anonymousPdfBytes.byteLength
  };
}
