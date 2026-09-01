import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  MenuBook as MenuBookIcon,
  PictureAsPdf as PdfIcon,
  FormatQuote as FormatQuoteIcon,
  Verified as VerifiedIcon,
  ContentCopy as ContentCopyIcon,
  Search as SearchIcon,
  OpenInNew as OpenInNewIcon,
  WorkspacePremium as CertificateIcon,
  Close as CloseIcon,
  NoteAdd as NoteAddIcon,
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
  AutoGraph as AutoGraphIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { apiFetch, resolveFileUrl } from '../../../utils/api';
import { toast } from 'react-toastify';

const AuthorPublications = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [citationModalArticle, setCitationModalArticle] = useState(null);
  const [certificateModalArticle, setCertificateModalArticle] = useState(null);
  const [citationFormat, setCitationFormat] = useState('APA');

  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    fetchPublications();
  }, [user.user_id]);

  const fetchPublications = async () => {
    try {
      if (!user.user_id) return;
      const res = await apiFetch(`/articles?author_id=${user.user_id}`);
      const allArticles = res.data || [];
      const published = allArticles.filter(a => a.status === 'published' || a.status === 'accepted');
      setArticles(published);
    } catch (err) {
      toast.error('Failed to load published articles');
    } finally {
      setLoading(false);
    }
  };

  const getCitationText = (article, format) => {
    const authorName = user.display_name || user.displayName || 'Author';
    const year = article.created_at ? new Date(article.created_at).getFullYear() : new Date().getFullYear();
    const vol = article.volume_number || '1';
    const iss = article.issue_number || '1';
    const title = article.title;
    const doi = article.doi ? `https://doi.org/${article.doi}` : '';

    switch (format) {
      case 'MLA':
        return `${authorName}. "${title}." The Literary Scientist, vol. ${vol}, no. ${iss}, ${year}. ${doi}`;
      case 'Chicago':
        return `${authorName}. "${title}." The Literary Scientist ${vol}, no. ${iss} (${year}). ${doi}`;
      case 'Harvard':
        return `${authorName}, ${year}. ${title}. The Literary Scientist, ${vol}(${iss}). ${doi}`;
      case 'BibTeX':
        return `@article{tls_${article.article_id},\n  author = {${authorName}},\n  title = {${title}},\n  journal = {The Literary Scientist},\n  volume = {${vol}},\n  number = {${iss}},\n  year = {${year}},\n  doi = {${article.doi || ''}}\n}`;
      case 'APA':
      default:
        return `${authorName} (${year}). ${title}. The Literary Scientist, ${vol}(${iss}). ${doi}`;
    }
  };

  const handleCopyCitation = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Citation copied to clipboard!');
  };

  const filtered = articles.filter(art => 
    art.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.keywords?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.abstract?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: 1150, mx: 'auto', p: { xs: 1, sm: 2, md: 3.5 } }}>
      
      {/* Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 3.5,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #1B382B 100%)',
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
                icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: '#34D399 !important' }} />}
                label="Certified Scholarly Records"
                size="small"
                sx={{
                  bgcolor: 'rgba(52, 211, 153, 0.15)',
                  color: '#34D399',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  borderRadius: 1.5,
                }}
              />
              <Chip
                label="Open Access CC BY 4.0"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: '#E2E8F0',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  borderRadius: 1.5,
                }}
              />
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.6 }}>
              My Publications & Archival Records
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.8, maxWidth: 650 }}>
              Verified repository of your peer-reviewed papers published in <em>The Literary Scientist</em>. Access DOI links, generate multi-style citations, and print publication certificates.
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              px: 4,
              py: 2.2,
              borderRadius: 3.5,
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#34D399' }}>
              {articles.length}
            </Typography>
            <Typography variant="caption" sx={{ color: '#E2E8F0', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.9 }}>
              Published Works
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Search & Metadata Bar */}
      <Grid container spacing={2} sx={{ mb: 3.5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search published articles by title, abstract or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: '#64748B' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2.5, bgcolor: '#FFFFFF' },
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', border: '1px solid #E2E8F0', borderRadius: 2.5, bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 800, fontSize: '0.7rem' }}>PEER-REVIEW STATUS</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#16A34A' }}>100% Certified</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', border: '1px solid #E2E8F0', borderRadius: 2.5, bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 800, fontSize: '0.7rem' }}>OPEN ACCESS LICENSE</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#2563EB' }}>CC BY 4.0</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Publications List */}
      {loading ? (
        <Box sx={{ p: 8, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2, color: '#64748B' }}>Loading your published articles...</Typography>
        </Box>
      ) : filtered.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: '1px dashed #CBD5E1', borderRadius: 4, bgcolor: '#FFFFFF' }}>
          <Avatar sx={{ bgcolor: '#EFF6FF', color: '#2563EB', width: 56, height: 56, mx: 'auto', mb: 2 }}>
            <MenuBookIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>No Published Articles Yet</Typography>
          <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 480, mx: 'auto', mt: 0.5, mb: 3 }}>
            You do not have any published articles in the journal repository yet. You can track your pending submissions in <strong>My Submission Status</strong>.
          </Typography>
          <Button
            variant="contained"
            startIcon={<NoteAddIcon />}
            onClick={() => navigate('/user/dashboard/new-submission')}
            sx={{ bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' }, borderRadius: 2.5, textTransform: 'none', fontWeight: 800, px: 3.5, py: 1 }}
          >
            Submit a Manuscript
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2.5}>
          {filtered.map((art) => (
            <Card
              key={art.article_id}
              elevation={0}
              sx={{
                border: '1px solid #E2E8F0',
                borderRadius: 4,
                bgcolor: '#FFFFFF',
                boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03)',
                transition: 'all 0.25s',
                '&:hover': { borderColor: '#10B981', boxShadow: '0 12px 28px rgba(16, 185, 129, 0.1)', transform: 'translateY(-2px)' },
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                  <Chip
                    size="small"
                    label={art.status === 'published' ? 'Published' : 'Accepted for Publication'}
                    color="success"
                    icon={<VerifiedIcon />}
                    sx={{ fontWeight: 800, borderRadius: 1.5 }}
                  />
                  {art.volume_number && (
                    <Chip
                      size="small"
                      label={`Vol. ${art.volume_number}, Issue ${art.issue_number || 1}`}
                      variant="outlined"
                      sx={{ fontWeight: 700, color: '#92400E', borderColor: '#FDE68A', bgcolor: '#FFFBEB', borderRadius: 1.5 }}
                    />
                  )}
                  {art.doi && (
                    <Chip
                      size="small"
                      label={`DOI: ${art.doi}`}
                      variant="outlined"
                      sx={{ fontFamily: 'monospace', fontWeight: 700, borderRadius: 1.5 }}
                    />
                  )}
                  <Typography variant="caption" sx={{ color: '#94A3B8', alignSelf: 'center', ml: 'auto', fontWeight: 600 }}>
                    {art.created_at ? new Date(art.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                  </Typography>
                </Stack>

                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1.2, lineHeight: 1.3 }}>
                  {art.title}
                </Typography>

                {art.abstract && (
                  <Typography variant="body2" sx={{ color: '#475569', fontStyle: 'italic', mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                    "{art.abstract}"
                  </Typography>
                )}

                {art.keywords && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2 }}>
                    {art.keywords.split(',').map((kw, idx) => kw.trim() && (
                      <Chip key={idx} label={`#${kw.trim()}`} size="small" sx={{ bgcolor: '#F8FAFC', fontSize: '0.75rem', color: '#64748B', borderRadius: 1.5 }} />
                    ))}
                  </Box>
                )}

                <Divider sx={{ my: 2, borderColor: '#F1F5F9' }} />

                {/* Actions Toolbar */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ sm: 'center' }}>
                  <Stack direction="row" spacing={1.2} flexWrap="wrap">
                    {art.manuscript_url && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<PdfIcon />}
                        href={resolveFileUrl(art.manuscript_url)}
                        target="_blank"
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem' }}
                      >
                        Official PDF
                      </Button>
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      startIcon={<FormatQuoteIcon />}
                      onClick={() => setCitationModalArticle(art)}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', borderColor: '#CBD5E1', color: '#334155' }}
                    >
                      Cite Article
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      startIcon={<CertificateIcon />}
                      onClick={() => setCertificateModalArticle(art)}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem' }}
                    >
                      Publication Certificate
                    </Button>
                  </Stack>

                  {art.doi && (
                    <Button
                      size="small"
                      color="primary"
                      endIcon={<OpenInNewIcon fontSize="small" />}
                      href={`https://doi.org/${art.doi}`}
                      target="_blank"
                      sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.82rem' }}
                    >
                      Crossref DOI Link
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Citation Dialog */}
      <Dialog
        open={!!citationModalArticle}
        onClose={() => setCitationModalArticle(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Cite this Manuscript</span>
          <IconButton size="small" onClick={() => setCitationModalArticle(null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {citationModalArticle && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#0F172A' }}>
                Select Citation Style:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
                {['APA', 'MLA', 'Chicago', 'Harvard', 'BibTeX'].map((fmt) => (
                  <Chip
                    key={fmt}
                    label={fmt}
                    clickable
                    color={citationFormat === fmt ? 'primary' : 'default'}
                    onClick={() => setCitationFormat(fmt)}
                    sx={{ fontWeight: 800, borderRadius: 2 }}
                  />
                ))}
              </Stack>

              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  bgcolor: '#F8FAFC',
                  borderRadius: 3,
                  fontFamily: citationFormat === 'BibTeX' ? 'monospace' : 'inherit',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  color: '#1E293B',
                  whiteSpace: citationFormat === 'BibTeX' ? 'pre-wrap' : 'normal',
                }}
              >
                {getCitationText(citationModalArticle, citationFormat)}
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            startIcon={<ContentCopyIcon />}
            onClick={() => handleCopyCitation(getCitationText(citationModalArticle, citationFormat))}
            sx={{ bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' }, borderRadius: 2.5, textTransform: 'none', fontWeight: 800, px: 3 }}
          >
            Copy Citation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Certificate of Publication Dialog */}
      <Dialog
        open={!!certificateModalArticle}
        onClose={() => setCertificateModalArticle(null)}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, overflow: 'hidden' } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#0F172A', color: '#fff', py: 2 }}>
          <span>Certificate of Publication</span>
          <IconButton size="small" onClick={() => setCertificateModalArticle(null)} sx={{ color: '#fff' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4, bgcolor: '#FAFAF9' }}>
          {certificateModalArticle && (
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 5 },
                textAlign: 'center',
                border: '8px double #C5A880',
                bgcolor: '#FFFFFF',
                borderRadius: 2,
              }}
            >
              <Typography variant="overline" sx={{ letterSpacing: 3, fontWeight: 900, color: '#C5A880', fontSize: '0.9rem' }}>
                THE LITERARY SCIENTIST
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#0F172A', mt: 1, fontFamily: 'serif' }}>
                Certificate of Publication
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5, fontStyle: 'italic' }}>
                ISSN: 3048-7366 (Online) • Peer-Reviewed & Open Access
              </Typography>

              <Divider sx={{ my: 3, borderColor: '#E2E8F0' }} />

              <Typography variant="body1" sx={{ color: '#475569', mb: 1 }}>
                This is to certify that the scholarly research article titled:
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 800, color: '#16A34A', my: 2, px: 2 }}>
                "{certificateModalArticle.title}"
              </Typography>

              <Typography variant="body1" sx={{ color: '#475569' }}>
                Authored by <strong>{user.display_name || user.displayName || 'Author'}</strong> has been peer-reviewed, accepted, and published in:
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mt: 1.5 }}>
                Volume {certificateModalArticle.volume_number || 'I'}, Issue {certificateModalArticle.issue_number || 'III'}
              </Typography>

              {certificateModalArticle.doi && (
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5 }}>
                  DOI: {certificateModalArticle.doi}
                </Typography>
              )}

              <Box sx={{ mt: 4, pt: 3, display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #E2E8F0' }}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A', display: 'block' }}>
                    Editor-in-Chief
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    The Literary Scientist
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A', display: 'block' }}>
                    Verification Identifier
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    TLS-PUB-{certificateModalArticle.article_id}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
            sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 800 }}
          >
            Print / Save as PDF
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AuthorPublications;
