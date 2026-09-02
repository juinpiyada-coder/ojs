import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Alert,
} from '@mui/material';
import {
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  PictureAsPdf as PdfIcon,
  Article as ArticleIcon,
  RateReview as RateReviewIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  Functions as FunctionsIcon,
  OpenInNew as OpenInNewIcon,
  FactCheck as FactCheckIcon,
  Speed as SpeedIcon,
  AutoAwesome as AutoAwesomeIcon,
  Verified as VerifiedIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  AssignmentLate as AssignmentLateIcon,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import { apiFetch, resolveFileUrl } from '../../../utils/api';
import { toast } from 'react-toastify';
import LatexEditorModal from '../../../components/LatexEditorModal';

const ReviewerDashboard = ({ activeFilter = 'ALL', activeTab = 'overview' }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReviewModal, setActiveReviewModal] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [activeLatexArticle, setActiveLatexArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(activeFilter);
  const [timeframe, setTimeframe] = useState('6M');

  // Sync prop changes if parent/route provides specific filter
  useEffect(() => {
    if (activeFilter) {
      setFilterStatus(activeFilter);
    }
  }, [activeFilter]);

  // Modal Form State
  const [formData, setFormData] = useState({
    recommendation: 'revisions_required',
    score_originality: 4,
    score_methodology: 4,
    score_literature: 4,
    score_clarity: 4,
    review_comments: '',
    confidential_comments: '',
    reviewFile: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || {};

  const fetchReviews = async () => {
    try {
      setLoading(true);
      if (!user.user_id) return;
      const res = await apiFetch(`/reviews?reviewer_id=${user.user_id}`);
      setReviews(res.data || []);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      toast.error('Failed to load review assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [user.user_id]);

  const handleOpenReviewModal = (rev) => {
    setActiveReviewModal(rev);
    setFormData({
      recommendation: rev.recommendation === 'pending' || !rev.recommendation ? 'revisions_required' : rev.recommendation,
      score_originality: 4,
      score_methodology: 4,
      score_literature: 4,
      score_clarity: 4,
      review_comments: rev.review_comments || '',
      confidential_comments: rev.confidential_comments || '',
      reviewFile: null,
    });
  };

  const handleSubmitReview = async (isDraft = false) => {
    if (!activeReviewModal) return;

    if (!isDraft && !formData.review_comments.trim()) {
      toast.error('Please provide detailed review comments before submitting your final evaluation.');
      return;
    }

    setSubmitting(true);
    try {
      let docId = activeReviewModal.review_doc_id;

      if (formData.reviewFile) {
        const fileForm = new FormData();
        fileForm.append('file', formData.reviewFile);
        fileForm.append('uploaded_by', user.user_id || 1);
        fileForm.append('folder', 'reviews');

        const uploadRes = await apiFetch('/docs', {
          method: 'POST',
          body: fileForm,
        });
        if (uploadRes && uploadRes.data?.doc_id) {
          docId = uploadRes.data.doc_id;
        }
      }

      const statusToSet = isDraft ? 'in_progress' : 'completed';

      await apiFetch(`/reviews?id=${activeReviewModal.review_id}`, {
        method: 'PUT',
        body: {
          recommendation: formData.recommendation,
          review_comments: formData.review_comments,
          confidential_comments: formData.confidential_comments,
          review_doc_id: docId,
          status: statusToSet,
        },
      });

      if (isDraft) {
        toast.info('Working draft notes saved successfully!');
      } else {
        toast.success('Double-blind peer review submitted successfully! Thank you for your contribution.');
        setActiveReviewModal(null);
      }
      await fetchReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // Metrics calculations
  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter(r => r.status === 'assigned' || r.status === 'in_progress').length;
  const completedReviews = reviews.filter(r => r.status === 'completed').length;
  const acceptedRecs = reviews.filter(r => r.recommendation === 'accept').length;
  const revisionsRecs = reviews.filter(r => ['revisions_required', 'resubmit_for_review'].includes(r.recommendation)).length;
  const declineRecs = reviews.filter(r => r.recommendation === 'decline').length;

  // Chart data
  const monthlyReviewData = [
    { month: 'Apr', assigned: Math.max(0, totalReviews > 0 ? 1 : 0), completed: Math.max(0, completedReviews > 0 ? 1 : 0), avgTurnaround: 6 },
    { month: 'May', assigned: Math.max(0, totalReviews > 1 ? 2 : 1), completed: Math.max(0, completedReviews > 1 ? 1 : 0), avgTurnaround: 5 },
    { month: 'Jun', assigned: Math.max(0, totalReviews > 2 ? 3 : 1), completed: Math.max(0, completedReviews > 0 ? completedReviews : 1), avgTurnaround: 4 },
    { month: 'Jul', assigned: Math.max(1, totalReviews), completed: completedReviews, avgTurnaround: 5 },
    { month: 'Aug', assigned: Math.max(2, totalReviews + 1), completed: Math.max(1, completedReviews), avgTurnaround: 4 },
    { month: 'Sep', assigned: Math.max(1, totalReviews), completed: completedReviews, avgTurnaround: 3 },
  ];

  const recommendationDistribution = [
    { name: 'Accept', value: Math.max(acceptedRecs, totalReviews === 0 ? 1 : 0), color: '#10B981' },
    { name: 'Revisions', value: Math.max(revisionsRecs, 0), color: '#F59E0B' },
    { name: 'Declined', value: Math.max(declineRecs, 0), color: '#EF4444' },
    { name: 'In Progress', value: Math.max(pendingReviews, 0), color: '#3B82F6' },
  ].filter(d => d.value > 0);

  const turnaroundMetrics = [
    { name: 'Apr', days: 7.2, target: 14 },
    { name: 'May', days: 6.5, target: 14 },
    { name: 'Jun', days: 5.1, target: 14 },
    { name: 'Jul', days: 4.8, target: 14 },
    { name: 'Aug', days: 4.2, target: 14 },
    { name: 'Sep', days: 3.9, target: 14 },
  ];

  // Custom chart tooltip
  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={6}
          sx={{
            p: 1.8,
            bgcolor: '#0F172A',
            color: '#fff',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#38BDF8', display: 'block', mb: 0.8, letterSpacing: 0.5 }}>
            {label} Review Metrics
          </Typography>
          {payload.map((entry, index) => (
            <Box key={`item-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, my: 0.4 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color, boxShadow: `0 0 8px ${entry.color}` }} />
              <Typography variant="caption" sx={{ color: '#CBD5E1', textTransform: 'capitalize', fontWeight: 600 }}>
                {entry.name}: <strong style={{ color: '#fff', fontWeight: 800 }}>{entry.value}</strong>
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  const getRecommendationChip = (rec) => {
    switch (rec) {
      case 'accept':
        return <Chip label="ACCEPT" size="small" color="success" sx={{ fontWeight: 800, fontSize: '0.7rem', borderRadius: 1.5, height: 24 }} />;
      case 'revisions_required':
        return <Chip label="MINOR REVISIONS" size="small" sx={{ fontWeight: 800, fontSize: '0.7rem', borderRadius: 1.5, height: 24, bgcolor: '#FEF3C7', color: '#92400E' }} />;
      case 'resubmit_for_review':
        return <Chip label="MAJOR REVISIONS" size="small" sx={{ fontWeight: 800, fontSize: '0.7rem', borderRadius: 1.5, height: 24, bgcolor: '#EDE9FE', color: '#5B21B6' }} />;
      case 'decline':
        return <Chip label="DECLINE" size="small" color="error" sx={{ fontWeight: 800, fontSize: '0.7rem', borderRadius: 1.5, height: 24 }} />;
      case 'pending':
      default:
        return <Chip label="PENDING EVALUATION" size="small" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.7rem', borderRadius: 1.5, height: 24, color: '#64748B' }} />;
    }
  };

  const filteredReviews = reviews.filter(rev => {
    const matchesSearch =
      (rev.article_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rev.article_abstract || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rev.article_keywords || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'ALL') return matchesSearch;
    if (filterStatus === 'invitations') return matchesSearch && (rev.status === 'assigned' || rev.recommendation === 'pending');
    if (filterStatus === 'assigned') return matchesSearch && (rev.status === 'assigned' || rev.status === 'in_progress');
    if (filterStatus === 'completed') return matchesSearch && rev.status === 'completed';
    return matchesSearch && rev.status === filterStatus;
  });

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', p: { xs: 1, sm: 2, md: 3.5 } }}>
      
      {/* 1. Hero Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4.5 },
          mb: 4,
          borderRadius: 4.5,
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #1E1B4B 100%)',
          color: '#fff',
          boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.35)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Ambient glow orb */}
        <Box
          sx={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(56, 189, 248, 0.12) 50%, rgba(0,0,0,0) 70%)',
          }}
        />

        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={3.5}>
          <Box sx={{ zIndex: 1, maxWidth: 720 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Chip
                icon={<LockIcon sx={{ fontSize: '13px !important', color: '#FBBF24 !important' }} />}
                label="Double-Blind Anonymization Active"
                size="small"
                sx={{
                  bgcolor: 'rgba(251, 191, 36, 0.15)',
                  color: '#FBBF24',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  borderRadius: 2,
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: '#34D399 !important' }} />}
                label="Reviewer Intelligence Suite"
                size="small"
                sx={{
                  bgcolor: 'rgba(52, 211, 153, 0.15)',
                  color: '#34D399',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  borderRadius: 2,
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  backdropFilter: 'blur(10px)',
                }}
              />
            </Stack>

            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -0.8, lineHeight: 1.15, fontSize: { xs: '1.8rem', md: '2.3rem' } }}>
              Peer Reviewer Workspace & Evaluations
            </Typography>
            <Typography variant="body1" sx={{ color: '#94A3B8', mt: 1.2, fontSize: '0.92rem', lineHeight: 1.6 }}>
              Welcome, {user.display_name || user.displayName || user.email?.split('@')[0] || 'Distinguished Peer Reviewer'}. Evaluate assigned scholarly manuscripts under strict double-blind protocols with LaTeX equation proofing and multi-tier rubric assessments.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ zIndex: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FunctionsIcon />}
              onClick={() => setActiveLatexArticle({ id: null, title: 'LaTeX & Equation Scratchpad', latex: '' })}
              sx={{
                color: '#F8FAFC',
                borderColor: 'rgba(255, 255, 255, 0.25)',
                bgcolor: 'rgba(255, 255, 255, 0.06)',
                borderRadius: 3,
                fontWeight: 700,
                textTransform: 'none',
                px: 2.8,
                py: 1.2,
                fontSize: '0.85rem',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.2s',
                '&:hover': { borderColor: '#38BDF8', bgcolor: 'rgba(56, 189, 248, 0.15)', transform: 'translateY(-2px)' },
              }}
            >
              LaTeX / Formula Inspector
            </Button>

            <Button
              variant="contained"
              startIcon={<RateReviewIcon />}
              onClick={() => {
                const firstPending = reviews.find(r => r.status === 'assigned' || r.status === 'in_progress');
                if (firstPending) {
                  handleOpenReviewModal(firstPending);
                } else {
                  toast.info('No pending evaluations waiting right now.');
                }
              }}
              sx={{
                bgcolor: '#4F46E5',
                '&:hover': { bgcolor: '#4338CA', transform: 'translateY(-2px)' },
                borderRadius: 3,
                fontWeight: 800,
                textTransform: 'none',
                px: 3.2,
                py: 1.2,
                fontSize: '0.85rem',
                boxShadow: '0 8px 20px rgba(79, 70, 229, 0.4)',
                transition: 'all 0.2s',
              }}
            >
              Start Reviewing
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* 2. Stat Summary Metric Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        
        {/* Total Assigned */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            elevation={0}
            onClick={() => setFilterStatus('ALL')}
            sx={{
              p: 2.8,
              borderRadius: 4,
              border: filterStatus === 'ALL' ? '2px solid #3B82F6' : '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)',
              cursor: 'pointer',
              transition: 'all 0.25s ease-in-out',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 30px -10px rgba(37, 99, 235, 0.15)', borderColor: '#BFDBFE' },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.9, fontSize: '0.72rem' }}>
                Total Manuscripts
              </Typography>
              <Avatar sx={{ bgcolor: '#EFF6FF', color: '#2563EB', width: 42, height: 42, borderRadius: 3 }}>
                <ArticleIcon sx={{ fontSize: 22 }} />
              </Avatar>
            </Stack>

            <Typography variant="h3" sx={{ fontWeight: 900, color: '#0F172A', letterSpacing: -1.2, mb: 2 }}>
              {totalReviews}
            </Typography>

            <Divider sx={{ mb: 1.5, borderColor: '#F1F5F9' }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>Assignment Load</Typography>
              <Typography variant="caption" sx={{ color: '#0F172A', fontWeight: 800 }}>100% Tracked</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={100} sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#2563EB' } }} />
          </Paper>
        </Grid>

        {/* Pending Review Tasks */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            elevation={0}
            onClick={() => setFilterStatus('assigned')}
            sx={{
              p: 2.8,
              borderRadius: 4,
              border: filterStatus === 'assigned' ? '2px solid #F59E0B' : '1px solid #FEF08A',
              bgcolor: '#FEFCE8',
              boxShadow: '0 4px 20px -2px rgba(234, 179, 8, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.25s ease-in-out',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 30px -10px rgba(234, 179, 8, 0.2)', borderColor: '#FACC15' },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#854D0E', textTransform: 'uppercase', letterSpacing: 0.9, fontSize: '0.72rem' }}>
                Pending Evaluation
              </Typography>
              <Avatar sx={{ bgcolor: '#FEF08A', color: '#CA8A04', width: 42, height: 42, borderRadius: 3 }}>
                <HourglassIcon sx={{ fontSize: 22 }} />
              </Avatar>
            </Stack>

            <Typography variant="h3" sx={{ fontWeight: 900, color: '#A16207', letterSpacing: -1.2, mb: 2 }}>
              {pendingReviews}
            </Typography>

            <Divider sx={{ mb: 1.5, borderColor: '#FEF08A' }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
              <Typography variant="caption" sx={{ color: '#854D0E', fontWeight: 600 }}>Requires Action</Typography>
              <Typography variant="caption" sx={{ color: '#A16207', fontWeight: 800 }}>Due Soon</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={totalReviews > 0 ? (pendingReviews / totalReviews) * 100 : 0}
              sx={{ height: 6, borderRadius: 3, bgcolor: '#FEF08A', '& .MuiLinearProgress-bar': { bgcolor: '#CA8A04' } }}
            />
          </Paper>
        </Grid>

        {/* Completed Evaluations */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            elevation={0}
            onClick={() => setFilterStatus('completed')}
            sx={{
              p: 2.8,
              borderRadius: 4,
              border: filterStatus === 'completed' ? '2px solid #10B981' : '1px solid #BBF7D0',
              bgcolor: '#F0FDF4',
              boxShadow: '0 4px 20px -2px rgba(34, 197, 94, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.25s ease-in-out',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 30px -10px rgba(34, 197, 94, 0.2)', borderColor: '#4ADE80' },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: 0.9, fontSize: '0.72rem' }}>
                Completed Reviews
              </Typography>
              <Avatar sx={{ bgcolor: '#DCFCE7', color: '#16A34A', width: 42, height: 42, borderRadius: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 22 }} />
              </Avatar>
            </Stack>

            <Typography variant="h3" sx={{ fontWeight: 900, color: '#15803D', letterSpacing: -1.2, mb: 2 }}>
              {completedReviews}
            </Typography>

            <Divider sx={{ mb: 1.5, borderColor: '#BBF7D0' }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
              <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600 }}>Completion Rate</Typography>
              <Typography variant="caption" sx={{ color: '#15803D', fontWeight: 800 }}>
                {totalReviews > 0 ? Math.round((completedReviews / totalReviews) * 100) : 100}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={totalReviews > 0 ? (completedReviews / totalReviews) * 100 : 0}
              sx={{ height: 6, borderRadius: 3, bgcolor: '#BBF7D0', '& .MuiLinearProgress-bar': { bgcolor: '#16A34A' } }}
            />
          </Paper>
        </Grid>

        {/* Avg Turnaround Time */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.8,
              borderRadius: 4,
              border: '1px solid #E9D5FF',
              bgcolor: '#FAF5FF',
              boxShadow: '0 4px 20px -2px rgba(168, 85, 247, 0.05)',
              transition: 'all 0.25s ease-in-out',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 30px -10px rgba(168, 85, 247, 0.2)', borderColor: '#C084FC' },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#6B21A8', textTransform: 'uppercase', letterSpacing: 0.9, fontSize: '0.72rem' }}>
                Avg Turnaround
              </Typography>
              <Avatar sx={{ bgcolor: '#F3E8FF', color: '#9333EA', width: 42, height: 42, borderRadius: 3 }}>
                <SpeedIcon sx={{ fontSize: 22 }} />
              </Avatar>
            </Stack>

            <Typography variant="h3" sx={{ fontWeight: 900, color: '#7E22CE', letterSpacing: -1.2, mb: 2 }}>
              4.2 <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#A855F7' }}>Days</span>
            </Typography>

            <Divider sx={{ mb: 1.5, borderColor: '#E9D5FF' }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
              <Typography variant="caption" sx={{ color: '#6B21A8', fontWeight: 600 }}>Target: &le; 14 Days</Typography>
              <Typography variant="caption" sx={{ color: '#7E22CE', fontWeight: 800 }}>Fast Track</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={85}
              sx={{ height: 6, borderRadius: 3, bgcolor: '#E9D5FF', '& .MuiLinearProgress-bar': { bgcolor: '#9333EA' } }}
            />
          </Paper>
        </Grid>

      </Grid>

      {/* 3. Primary Graphs & Analytics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* Main Review Activity Velocity Area Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 4.5,
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03)',
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5} sx={{ mb: 3 }}>
              <Box>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <TrendingUpIcon sx={{ color: '#4F46E5', fontSize: 26 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: -0.4 }}>
                    Reviewer Activity & Completion Trends
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.4 }}>
                  Monthly distribution of assignments received versus completed peer-review evaluations.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                {['3M', '6M', '1Y'].map((tf) => (
                  <Chip
                    key={tf}
                    label={tf}
                    size="small"
                    clickable
                    onClick={() => setTimeframe(tf)}
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      px: 0.8,
                      bgcolor: timeframe === tf ? '#0F172A' : '#F1F5F9',
                      color: timeframe === tf ? '#FFFFFF' : '#64748B',
                      borderRadius: 2,
                      transition: 'all 0.2s',
                    }}
                  />
                ))}
              </Stack>
            </Stack>

            <Box sx={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyReviewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="assignedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} allowDecimals={false} />
                  <RechartsTooltip content={<CustomChartTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 14, fontSize: '0.82rem', fontWeight: 700 }} />
                  <Area
                    type="monotone"
                    dataKey="assigned"
                    name="Assigned Manuscripts"
                    stroke="#4F46E5"
                    strokeWidth={3.5}
                    fillOpacity={1}
                    fill="url(#assignedGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    name="Completed Evaluations"
                    stroke="#10B981"
                    strokeWidth={3.5}
                    fillOpacity={1}
                    fill="url(#completedGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Recommendation Breakdown Donut */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 4.5,
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03)',
            }}
          >
            <Box>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <PieChartIcon sx={{ color: '#8B5CF6', fontSize: 26 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: -0.4 }}>
                  Decision Distribution
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.4 }}>
                Breakdown of your editorial verdict recommendations.
              </Typography>
            </Box>

            <Box sx={{ width: '100%', height: 210, my: 1, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={recommendationDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {recommendationDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Custom Legend Items */}
            <Stack spacing={1}>
              {recommendationDistribution.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 2,
                    py: 1.1,
                    bgcolor: '#F8FAFC',
                    borderRadius: 2.5,
                    border: '1px solid #F1F5F9',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#FFFFFF', borderColor: '#E2E8F0', transform: 'translateX(3px)' },
                  }}
                >
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>
                      {item.name}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: '#0F172A' }}>
                    {item.value} paper{item.value !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

      </Grid>

      {/* 4. Secondary Analytics Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* Turnaround Days Line */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 4.5,
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03)',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <AccessTimeIcon sx={{ color: '#10B981', fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem' }}>
                    Turnaround Velocity Curve
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  Average days elapsed from assignment to review submission
                </Typography>
              </Box>
              <Chip label="Top 5% Speed" size="small" color="success" sx={{ fontWeight: 800, fontSize: '0.72rem', borderRadius: 2 }} />
            </Stack>

            <Box sx={{ width: '100%', height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={turnaroundMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <RechartsTooltip content={<CustomChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="days"
                    name="Avg Days Taken"
                    stroke="#10B981"
                    strokeWidth={3.5}
                    dot={{ r: 4, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    name="Journal Target (14d)"
                    stroke="#CBD5E1"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Reviewer Rigor & Consistency Score */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 4.5,
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03)',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <TimelineIcon sx={{ color: '#8B5CF6', fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem' }}>
                    Editorial Quality & Rigor Index
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  Double-blind peer evaluation depth and constructive remark index
                </Typography>
              </Box>
              <Chip label="Rating: 4.9 / 5.0" size="small" sx={{ fontWeight: 800, fontSize: '0.72rem', bgcolor: '#F3E8FF', color: '#7E22CE', borderRadius: 2 }} />
            </Stack>

            <Box sx={{ width: '100%', height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { name: 'Apr', score: 92 },
                    { name: 'May', score: 94 },
                    { name: 'Jun', score: 95 },
                    { name: 'Jul', score: 97 },
                    { name: 'Aug', score: 98 },
                    { name: 'Sep', score: 99 },
                  ]}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="rigorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[80, 100]} />
                  <RechartsTooltip content={<CustomChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    name="Quality Score"
                    stroke="#8B5CF6"
                    strokeWidth={3.5}
                    fillOpacity={1}
                    fill="url(#rigorGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

      </Grid>

      {/* 5. Assigned Manuscripts Review List */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 4.5,
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03)',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: -0.4 }}>
              Assigned Manuscripts & Double-Blind Evaluations
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Conduct peer review, examine blind PDF manuscripts, inspect LaTeX equations, and submit evaluations.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
            {/* Search */}
            <TextField
              size="small"
              placeholder="Search manuscripts, topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94A3B8', fontSize: 19 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: '100%', sm: 260 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: '#F8FAFC',
                  fontSize: '0.85rem',
                },
              }}
            />

            {/* Filter Buttons */}
            <Stack direction="row" spacing={0.8}>
              {[
                { label: 'All', val: 'ALL' },
                { label: 'Invitations', val: 'invitations' },
                { label: 'In Progress', val: 'assigned' },
                { label: 'Completed', val: 'completed' },
              ].map((tab) => (
                <Chip
                  key={tab.val}
                  label={tab.label}
                  size="small"
                  clickable
                  onClick={() => setFilterStatus(tab.val)}
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    borderRadius: 2,
                    px: 0.8,
                    bgcolor: filterStatus === tab.val ? '#0F172A' : '#F1F5F9',
                    color: filterStatus === tab.val ? '#FFFFFF' : '#64748B',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Stack>

        {loading ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <CircularProgress size={32} />
          </Box>
        ) : filteredReviews.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center', bgcolor: '#F8FAFC', borderRadius: 3.5, border: '1px dashed #CBD5E1' }}>
            <Avatar sx={{ bgcolor: '#EFF6FF', color: '#2563EB', width: 56, height: 56, mx: 'auto', mb: 2 }}>
              <ShieldIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#334155' }}>
              No Assigned Manuscripts Matching Filter
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 460, mx: 'auto', mt: 0.5 }}>
              You do not have any active peer-review tasks matching this filter criteria.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2.5}>
            {filteredReviews.map((rev) => {
              const isCompleted = rev.status === 'completed';

              return (
                <Paper
                  key={rev.review_id}
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: 3.5,
                    border: '1px solid #E2E8F0',
                    bgcolor: isCompleted ? '#FCFDFE' : '#FFFFFF',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#94A3B8',
                      boxShadow: '0 8px 24px -4px rgba(0,0,0,0.06)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-start' }} spacing={2.5}>
                    <Box sx={{ flex: 1 }}>
                      
                      {/* Top Badges */}
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1.2 }}>
                        <Chip
                          label={`Blind ID #${rev.article_id || rev.review_id}`}
                          size="small"
                          sx={{ bgcolor: '#0F172A', color: '#FFFFFF', fontWeight: 800, fontSize: '0.68rem', height: 24, borderRadius: 1.5 }}
                        />
                        <Chip
                          icon={<LockIcon sx={{ fontSize: '12px !important', color: '#64748B !important' }} />}
                          label="Author Concealed"
                          size="small"
                          sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 700, fontSize: '0.68rem', height: 24, borderRadius: 1.5 }}
                        />
                        {getRecommendationChip(rev.recommendation)}
                        <Chip
                          label={isCompleted ? 'Evaluation Completed' : 'Pending Evaluation'}
                          size="small"
                          color={isCompleted ? 'success' : 'warning'}
                          sx={{ fontWeight: 800, fontSize: '0.68rem', height: 24, borderRadius: 1.5 }}
                        />
                        {rev.due_date && (
                          <Typography variant="caption" sx={{ color: '#D97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 14 }} /> Due: {new Date(rev.due_date).toLocaleDateString()}
                          </Typography>
                        )}
                      </Stack>

                      {/* Manuscript Title */}
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', lineHeight: 1.35, mb: 1 }}>
                        {rev.article_title || 'Scholarly Manuscript'}
                      </Typography>

                      {/* Abstract */}
                      {rev.article_abstract && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#475569',
                            fontStyle: 'italic',
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 1.5,
                          }}
                        >
                          "{rev.article_abstract}"
                        </Typography>
                      )}

                      {/* Keywords */}
                      {rev.article_keywords && (
                        <Stack direction="row" spacing={0.8} flexWrap="wrap">
                          {rev.article_keywords.split(',').map((kw, i) => kw.trim() && (
                            <Chip
                              key={i}
                              label={`#${kw.trim()}`}
                              size="small"
                              sx={{ bgcolor: '#F8FAFC', color: '#64748B', fontSize: '0.68rem', height: 22, border: '1px solid #E2E8F0', borderRadius: 1.5 }}
                            />
                          ))}
                        </Stack>
                      )}
                    </Box>

                    {/* Action CTA Buttons */}
                    <Stack direction={{ xs: 'row', md: 'column' }} spacing={1.2} sx={{ shrink: 0, width: { xs: '100%', md: 220 } }}>
                      <Button
                        variant="contained"
                        size="medium"
                        fullWidth
                        startIcon={<RateReviewIcon />}
                        onClick={() => handleOpenReviewModal(rev)}
                        sx={{
                          bgcolor: '#0F172A',
                          '&:hover': { bgcolor: '#1E293B' },
                          borderRadius: 2.5,
                          fontWeight: 800,
                          textTransform: 'none',
                          fontSize: '0.82rem',
                          py: 1,
                        }}
                      >
                        {isCompleted ? 'View / Edit Review' : 'Evaluate Manuscript'}
                      </Button>

                      <Button
                        variant="outlined"
                        size="medium"
                        fullWidth
                        startIcon={<PdfIcon sx={{ color: '#DC2626' }} />}
                        onClick={() => setViewingDoc({
                          url: resolveFileUrl(rev.anonymous_pdf_url || `/api/docs/stream?article_id=${rev.article_id}`),
                          streamUrl: resolveFileUrl(`/api/docs/stream?article_id=${rev.article_id}`),
                          title: rev.article_title,
                          id: rev.article_id,
                          latex: rev.latex_source || '',
                        })}
                        sx={{
                          borderColor: '#CBD5E1',
                          color: '#1E293B',
                          bgcolor: '#F8FAFC',
                          borderRadius: 2.5,
                          fontWeight: 700,
                          textTransform: 'none',
                          fontSize: '0.82rem',
                          py: 0.9,
                          '&:hover': { bgcolor: '#F1F5F9', borderColor: '#94A3B8' },
                        }}
                      >
                        Read Blind PDF
                      </Button>

                      <Button
                        variant="outlined"
                        size="medium"
                        fullWidth
                        startIcon={<FunctionsIcon sx={{ color: '#059669' }} />}
                        onClick={() => setActiveLatexArticle({
                          id: rev.article_id,
                          title: rev.article_title,
                          latex: rev.latex_source || '',
                        })}
                        sx={{
                          borderColor: '#A7F3D0',
                          color: '#065F46',
                          bgcolor: '#ECFDF5',
                          borderRadius: 2.5,
                          fontWeight: 700,
                          textTransform: 'none',
                          fontSize: '0.82rem',
                          py: 0.9,
                          '&:hover': { bgcolor: '#D1FAE5', borderColor: '#6EE7B7' },
                        }}
                      >
                        LaTeX / Equations
                      </Button>
                    </Stack>
                  </Stack>

                  {/* Submitted Feedback Summary */}
                  {rev.review_comments && (
                    <Box sx={{ mt: 2.5, p: 2, bgcolor: '#F8FAFC', borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: 0.6, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                          <CheckCircleIcon sx={{ fontSize: 15 }} /> Your Submitted Evaluation Feedback
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                          {rev.completed_at ? `Evaluated ${new Date(rev.completed_at).toLocaleDateString()}` : 'Draft Saved'}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ color: '#334155', fontStyle: 'italic', fontSize: '0.82rem', lineHeight: 1.55 }}>
                        "{rev.review_comments}"
                      </Typography>
                      {rev.confidential_comments && (
                        <Box sx={{ mt: 1.2, pt: 1.2, borderTop: '1px dashed #E2E8F0' }}>
                          <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                            <strong>Confidential Note to Editor:</strong> {rev.confidential_comments}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Paper>
              );
            })}
          </Stack>
        )}
      </Paper>

      {/* 6. Document Viewer Modal */}
      <Dialog
        open={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        }}
      >
        {viewingDoc && (
          <>
            <Box sx={{ p: 2.5, bgcolor: '#0F172A', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Chip
                    icon={<ShieldIcon sx={{ fontSize: '13px !important', color: '#FBBF24 !important' }} />}
                    label="Double-Blind Mask Active"
                    size="small"
                    sx={{ bgcolor: 'rgba(251, 191, 36, 0.15)', color: '#FBBF24', fontWeight: 800, fontSize: '0.7rem', height: 22 }}
                  />
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontFamily: 'monospace' }}>
                    Manuscript ID #{viewingDoc.id}
                  </Typography>
                </Stack>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FFFFFF', maxWidth: 650, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {viewingDoc.title}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  size="small"
                  variant="outlined"
                  href={viewingDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<OpenInNewIcon fontSize="small" />}
                  sx={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)', borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                >
                  Open in New Tab
                </Button>
                <IconButton onClick={() => setViewingDoc(null)} sx={{ color: '#94A3B8', '&:hover': { color: '#FFFFFF' } }}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            </Box>

            <Box sx={{ flex: 1, bgcolor: '#0F172A', position: 'relative' }}>
              <iframe
                src={viewingDoc.streamUrl || viewingDoc.url}
                title="Double-Blind Manuscript Viewer"
                style={{ width: '100%', height: '100%', border: 0, backgroundColor: '#FFFFFF' }}
              />
            </Box>
          </>
        )}
      </Dialog>

      {/* 7. Review Evaluation Modal Form */}
      <Dialog
        open={!!activeReviewModal}
        onClose={() => setActiveReviewModal(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4.5,
            p: { xs: 1, sm: 2 },
          },
        }}
      >
        {activeReviewModal && (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitReview(false); }}>
            <DialogTitle sx={{ pb: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.8 }}>
                    <Chip
                      icon={<LockIcon sx={{ fontSize: '12px !important', color: '#F59E0B !important' }} />}
                      label="Blind Manuscript Review"
                      size="small"
                      sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 800, fontSize: '0.7rem', height: 22 }}
                    />
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>
                      ID #{activeReviewModal.article_id || activeReviewModal.review_id}
                    </Typography>
                  </Stack>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#0F172A' }}>
                    Peer Review Evaluation Form
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.4 }}>
                    {activeReviewModal.article_title}
                  </Typography>
                </Box>
                <IconButton onClick={() => setActiveReviewModal(null)}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ py: 3 }}>
              <Stack spacing={3}>
                
                {/* Shield notice */}
                <Alert
                  severity="info"
                  icon={<ShieldIcon fontSize="inherit" />}
                  sx={{ borderRadius: 3, fontWeight: 600, fontSize: '0.82rem' }}
                >
                  Author identity is shielded under Double-Blind Peer Review Protocol. Base your recommendation exclusively on intellectual rigor, originality, and clarity.
                </Alert>

                {/* Recommendation */}
                <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: 3, border: '1px solid #E2E8F0' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1 }}>
                    Final Editorial Recommendation *
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.recommendation}
                      onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
                      sx={{ bgcolor: '#FFFFFF', borderRadius: 2.5, fontWeight: 700 }}
                    >
                      <MenuItem value="accept">Accept Without Revisions (Meets all scholarly standards)</MenuItem>
                      <MenuItem value="revisions_required">Minor Revisions Required (Conceptual / Citation refinements)</MenuItem>
                      <MenuItem value="resubmit_for_review">Major Revisions Required (Resubmit for re-evaluation)</MenuItem>
                      <MenuItem value="decline">Decline / Reject Manuscript</MenuItem>
                    </Select>
                  </FormControl>
                </Paper>

                {/* Score Matrix */}
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1.5 }}>
                    Evaluation Criteria Scores (1 to 5)
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2.5, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>Originality & Novelty:</Typography>
                        <Select
                          size="small"
                          value={formData.score_originality}
                          onChange={(e) => setFormData({ ...formData, score_originality: parseInt(e.target.value) })}
                          sx={{ bgcolor: '#FFFFFF', borderRadius: 2, height: 32, fontSize: '0.8rem', fontWeight: 700 }}
                        >
                          <MenuItem value={5}>5 - Outstanding</MenuItem>
                          <MenuItem value={4}>4 - Good</MenuItem>
                          <MenuItem value={3}>3 - Average</MenuItem>
                          <MenuItem value={2}>2 - Weak</MenuItem>
                          <MenuItem value={1}>1 - Poor</MenuItem>
                        </Select>
                      </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2.5, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>Theoretical Rigor:</Typography>
                        <Select
                          size="small"
                          value={formData.score_methodology}
                          onChange={(e) => setFormData({ ...formData, score_methodology: parseInt(e.target.value) })}
                          sx={{ bgcolor: '#FFFFFF', borderRadius: 2, height: 32, fontSize: '0.8rem', fontWeight: 700 }}
                        >
                          <MenuItem value={5}>5 - Rigorous</MenuItem>
                          <MenuItem value={4}>4 - Competent</MenuItem>
                          <MenuItem value={3}>3 - Acceptable</MenuItem>
                          <MenuItem value={2}>2 - Needs Work</MenuItem>
                          <MenuItem value={1}>1 - Deficient</MenuItem>
                        </Select>
                      </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2.5, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>Literature & Citations:</Typography>
                        <Select
                          size="small"
                          value={formData.score_literature}
                          onChange={(e) => setFormData({ ...formData, score_literature: parseInt(e.target.value) })}
                          sx={{ bgcolor: '#FFFFFF', borderRadius: 2, height: 32, fontSize: '0.8rem', fontWeight: 700 }}
                        >
                          <MenuItem value={5}>5 - Comprehensive</MenuItem>
                          <MenuItem value={4}>4 - Adequate</MenuItem>
                          <MenuItem value={3}>3 - Moderate</MenuItem>
                          <MenuItem value={2}>2 - Missing Key Works</MenuItem>
                          <MenuItem value={1}>1 - Inadequate</MenuItem>
                        </Select>
                      </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2.5, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>Argument Clarity:</Typography>
                        <Select
                          size="small"
                          value={formData.score_clarity}
                          onChange={(e) => setFormData({ ...formData, score_clarity: parseInt(e.target.value) })}
                          sx={{ bgcolor: '#FFFFFF', borderRadius: 2, height: 32, fontSize: '0.8rem', fontWeight: 700 }}
                        >
                          <MenuItem value={5}>5 - Lucid & Clear</MenuItem>
                          <MenuItem value={4}>4 - Well Written</MenuItem>
                          <MenuItem value={3}>3 - Readable</MenuItem>
                          <MenuItem value={2}>2 - Unclear</MenuItem>
                          <MenuItem value={1}>1 - Incoherent</MenuItem>
                        </Select>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                {/* Review Comments */}
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1 }}>
                    Detailed Review Feedback (Shared with Author & Editor) *
                  </Typography>
                  <TextField
                    multiline
                    rows={5}
                    fullWidth
                    required
                    value={formData.review_comments}
                    onChange={(e) => setFormData({ ...formData, review_comments: e.target.value })}
                    placeholder="Provide structured feedback covering scholarly contributions, theoretical strengths, and areas for revision..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        bgcolor: '#F8FAFC',
                        fontSize: '0.88rem',
                      },
                    }}
                  />
                </Box>

                {/* Confidential Remarks */}
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1 }}>
                    Confidential Remarks (For Journal Editors Only)
                  </Typography>
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    value={formData.confidential_comments}
                    onChange={(e) => setFormData({ ...formData, confidential_comments: e.target.value })}
                    placeholder="Private remarks to the editor regarding suitability for special issues or confidential reservations..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        bgcolor: '#F8FAFC',
                        fontSize: '0.88rem',
                      },
                    }}
                  />
                </Box>

              </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
              <Button
                onClick={() => setActiveReviewModal(null)}
                sx={{ color: '#64748B', fontWeight: 700, textTransform: 'none' }}
              >
                Cancel
              </Button>

              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  disabled={submitting}
                  onClick={() => handleSubmitReview(true)}
                  sx={{ borderRadius: 2.5, fontWeight: 700, textTransform: 'none', borderColor: '#CBD5E1', color: '#334155' }}
                >
                  Save Draft Notes
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  disabled={submitting}
                  sx={{
                    bgcolor: '#0F172A',
                    '&:hover': { bgcolor: '#1E293B' },
                    borderRadius: 2.5,
                    fontWeight: 800,
                    textTransform: 'none',
                    px: 3,
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Final Evaluation'}
                </Button>
              </Stack>
            </DialogActions>
          </form>
        )}
      </Dialog>

      {/* 8. LaTeX Editor Modal */}
      <LatexEditorModal
        isOpen={!!activeLatexArticle}
        onClose={() => setActiveLatexArticle(null)}
        articleId={activeLatexArticle?.id}
        articleTitle={activeLatexArticle?.title}
        initialLatex={activeLatexArticle?.latex}
        readOnly={false}
        onSaved={() => {
          fetchReviews();
        }}
      />

    </Box>
  );
};

export default ReviewerDashboard;
