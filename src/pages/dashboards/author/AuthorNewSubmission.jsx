import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Divider,
  Chip,
  Stack,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Functions as FunctionsIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Description as DescriptionIcon,
  InfoOutlined as InfoIcon,
  OpenInNew as OpenInNewIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Send as SendIcon,
  PersonAdd as PersonAddIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { apiFetch } from '../../../utils/api';
import { useBrand } from '../../../context/BrandingContext';
import { toast } from 'react-toastify';
import LatexEditorModal from '../../../components/LatexEditorModal';

const submissionSteps = [
  { step: 1, title: 'Start', desc: 'Select section and article type' },
  { step: 2, title: 'Upload Files', desc: 'Upload manuscript and supplementary files' },
  { step: 3, title: 'Enter Details', desc: 'Add authors, title, abstract and keywords' },
  { step: 4, title: 'Additional Information', desc: 'Add funding, conflicts and more' },
  { step: 5, title: 'Review & Confirm', desc: 'Review all information and submit' },
];

const AuthorNewSubmission = () => {
  const navigate = useNavigate();
  const { brand } = useBrand();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showLatexModal, setShowLatexModal] = useState(false);
  const [latexSource, setLatexSource] = useState('');

  // Step 1 Form Fields
  const [journalSection, setJournalSection] = useState('Research Articles');
  const [articleType, setArticleType] = useState('Original Research');
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState(['Machine Learning', 'Histopathological Images', 'Cancer Detection', 'Deep Learning', 'AI']);

  // Step 2 Files
  const [manuscriptFile, setManuscriptFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [supplementaryFile, setSupplementaryFile] = useState(null);

  // Step 3 Co-authors
  const [coAuthors, setCoAuthors] = useState([]);
  const [coAuthorName, setCoAuthorName] = useState('');
  const [coAuthorEmail, setCoAuthorEmail] = useState('');
  const [coAuthorAffiliation, setCoAuthorAffiliation] = useState('');

  // Step 4 Declarations
  const [fundingInfo, setFundingInfo] = useState('');
  const [conflictOfInterest, setConflictOfInterest] = useState('The authors declare no competing interests.');
  const [dataAvailability, setDataAvailability] = useState('Data will be made available upon reasonable request.');
  const [agreedBlind, setAgreedBlind] = useState(true);
  const [agreedOriginal, setAgreedOriginal] = useState(true);

  // Word count
  const wordCount = abstract.trim() ? abstract.trim().split(/\s+/).filter(Boolean).length : 0;

  // Keywords
  const handleAddKeyword = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && keywordInput.trim()) {
      e.preventDefault();
      const cleanTag = keywordInput.replace(',', '').trim();
      if (cleanTag && !keywords.includes(cleanTag)) {
        setKeywords([...keywords, cleanTag]);
      }
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (tagToRemove) => {
    setKeywords(keywords.filter(k => k !== tagToRemove));
  };

  // Co-authors
  const handleAddCoAuthor = () => {
    if (!coAuthorName.trim() || !coAuthorEmail.trim()) {
      toast.error('Please enter name and email');
      return;
    }
    setCoAuthors([...coAuthors, {
      name: coAuthorName.trim(),
      email: coAuthorEmail.trim(),
      affiliation: coAuthorAffiliation.trim() || 'Not specified',
    }]);
    setCoAuthorName('');
    setCoAuthorEmail('');
    setCoAuthorAffiliation('');
  };

  const handleRemoveCoAuthor = (idx) => {
    setCoAuthors(coAuthors.filter((_, i) => i !== idx));
  };

  // Validation
  const validateStep = (step) => {
    if (step === 1) {
      if (!title.trim()) {
        toast.error('Please enter the manuscript title.');
        return false;
      }
      if (!abstract.trim()) {
        toast.error('Please enter your abstract.');
        return false;
      }
      if (keywords.length === 0) {
        toast.error('Please provide at least one keyword.');
        return false;
      }
    } else if (step === 2) {
      if (!manuscriptFile && !latexSource) {
        toast.error('Please upload a manuscript file (.pdf, .docx) or write LaTeX source.');
        return false;
      }
    } else if (step === 4) {
      if (!agreedBlind || !agreedOriginal) {
        toast.error('Please accept the compliance declarations.');
        return false;
      }
    }
    return true;
  };

  const handleContinue = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToStep = (stepNumber) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (validateStep(currentStep)) {
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = async (submitStatus = 'submitted') => {
    if (!title.trim() || !abstract.trim()) {
      toast.error('Manuscript title and abstract are required.');
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    try {
      let docId = null;
      if (manuscriptFile) {
        const fileData = new FormData();
        fileData.append('file', manuscriptFile);
        fileData.append('uploaded_by', user.user_id || 1);

        const uploadRes = await apiFetch('/docs', { method: 'POST', body: fileData });
        docId = uploadRes.data?.doc_id || null;
      }

      const payload = {
        author_user_id: user.user_id || 1,
        manuscript_pdf_id: docId || 1,
        title: title.trim(),
        abstract: abstract.trim(),
        keywords: keywords.join(', '),
        latex_source: latexSource || null,
        status: submitStatus,
      };

      await apiFetch('/articles', { method: 'POST', body: payload });

      if (submitStatus === 'incomplete') {
        toast.success('Draft saved successfully!');
        navigate('/user/dashboard');
      } else {
        toast.success('Manuscript submitted successfully!');
        navigate('/user/dashboard/submission-status');
      }
    } catch (err) {
      toast.error('Submission failed: ' + (err.message || 'Please check all required fields'));
    } finally {
      setLoading(false);
    }
  };

  const journalTitle = brand?.journal_title || 'The Literary Scientist';

  return (
    <Box sx={{ maxWidth: 1320, mx: 'auto', p: { xs: 1.5, sm: 2.5, md: 4 } }}>
      
      {/* 1. Header Section */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#0F172A', letterSpacing: -0.6 }}>
          New Submission
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5, fontSize: '0.92rem' }}>
          Submit your manuscript to <strong>{journalTitle}</strong>
        </Typography>
      </Box>

      {/* 2. Top Horizontal Stepper */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          mb: 4,
          borderRadius: 3.5,
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          width: '100%',
        }}
      >
        <Box sx={{ width: '100%', position: 'relative' }}>
          {/* Connector Line */}
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              left: '10%',
              right: '10%',
              height: 2,
              bgcolor: '#E2E8F0',
              zIndex: 0,
            }}
          />

          <Grid container sx={{ width: '100%', position: 'relative', zIndex: 1 }}>
            {submissionSteps.map((s) => {
              const isCurrent = currentStep === s.step;
              const isCompleted = currentStep > s.step;

              return (
                <Grid
                  key={s.step}
                  size={{ xs: 2.4 }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                  onClick={() => handleJumpToStep(s.step)}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: isCurrent ? '#2563EB' : isCompleted ? '#10B981' : '#FFFFFF',
                      color: isCurrent || isCompleted ? '#FFFFFF' : '#64748B',
                      border: isCurrent ? '3px solid #BFDBFE' : isCompleted ? '2px solid #10B981' : '2px solid #CBD5E1',
                      fontWeight: 900,
                      fontSize: '0.95rem',
                      boxShadow: isCurrent ? '0 4px 14px rgba(37, 99, 235, 0.35)' : 'none',
                      mb: 1,
                    }}
                  >
                    {isCompleted ? <CheckIcon fontSize="small" sx={{ strokeWidth: 2.5 }} /> : s.step}
                  </Avatar>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isCurrent ? 900 : 600,
                      color: isCurrent ? '#2563EB' : isCompleted ? '#10B981' : '#64748B',
                      fontSize: { xs: '0.72rem', sm: '0.82rem' },
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.title}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Paper>

      {/* 3. Main Content Grid */}
      <Grid container spacing={3.5}>
        
        {/* Left Column: Form Content */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5, md: 4.5 },
              borderRadius: 4,
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03)',
            }}
          >
            
            {/* STEP 1: Manuscript Submission */}
            {currentStep === 1 && (
              <Box>
                <Box sx={{ mb: 3.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: -0.4 }}>
                    Manuscript Submission
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', mt: 0.4 }}>
                    Please select the appropriate section and article type for your submission.
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* Journal Section */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A', display: 'block', mb: 0.8 }}>
                      Journal Section <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={journalSection}
                        onChange={(e) => setJournalSection(e.target.value)}
                        sx={{ borderRadius: 2.5, bgcolor: '#FFFFFF' }}
                      >
                        <MenuItem value="Research Articles">Research Articles</MenuItem>
                        <MenuItem value="Review Articles">Review Articles</MenuItem>
                        <MenuItem value="Short Communications">Short Communications</MenuItem>
                        <MenuItem value="Case Studies">Case Studies</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.6, fontSize: '0.72rem' }}>
                      Select the section that best fits your manuscript
                    </Typography>
                  </Grid>

                  {/* Article Type */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A', display: 'block', mb: 0.8 }}>
                      Article Type <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={articleType}
                        onChange={(e) => setArticleType(e.target.value)}
                        sx={{ borderRadius: 2.5, bgcolor: '#FFFFFF' }}
                      >
                        <MenuItem value="Original Research">Original Research</MenuItem>
                        <MenuItem value="Systematic Review">Systematic Review</MenuItem>
                        <MenuItem value="Methodology & Algorithms">Methodology & Algorithms</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.6, fontSize: '0.72rem' }}>
                      Select the most appropriate article type
                    </Typography>
                  </Grid>

                  {/* Manuscript Title */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A', display: 'block', mb: 0.8 }}>
                      Manuscript Title <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter your manuscript title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      slotProps={{ input: { sx: { borderRadius: 2.5, fontWeight: 500 } } }}
                    />
                    <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 0.6, fontSize: '0.72rem' }}>
                      The title should be concise and informative
                    </Typography>
                  </Grid>

                  {/* Abstract */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A', display: 'block', mb: 0.8 }}>
                      Abstract <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      placeholder="Enter your abstract (150-300 words)"
                      value={abstract}
                      onChange={(e) => setAbstract(e.target.value)}
                      slotProps={{ input: { sx: { borderRadius: 2.5 } } }}
                    />
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.6 }}>
                      <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem' }}>
                        Provide a clear and concise summary of your research (minimum 150 words)
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.75rem' }}>
                        {wordCount}/300 words
                      </Typography>
                    </Stack>
                  </Grid>

                  {/* Keywords */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A', display: 'block', mb: 0.8 }}>
                      Keywords <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter keywords and press Enter"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={handleAddKeyword}
                      slotProps={{ input: { sx: { borderRadius: 2.5 } } }}
                    />
                    
                    {/* Tags */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                      {keywords.map((kw, idx) => (
                        <Chip
                          key={idx}
                          label={kw}
                          size="small"
                          onDelete={() => handleRemoveKeyword(kw)}
                          sx={{
                            bgcolor: '#F1F5F9',
                            color: '#334155',
                            fontWeight: 600,
                            fontSize: '0.78rem',
                            borderRadius: 2,
                            border: '1px solid #E2E8F0',
                            '& .MuiChip-deleteIcon': { color: '#94A3B8', '&:hover': { color: '#EF4444' } },
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>

                  {/* Info Box */}
                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        p: 2.2,
                        bgcolor: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                      }}
                    >
                      <InfoIcon sx={{ color: '#2563EB', fontSize: 20, mt: 0.2 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E40AF', fontSize: '0.85rem' }}>
                          Before you continue
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#3B82F6', fontSize: '0.8rem', mt: 0.3 }}>
                          Please ensure your manuscript adheres to our <Link to="/author-guidelines" className="underline font-bold" target="_blank">Author Guidelines</Link> and all required files are ready for upload.
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                </Grid>
              </Box>
            )}

            {/* STEP 2: Upload Files */}
            {currentStep === 2 && (
              <Box>
                <Box sx={{ mb: 3.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: -0.4 }}>
                    Upload Files
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', mt: 0.4 }}>
                    Upload your primary manuscript document and any supplementary files.
                  </Typography>
                </Box>

                <Stack spacing={3}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A', display: 'block', mb: 0.8 }}>
                      Primary Manuscript File <span style={{ color: '#EF4444' }}>*</span>
                    </Typography>
                    
                    <Paper
                      variant="outlined"
                      component="label"
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        bgcolor: manuscriptFile ? '#F0FDF4' : '#F8FAFC',
                        borderColor: manuscriptFile ? '#22C55E' : '#CBD5E1',
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        borderRadius: 3.5,
                        cursor: 'pointer',
                        display: 'block',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: '#F1F5F9', borderColor: '#94A3B8' },
                      }}
                    >
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => e.target.files?.[0] && setManuscriptFile(e.target.files[0])}
                      />
                      <Stack spacing={1} alignItems="center">
                        <Avatar sx={{ bgcolor: manuscriptFile ? '#DCFCE7' : '#EFF6FF', color: manuscriptFile ? '#16A34A' : '#2563EB', width: 52, height: 52 }}>
                          <CloudUploadIcon sx={{ fontSize: 28 }} />
                        </Avatar>
                        {manuscriptFile ? (
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 800, color: '#15803D' }}>
                              {manuscriptFile.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                              {(manuscriptFile.size / (1024 * 1024)).toFixed(2)} MB • Click to replace
                            </Typography>
                          </Box>
                        ) : (
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 800, color: '#1E293B' }}>
                              Drag and drop manuscript file here, or browse
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                              Supported formats: PDF (.pdf), Microsoft Word (.docx, .doc) — Max size: 25 MB
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Paper>
                  </Box>

                  {/* LaTeX Source Option */}
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: '#F8FAFC', borderColor: '#E2E8F0' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                          LaTeX / Mathematical Source Code
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          {latexSource ? `Attached LaTeX code (${latexSource.length} characters)` : 'Compose or edit LaTeX source directly in browser'}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<FunctionsIcon />}
                        onClick={() => setShowLatexModal(true)}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, borderColor: '#CBD5E1', color: '#0F172A' }}
                      >
                        {latexSource ? 'Edit LaTeX' : 'Open LaTeX Editor'}
                      </Button>
                    </Stack>
                  </Paper>

                  {/* Cover Letter */}
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A', display: 'block', mb: 0.8 }}>
                        Cover Letter (Optional)
                      </Typography>
                      <Paper
                        variant="outlined"
                        component="label"
                        sx={{
                          p: 2.5,
                          textAlign: 'center',
                          bgcolor: '#FAFAF9',
                          borderRadius: 3,
                          cursor: 'pointer',
                          display: 'block',
                          borderStyle: 'dashed',
                          '&:hover': { bgcolor: '#F5F5F4' },
                        }}
                      >
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => e.target.files?.[0] && setCoverLetterFile(e.target.files[0])}
                        />
                        <Typography variant="body2" sx={{ color: coverLetterFile ? '#16A34A' : '#64748B', fontWeight: 700 }}>
                          {coverLetterFile ? `✓ ${coverLetterFile.name}` : '+ Attach Cover Letter'}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A', display: 'block', mb: 0.8 }}>
                        Supplementary Files (Optional)
                      </Typography>
                      <Paper
                        variant="outlined"
                        component="label"
                        sx={{
                          p: 2.5,
                          textAlign: 'center',
                          bgcolor: '#FAFAF9',
                          borderRadius: 3,
                          cursor: 'pointer',
                          display: 'block',
                          borderStyle: 'dashed',
                          '&:hover': { bgcolor: '#F5F5F4' },
                        }}
                      >
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.zip,.csv,.xlsx,.docx"
                          onChange={(e) => e.target.files?.[0] && setSupplementaryFile(e.target.files[0])}
                        />
                        <Typography variant="body2" sx={{ color: supplementaryFile ? '#16A34A' : '#64748B', fontWeight: 700 }}>
                          {supplementaryFile ? `✓ ${supplementaryFile.name}` : '+ Attach Supplementary File'}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Stack>
              </Box>
            )}

            {/* STEP 3: Authors & Affiliations */}
            {currentStep === 3 && (
              <Box>
                <Box sx={{ mb: 3.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: -0.4 }}>
                    Authors & Institutional Affiliations
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', mt: 0.4 }}>
                    Confirm primary author details and add any contributing co-authors.
                  </Typography>
                </Box>

                {/* Primary Author */}
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: '#F8FAFC', mb: 3.5 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#EFF6FF', color: '#2563EB', width: 44, height: 44, fontWeight: 800 }}>
                      {(user.display_name || user.email || 'A')[0].toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                          {user.display_name || user.displayName || 'Primary Author'}
                        </Typography>
                        <Chip label="Corresponding Author" size="small" color="primary" sx={{ fontWeight: 800, height: 20, fontSize: '0.68rem', borderRadius: 1 }} />
                      </Stack>
                      <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.3 }}>
                        {user.email} • User ID #{user.user_id || 1}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                {/* Add Co-Author */}
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: '#FFFFFF', mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonAddIcon fontSize="small" sx={{ color: '#2563EB' }} /> Add Co-Author
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Full Name *"
                        value={coAuthorName}
                        onChange={(e) => setCoAuthorName(e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Email Address *"
                        value={coAuthorEmail}
                        onChange={(e) => setCoAuthorEmail(e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Institutional Affiliation"
                        value={coAuthorAffiliation}
                        onChange={(e) => setCoAuthorAffiliation(e.target.value)}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddCoAuthor}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, color: '#2563EB', borderColor: '#BFDBFE' }}
                  >
                    Add Co-Author
                  </Button>
                </Paper>

                {/* Co-Authors List */}
                {coAuthors.length > 0 && (
                  <Stack spacing={1.5}>
                    {coAuthors.map((ca, idx) => (
                      <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#0F172A' }}>{ca.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>{ca.email} {ca.affiliation && `• ${ca.affiliation}`}</Typography>
                        </Box>
                        <IconButton size="small" color="error" onClick={() => handleRemoveCoAuthor(idx)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Box>
            )}

            {/* STEP 4: Declarations */}
            {currentStep === 4 && (
              <Box>
                <Box sx={{ mb: 3.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: -0.4 }}>
                    Additional Information & Declarations
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', mt: 0.4 }}>
                    Provide funding acknowledgments and accept publication ethics declarations.
                  </Typography>
                </Box>

                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Funding / Grant Statement"
                    placeholder="State research funding agencies, grant numbers, or write 'None'."
                    value={fundingInfo}
                    onChange={(e) => setFundingInfo(e.target.value)}
                    slotProps={{ input: { sx: { borderRadius: 2.5 } } }}
                  />

                  <TextField
                    fullWidth
                    label="Conflict of Interest Declaration"
                    value={conflictOfInterest}
                    onChange={(e) => setConflictOfInterest(e.target.value)}
                    slotProps={{ input: { sx: { borderRadius: 2.5 } } }}
                  />

                  <TextField
                    fullWidth
                    label="Data Availability Statement"
                    value={dataAvailability}
                    onChange={(e) => setDataAvailability(e.target.value)}
                    slotProps={{ input: { sx: { borderRadius: 2.5 } } }}
                  />

                  {/* Compliance Box */}
                  <Paper variant="outlined" sx={{ bgcolor: '#FFFBEB', borderColor: '#FDE68A', borderRadius: 3.5, p: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400E', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShieldIcon fontSize="small" sx={{ color: '#D97706' }} /> Double-Blind Peer Review Compliance
                    </Typography>

                    <Stack spacing={1.5}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={agreedBlind}
                            onChange={(e) => setAgreedBlind(e.target.checked)}
                            color="warning"
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ color: '#78350F', fontSize: '0.85rem', fontWeight: 500 }}>
                            <strong>Double-Blind Anonymization:</strong> I confirm that author names and affiliations have been removed from the uploaded manuscript file.
                          </Typography>
                        }
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={agreedOriginal}
                            onChange={(e) => setAgreedOriginal(e.target.checked)}
                            color="warning"
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ color: '#78350F', fontSize: '0.85rem', fontWeight: 500 }}>
                            <strong>Originality & Ethical Publication:</strong> The manuscript represents original research not currently under review elsewhere.
                          </Typography>
                        }
                      />
                    </Stack>
                  </Paper>
                </Stack>
              </Box>
            )}

            {/* STEP 5: Review & Confirm */}
            {currentStep === 5 && (
              <Box>
                <Box sx={{ mb: 3.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: -0.4 }}>
                    Review & Confirm Submission
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', mt: 0.4 }}>
                    Please review your submission details before transmitting to the editorial office.
                  </Typography>
                </Box>

                <Paper variant="outlined" sx={{ p: 3.5, borderRadius: 3.5, bgcolor: '#F8FAFC' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                    <Chip label={journalSection} size="small" color="primary" sx={{ fontWeight: 800, borderRadius: 1.5 }} />
                    <Chip label={articleType} size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1.5 }} />
                  </Stack>

                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#0F172A', my: 1 }}>
                    {title}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155' }}>
                    Abstract:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#475569', fontStyle: 'italic', my: 1, lineHeight: 1.6 }}>
                    "{abstract}"
                  </Typography>

                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mt: 2 }}>
                    Keywords:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, my: 1 }}>
                    {keywords.map((kw, i) => (
                      <Chip key={i} label={`#${kw}`} size="small" sx={{ bgcolor: '#FFFFFF', fontWeight: 700 }} />
                    ))}
                  </Box>

                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mt: 2 }}>
                    Attached Manuscript:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#16A34A', fontWeight: 800, mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <CheckCircleIcon sx={{ fontSize: 18 }} /> {manuscriptFile ? manuscriptFile.name : (latexSource ? 'LaTeX Source Code' : 'None')}
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Footer Navigation Buttons */}
            <Divider sx={{ my: 4, borderColor: '#F1F5F9' }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Button
                variant="text"
                color="inherit"
                disabled={currentStep === 1}
                onClick={handleBack}
                sx={{ textTransform: 'none', fontWeight: 700, color: '#64748B' }}
              >
                Cancel
              </Button>

              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  color="inherit"
                  disabled={loading}
                  startIcon={<SaveIcon />}
                  onClick={() => handleFinalSubmit('incomplete')}
                  sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700, borderColor: '#CBD5E1' }}
                >
                  Save Draft
                </Button>

                {currentStep < 5 ? (
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleContinue}
                    sx={{
                      borderRadius: 2.5,
                      textTransform: 'none',
                      fontWeight: 800,
                      px: 3.5,
                      bgcolor: '#2563EB',
                      '&:hover': { bgcolor: '#1D4ED8' },
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                    }}
                  >
                    Save & Continue
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    onClick={() => handleFinalSubmit('submitted')}
                    sx={{
                      borderRadius: 2.5,
                      textTransform: 'none',
                      fontWeight: 800,
                      px: 4,
                      bgcolor: '#2563EB',
                      '&:hover': { bgcolor: '#1D4ED8' },
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                    }}
                  >
                    {loading ? 'Submitting...' : 'Submit Manuscript'}
                  </Button>
                )}
              </Stack>
            </Stack>

          </Paper>
        </Grid>

        {/* Right Column: Clean Sidebar Reference Widget */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            
            {/* Widget 1: Submission Steps */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
                boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
                Submission Steps
              </Typography>

              <Stack spacing={1.2}>
                {submissionSteps.map((s) => {
                  const isCurrent = currentStep === s.step;
                  const isCompleted = currentStep > s.step;

                  return (
                    <Box
                      key={s.step}
                      onClick={() => handleJumpToStep(s.step)}
                      sx={{
                        p: 1.5,
                        borderRadius: 2.5,
                        bgcolor: isCurrent ? '#EFF6FF' : '#FFFFFF',
                        border: isCurrent ? '1px solid #BFDBFE' : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: isCurrent ? '#EFF6FF' : '#F8FAFC', transform: 'translateX(3px)' },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: isCurrent ? '#2563EB' : isCompleted ? '#10B981' : '#F1F5F9',
                          color: isCurrent || isCompleted ? '#FFFFFF' : '#64748B',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          mt: 0.2,
                        }}
                      >
                        {isCompleted ? <CheckIcon sx={{ fontSize: 14 }} /> : s.step}
                      </Avatar>

                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: isCurrent ? 800 : 700, color: isCurrent ? '#1E40AF' : '#1E293B', fontSize: '0.82rem' }}>
                          {s.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem', display: 'block', lineHeight: 1.3 }}>
                          {s.desc}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Paper>

            {/* Widget 2: Author Guidelines */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
                boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                <Avatar sx={{ bgcolor: '#F3E8FF', color: '#7E22CE', width: 32, height: 32, borderRadius: 2 }}>
                  <DescriptionIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  Author Guidelines
                </Typography>
              </Stack>

              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2, fontSize: '0.78rem' }}>
                Please read our <strong>Author Guidelines</strong> carefully before submission.
              </Typography>

              <Button
                fullWidth
                variant="outlined"
                endIcon={<OpenInNewIcon fontSize="small" />}
                href="/author-guidelines"
                target="_blank"
                sx={{
                  borderRadius: 2.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  borderColor: '#E2E8F0',
                  color: '#2563EB',
                }}
              >
                View Guidelines
              </Button>
            </Paper>

          </Stack>
        </Grid>

      </Grid>

      {/* LaTeX Modal */}
      <LatexEditorModal
        isOpen={showLatexModal}
        onClose={() => setShowLatexModal(false)}
        articleId={null}
        articleTitle={title || 'New Manuscript LaTeX Draft'}
        initialLatex={latexSource}
        readOnly={false}
        onSaved={(code) => {
          setLatexSource(code);
          toast.success('LaTeX source attached to submission!');
        }}
      />

    </Box>
  );
};

export default AuthorNewSubmission;
