import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  CircularProgress,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  TrackChanges as TrackChangesIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  EditNote as EditNoteIcon,
  FactCheck as FactCheckIcon,
  PictureAsPdf as PdfIcon,
  Functions as FunctionsIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  NoteAdd as NoteAddIcon,
  ArrowForward as ArrowForwardIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { apiFetch, resolveFileUrl } from '../../../utils/api';
import { toast } from 'react-toastify';
import LatexEditorModal from '../../../components/LatexEditorModal';

const statusSteps = [
  { label: 'Submission Received', desc: 'Screening & Plagiarism Check' },
  { label: 'Double-Blind Review', desc: 'Expert Peer Evaluation' },
  { label: 'Copyediting & Proofing', desc: 'Typesetting & Formatting' },
  { label: 'Editorial Decision', desc: 'Accepted for Volume & Issue' },
  { label: 'Published & Indexed', desc: 'Live with Official DOI' },
];

const getStepIndex = (status) => {
  switch (status) {
    case 'incomplete':
    case 'submitted': return 0;
    case 'under_review':
    case 'in_review': return 1;
    case 'copyediting': return 2;
    case 'accepted': return 3;
    case 'rejected': return 3;
    case 'published': return 4;
    default: return 0;
  }
};

const AuthorSubmissionStatus = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('ALL');
  const [revisionArticle, setRevisionArticle] = useState(null);
  const [revisionFile, setRevisionFile] = useState(null);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [submittingRevision, setSubmittingRevision] = useState(false);
  const [activeLatex, setActiveLatex] = useState(null);

  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    fetchSubmissions();
  }, [user.user_id]);

  const fetchSubmissions = async () => {
    try {
      if (!user.user_id) return;
      const res = await apiFetch(`/articles?author_id=${user.user_id}`);
      setArticles(res.data || []);
    } catch (err) {
      toast.error('Failed to load submission statuses');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadRevision = async () => {
    if (!revisionFile) {
      toast.error('Please select a revised manuscript document');
      return;
    }
    setSubmittingRevision(true);
    try {
      const fileData = new FormData();
      fileData.append('file', revisionFile);
      fileData.append('uploaded_by', user.user_id || 1);

      const docRes = await apiFetch('/docs', { method: 'POST', body: fileData });
      const docId = docRes.data?.doc_id;

      await apiFetch(`/articles/${revisionArticle.article_id}`, {
        method: 'PUT',
        body: {
          manuscript_pdf_id: docId,
          status: 'submitted',
          author_notes: revisionNotes,
        },
      });

      toast.success('Revised manuscript submitted successfully!');
      setRevisionArticle(null);
      setRevisionFile(null);
      setRevisionNotes('');
      fetchSubmissions();
    } catch (err) {
      toast.error('Failed to upload revision: ' + err.message);
    } finally {
      setSubmittingRevision(false);
    }
  };

  const filteredArticles = articles.filter((art) => {
    if (selectedTab === 'ALL') return true;
    if (selectedTab === 'ACTIVE') return ['submitted', 'under_review', 'in_review', 'copyediting'].includes(art.status);
    if (selectedTab === 'REVIEW') return ['under_review', 'in_review'].includes(art.status);
    if (selectedTab === 'COPYEDITING') return art.status === 'copyediting';
    if (selectedTab === 'PUBLISHED') return art.status === 'published';
    if (selectedTab === 'DRAFTS') return art.status === 'incomplete';
    return true;
  });

  const getStatusChip = (status) => {
    switch (status) {
      case 'published':
        return <Chip label="Published & Indexed" color="success" size="small" icon={<CheckCircleIcon />} sx={{ fontWeight: 800, borderRadius: 1.5 }} />;
      case 'accepted':
        return <Chip label="Accepted for Publication" color="success" variant="outlined" size="small" sx={{ fontWeight: 800, borderRadius: 1.5 }} />;
      case 'copyediting':
        return <Chip label="Copyediting & Proofing" color="secondary" size="small" sx={{ fontWeight: 800, borderRadius: 1.5 }} />;
      case 'under_review':
      case 'in_review':
        return <Chip label="Under Peer Review" color="warning" size="small" icon={<HourglassIcon />} sx={{ fontWeight: 800, borderRadius: 1.5 }} />;
      case 'rejected':
        return <Chip label="Declined / Revisions" color="error" size="small" icon={<WarningIcon />} sx={{ fontWeight: 800, borderRadius: 1.5 }} />;
      case 'incomplete':
        return <Chip label="Draft" color="default" size="small" sx={{ fontWeight: 800, borderRadius: 1.5 }} />;
      case 'submitted':
      default:
        return <Chip label="Submitted" color="primary" size="small" sx={{ fontWeight: 800, borderRadius: 1.5 }} />;
    }
  };

  return (
    <Box sx={{ maxWidth: 1150, mx: 'auto', p: { xs: 1, sm: 2, md: 3.5 } }}>
      
      {/* Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 3.5,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #1E3A5F 100%)',
          color: '#fff',
          boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2.5}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.2 }}>
              <Chip
                icon={<TrackChangesIcon sx={{ fontSize: '14px !important', color: '#60A5FA !important' }} />}
                label="Live Multi-Stage Tracker"
                size="small"
                sx={{
                  bgcolor: 'rgba(96, 165, 250, 0.15)',
                  color: '#60A5FA',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  borderRadius: 1.5,
                }}
              />
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.6 }}>
              My Submission Status
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.8, maxWidth: 650 }}>
              Live tracking through editorial screening, double-blind peer review, copyediting, proofreading, and journal publication.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<NoteAddIcon />}
            onClick={() => navigate('/user/dashboard/new-submission')}
            sx={{
              bgcolor: '#B91C1C',
              '&:hover': { bgcolor: '#991B1B' },
              borderRadius: 2.5,
              fontWeight: 800,
              textTransform: 'none',
              px: 3,
              py: 1,
              boxShadow: '0 4px 14px rgba(185, 28, 28, 0.4)',
            }}
          >
            + New Submission
          </Button>
        </Stack>
      </Paper>

      {/* Filter Tabs */}
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #E2E8F0',
          borderRadius: 3.5,
          mb: 3.5,
          bgcolor: '#FFFFFF',
          p: 0.5,
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={(e, val) => setSelectedTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 1,
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 800, fontSize: '0.85rem', minHeight: 48 },
            '& .Mui-selected': { color: '#0F172A' },
            '& .MuiTabs-indicator': { bgcolor: '#0F172A', height: 3, borderRadius: 1.5 },
          }}
        >
          <Tab label={`All Manuscripts (${articles.length})`} value="ALL" />
          <Tab label={`Active Pipelines (${articles.filter(a => ['submitted', 'under_review', 'in_review', 'copyediting'].includes(a.status)).length})`} value="ACTIVE" />
          <Tab label={`Under Review (${articles.filter(a => ['under_review', 'in_review'].includes(a.status)).length})`} value="REVIEW" />
          <Tab label={`Copyediting (${articles.filter(a => a.status === 'copyediting').length})`} value="COPYEDITING" />
          <Tab label={`Published (${articles.filter(a => a.status === 'published').length})`} value="PUBLISHED" />
          <Tab label={`Drafts (${articles.filter(a => a.status === 'incomplete').length})`} value="DRAFTS" />
        </Tabs>
      </Paper>

      {/* Manuscripts Status Cards List */}
      {loading ? (
        <Box sx={{ p: 8, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2, color: '#64748B' }}>Loading manuscript workflows...</Typography>
        </Box>
      ) : filteredArticles.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: '1px dashed #CBD5E1', borderRadius: 4, bgcolor: '#FFFFFF' }}>
          <Avatar sx={{ bgcolor: '#EFF6FF', color: '#2563EB', width: 56, height: 56, mx: 'auto', mb: 2 }}>
            <TrackChangesIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>No Submissions in this Category</Typography>
          <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 460, mx: 'auto', mt: 0.5, mb: 2.5 }}>
            No manuscripts currently match the selected status filter.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {filteredArticles.map((art) => {
            const stepIdx = getStepIndex(art.status);
            const progressPercent = Math.min(100, Math.round(((stepIdx + 1) / 5) * 100));

            return (
              <Card
                key={art.article_id}
                elevation={0}
                sx={{
                  border: '1px solid #E2E8F0',
                  borderRadius: 4,
                  bgcolor: '#FFFFFF',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03)',
                  transition: 'all 0.25s',
                  '&:hover': { borderColor: '#94A3B8', transform: 'translateY(-2px)' },
                }}
              >
                {/* Header Info Bar */}
                <Box sx={{ bgcolor: '#F8FAFC', px: { xs: 2.5, md: 3.5 }, py: 2.2, borderBottom: '1px solid #F1F5F9' }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1}>
                    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                      {getStatusChip(art.status)}
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>
                        ID #{art.article_id}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>•</Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                        Submitted on {art.created_at ? new Date(art.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#2563EB', bgcolor: '#EFF6FF', px: 1.5, py: 0.5, borderRadius: 2 }}>
                      Lifecycle Progress: {progressPercent}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{
                      mt: 1.5,
                      height: 6,
                      borderRadius: 3,
                      bgcolor: '#E2E8F0',
                      '& .MuiLinearProgress-bar': { bgcolor: art.status === 'published' ? '#10B981' : '#2563EB' },
                    }}
                  />
                </Box>

                <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1.2, lineHeight: 1.35 }}>
                    {art.title}
                  </Typography>

                  {art.abstract && (
                    <Typography variant="body2" sx={{ color: '#475569', fontStyle: 'italic', mb: 3, lineHeight: 1.6 }}>
                      "{art.abstract}"
                    </Typography>
                  )}

                  {/* Visual Stepper Tracker */}
                  <Box sx={{ my: 3.5, p: 3, bgcolor: '#F8FAFC', borderRadius: 3.5, border: '1px solid #E2E8F0' }}>
                    <Stepper activeStep={stepIdx} alternativeLabel>
                      {statusSteps.map((step, sIdx) => {
                        const isDone = sIdx < stepIdx;
                        const isCurrent = sIdx === stepIdx;

                        return (
                          <Step key={step.label} completed={isDone}>
                            <StepLabel>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: isCurrent ? '#2563EB' : isDone ? '#16A34A' : '#94A3B8', display: 'block' }}>
                                {step.label}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem', display: { xs: 'none', sm: 'block' }, mt: 0.3 }}>
                                {step.desc}
                              </Typography>
                            </StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </Box>

                  {/* Feedback Blocks */}
                  <Grid container spacing={2.5}>
                    {/* Editorial Assessment */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper variant="outlined" sx={{ p: 2.8, borderRadius: 3, bgcolor: '#F8FAFC', borderColor: '#E2E8F0', height: '100%' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: 0.8, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <EditNoteIcon fontSize="small" sx={{ color: '#2563EB' }} /> Editorial Assessment & Notes
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#475569', mt: 1.2, lineHeight: 1.55 }}>
                          {art.editor_notes || 'Your paper is currently undergoing regular editorial evaluation. You will receive updates directly here.'}
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Copyediting & Proofs */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Paper variant="outlined" sx={{ p: 2.8, borderRadius: 3, bgcolor: '#FAF5FF', borderColor: '#E9D5FF', height: '100%' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#7E22CE', textTransform: 'uppercase', letterSpacing: 0.8, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <FactCheckIcon fontSize="small" sx={{ color: '#9333EA' }} /> Copyediting & Proofreading
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#581C87', mt: 1.2, lineHeight: 1.55 }}>
                          {art.copyedit_notes || (art.status === 'copyediting' ? 'Proofreading, equation checks, and layout standardization in progress.' : 'Pending peer review completion.')}
                        </Typography>
                        {art.copyedit_url && (
                          <Button
                            size="small"
                            variant="text"
                            color="secondary"
                            startIcon={<DownloadIcon />}
                            href={resolveFileUrl(art.copyedit_url)}
                            target="_blank"
                            sx={{ mt: 1.2, textTransform: 'none', fontWeight: 800, p: 0 }}
                          >
                            Download Copyedited Proof PDF
                          </Button>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3, borderColor: '#F1F5F9' }} />

                  {/* Actions Toolbar */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ sm: 'center' }}>
                    <Stack direction="row" spacing={1.2} flexWrap="wrap">
                      {art.manuscript_url && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="inherit"
                          startIcon={<PdfIcon sx={{ color: '#EF4444' }} />}
                          href={resolveFileUrl(art.manuscript_url)}
                          target="_blank"
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', borderColor: '#CBD5E1', color: '#334155' }}
                        >
                          View Submitted File
                        </Button>
                      )}

                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        startIcon={<FunctionsIcon />}
                        onClick={() => setActiveLatex({ id: art.article_id, title: art.title, latex: art.latex_source || '' })}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem' }}
                      >
                        LaTeX Source
                      </Button>
                    </Stack>

                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      onClick={() => setRevisionArticle(art)}
                      sx={{
                        borderRadius: 2.5,
                        textTransform: 'none',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        bgcolor: '#0F172A',
                        '&:hover': { bgcolor: '#1E293B' },
                      }}
                    >
                      Submit Revision
                    </Button>
                  </Stack>

                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* Revision Upload Dialog */}
      <Dialog
        open={!!revisionArticle}
        onClose={() => setRevisionArticle(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Upload Revised Manuscript</span>
          <IconButton size="small" onClick={() => setRevisionArticle(null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {revisionArticle && (
            <Stack spacing={2.5}>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                Revising: <strong>{revisionArticle.title}</strong>
              </Typography>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A', display: 'block', mb: 1 }}>
                  Attach Revised Manuscript Document (.pdf, .docx, .doc) *
                </Typography>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setRevisionFile(e.target.files[0])}
                />
              </Box>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Author Response to Reviewers / Revision Notes"
                placeholder="Detail changes made in response to peer review evaluations..."
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                slotProps={{ input: { sx: { borderRadius: 2 } } }}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRevisionArticle(null)} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={submittingRevision}
            onClick={handleUploadRevision}
            sx={{ bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' }, borderRadius: 2, textTransform: 'none', fontWeight: 800 }}
          >
            {submittingRevision ? 'Uploading...' : 'Submit Revision'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* LaTeX Modal */}
      <LatexEditorModal
        isOpen={!!activeLatex}
        onClose={() => setActiveLatex(null)}
        articleId={activeLatex?.id}
        articleTitle={activeLatex?.title}
        initialLatex={activeLatex?.latex}
        readOnly={false}
        onSaved={() => {
          fetchSubmissions();
        }}
      />

    </Box>
  );
};

export default AuthorSubmissionStatus;
