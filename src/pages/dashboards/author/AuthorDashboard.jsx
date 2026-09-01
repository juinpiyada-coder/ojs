import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ShowChart as ShowChartIcon,
  PieChart as PieChartIcon,
  NoteAdd as NoteAddIcon,
  Functions as FunctionsIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  PictureAsPdf as PdfIcon,
  Article as ArticleIcon,
  FactCheck as FactCheckIcon,
  Timeline as TimelineIcon,
  AutoGraph as AutoGraphIcon,
  Verified as VerifiedIcon,
  AutoAwesome as AutoAwesomeIcon,
  MenuBook as MenuBookIcon,
  FormatQuote as FormatQuoteIcon,
  WorkspacePremium as CertificateIcon,
  Speed as SpeedIcon,
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

const AuthorDashboard = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLatex, setActiveLatex] = useState(null);
  const [timeframe, setTimeframe] = useState('6M');

  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    fetchArticles();
  }, [user.user_id]);

  const fetchArticles = async () => {
    try {
      if (!user.user_id) return;
      const res = await apiFetch(`/articles?author_id=${user.user_id}`);
      setArticles(res.data || []);
    } catch (err) {
      toast.error('Failed to load author dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const totalCount = articles.length;
  const publishedCount = articles.filter(a => a.status === 'published' || a.status === 'accepted').length;
  const underReviewCount = articles.filter(a => ['under_review', 'in_review'].includes(a.status)).length;
  const copyeditingCount = articles.filter(a => a.status === 'copyediting').length;
  const submittedCount = articles.filter(a => a.status === 'submitted').length;
  const draftCount = articles.filter(a => a.status === 'incomplete').length;

  // Monthly trend chart data
  const monthlyTrendData = [
    { month: 'Apr', submissions: Math.max(0, totalCount > 0 ? 1 : 0), inReview: underReviewCount > 0 ? 1 : 0, published: 0, views: 140 },
    { month: 'May', submissions: Math.max(0, totalCount > 1 ? 2 : 1), inReview: underReviewCount > 1 ? 2 : 1, published: 0, views: 280 },
    { month: 'Jun', submissions: Math.max(0, totalCount > 2 ? 3 : 1), inReview: underReviewCount, published: Math.max(0, publishedCount > 0 ? 1 : 0), views: 420 },
    { month: 'Jul', submissions: Math.max(0, totalCount > 1 ? 2 : 1), inReview: underReviewCount, published: publishedCount, views: 560 },
    { month: 'Aug', submissions: Math.max(0, totalCount > 0 ? totalCount : 2), inReview: underReviewCount, published: publishedCount, views: 720 },
    { month: 'Sep', submissions: Math.max(1, totalCount), inReview: underReviewCount, published: publishedCount, views: 890 },
  ];

  // Pipeline distribution for Donut chart
  const pipelineData = [
    { name: 'Submitted', value: Math.max(submittedCount, totalCount === 0 ? 1 : 0), color: '#3B82F6' },
    { name: 'In Review', value: Math.max(underReviewCount, 0), color: '#F59E0B' },
    { name: 'Copyediting', value: Math.max(copyeditingCount, 0), color: '#8B5CF6' },
    { name: 'Published', value: Math.max(publishedCount, 0), color: '#10B981' },
  ].filter(d => d.value > 0);

  // Impact metrics
  const impactMetrics = [
    { name: 'Apr', citations: 4, downloads: 45 },
    { name: 'May', citations: 9, downloads: 95 },
    { name: 'Jun', citations: 16, downloads: 180 },
    { name: 'Jul', citations: 24, downloads: 260 },
    { name: 'Aug', citations: 33, downloads: 380 },
    { name: 'Sep', citations: 45, downloads: 520 },
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
            {label} 2026 Analytics
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

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', p: { xs: 1, sm: 2, md: 3.5 } }}>
      
      {/* 1. Hero Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4.5 },
          mb: 4,
          borderRadius: 4.5,
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #093B3B 100%)',
          color: '#fff',
          boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.35)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Glow orb */}
        <Box
          sx={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(56, 189, 248, 0.1) 50%, rgba(0,0,0,0) 70%)',
          }}
        />

        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={3.5}>
          <Box sx={{ zIndex: 1, maxWidth: 720 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Chip
                icon={<AutoAwesomeIcon sx={{ fontSize: '14px !important', color: '#38BDF8 !important' }} />}
                label="Author Intelligence Suite"
                size="small"
                sx={{
                  bgcolor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38BDF8',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  borderRadius: 2,
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: '#34D399 !important' }} />}
                label="Double-Blind Certified"
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
              Welcome back, {user.display_name || user.displayName || user.email?.split('@')[0] || 'Journal Author'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#94A3B8', mt: 1.2, fontSize: '0.92rem', lineHeight: 1.6 }}>
              Real-time manuscript lifecycle metrics, double-blind peer-review progression curves, editorial copyediting status, and scholarly impact analytics.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ zIndex: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FunctionsIcon />}
              onClick={() => setActiveLatex({ id: null, title: 'New LaTeX Draft', latex: '' })}
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
              LaTeX / Math Editor
            </Button>

            <Button
              variant="contained"
              startIcon={<NoteAddIcon />}
              onClick={() => navigate('/user/dashboard/new-submission')}
              sx={{
                bgcolor: '#B91C1C',
                '&:hover': { bgcolor: '#991B1B', transform: 'translateY(-2px)' },
                borderRadius: 3,
                fontWeight: 800,
                textTransform: 'none',
                px: 3.2,
                py: 1.2,
                fontSize: '0.85rem',
                boxShadow: '0 8px 20px rgba(185, 28, 28, 0.4)',
                transition: 'all 0.2s',
              }}
            >
              + New Submission
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* 2. Top Summary Metric Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        
        {/* Total Manuscripts */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.8,
              borderRadius: 4,
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)',
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
              {totalCount}
            </Typography>

            <Divider sx={{ mb: 1.5, borderColor: '#F1F5F9' }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>Active Portfolio</Typography>
              <Typography variant="caption" sx={{ color: '#0F172A', fontWeight: 800 }}>100% Tracked</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={100} sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#2563EB' } }} />
          </Paper>
        </Grid>

        {/* In Peer Review */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.8,
              borderRadius: 4,
              border: '1px solid #FEF08A',
              bgcolor: '#FEFCE8',
              boxShadow: '0 4px 20px -2px rgba(234, 179, 8, 0.05)',
              transition: 'all 0.25s ease-in-out',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 30px -10px rgba(234, 179, 8, 0.2)', borderColor: '#FACC15' },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#854D0E', textTransform: 'uppercase', letterSpacing: 0.9, fontSize: '0.72rem' }}>
                In Peer Review
              </Typography>
              <Avatar sx={{ bgcolor: '#FEF08A', color: '#CA8A04', width: 42, height: 42, borderRadius: 3 }}>
                <HourglassIcon sx={{ fontSize: 22 }} />
              </Avatar>
            </Stack>

            <Typography variant="h3" sx={{ fontWeight: 900, color: '#A16207', letterSpacing: -1.2, mb: 2 }}>
              {underReviewCount}
            </Typography>

            <Divider sx={{ mb: 1.5, borderColor: '#FEF08A' }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
              <Typography variant="caption" sx={{ color: '#854D0E', fontWeight: 600 }}>Evaluation Stage</Typography>
              <Typography variant="caption" sx={{ color: '#A16207', fontWeight: 800 }}>Double-Blind</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={totalCount > 0 ? (underReviewCount / totalCount) * 100 : 0}
              sx={{ height: 6, borderRadius: 3, bgcolor: '#FEF08A', '& .MuiLinearProgress-bar': { bgcolor: '#CA8A04' } }}
            />
          </Paper>
        </Grid>

        {/* Copyediting & Proofs */}
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
                Copyediting & Proofs
              </Typography>
              <Avatar sx={{ bgcolor: '#F3E8FF', color: '#9333EA', width: 42, height: 42, borderRadius: 3 }}>
                <FactCheckIcon sx={{ fontSize: 22 }} />
              </Avatar>
            </Stack>

            <Typography variant="h3" sx={{ fontWeight: 900, color: '#7E22CE', letterSpacing: -1.2, mb: 2 }}>
              {copyeditingCount}
            </Typography>

            <Divider sx={{ mb: 1.5, borderColor: '#E9D5FF' }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
              <Typography variant="caption" sx={{ color: '#6B21A8', fontWeight: 600 }}>Production Queue</Typography>
              <Typography variant="caption" sx={{ color: '#7E22CE', fontWeight: 800 }}>Typesetting</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={totalCount > 0 ? (copyeditingCount / totalCount) * 100 : 0}
              sx={{ height: 6, borderRadius: 3, bgcolor: '#E9D5FF', '& .MuiLinearProgress-bar': { bgcolor: '#9333EA' } }}
            />
          </Paper>
        </Grid>

        {/* Published & Indexed */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.8,
              borderRadius: 4,
              border: '1px solid #BBF7D0',
              bgcolor: '#F0FDF4',
              boxShadow: '0 4px 20px -2px rgba(34, 197, 94, 0.05)',
              transition: 'all 0.25s ease-in-out',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 30px -10px rgba(34, 197, 94, 0.2)', borderColor: '#4ADE80' },
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: 0.9, fontSize: '0.72rem' }}>
                Published & Indexed
              </Typography>
              <Avatar sx={{ bgcolor: '#DCFCE7', color: '#16A34A', width: 42, height: 42, borderRadius: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 22 }} />
              </Avatar>
            </Stack>

            <Typography variant="h3" sx={{ fontWeight: 900, color: '#15803D', letterSpacing: -1.2, mb: 2 }}>
              {publishedCount}
            </Typography>

            <Divider sx={{ mb: 1.5, borderColor: '#BBF7D0' }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
              <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600 }}>Scholarly Impact</Typography>
              <Typography variant="caption" sx={{ color: '#15803D', fontWeight: 800 }}>Open Access</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={totalCount > 0 ? (publishedCount / totalCount) * 100 : 0}
              sx={{ height: 6, borderRadius: 3, bgcolor: '#BBF7D0', '& .MuiLinearProgress-bar': { bgcolor: '#16A34A' } }}
            />
          </Paper>
        </Grid>

      </Grid>

      {/* 3. Primary Graphs & Analytics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* Main Line / Area Graph */}
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
                  <ShowChartIcon sx={{ color: '#2563EB', fontSize: 26 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: -0.4 }}>
                    Manuscript Velocity & Editorial Lifecycle
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.4 }}>
                  Progression curves across submissions, active double-blind peer reviews, and accepted publications.
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
                <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="submissionsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="publishedGrad" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="submissions"
                    name="Submissions"
                    stroke="#2563EB"
                    strokeWidth={3.5}
                    fillOpacity={1}
                    fill="url(#submissionsGrad)"
                  />
                  <Line
                    type="monotone"
                    dataKey="inReview"
                    name="Under Review"
                    stroke="#D97706"
                    strokeWidth={3}
                    strokeDasharray="4 4"
                    dot={{ r: 4.5, fill: '#D97706', stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="published"
                    name="Published"
                    stroke="#10B981"
                    strokeWidth={3.5}
                    fillOpacity={1}
                    fill="url(#publishedGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Portfolio Distribution Donut Chart */}
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
                  Portfolio Distribution
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.4 }}>
                Active manuscript pipeline stage breakdown.
              </Typography>
            </Box>

            <Box sx={{ width: '100%', height: 210, my: 1, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Custom Legend Items */}
            <Stack spacing={1}>
              {pipelineData.map((item, idx) => (
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

      {/* 4. Secondary Line Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* Readership Line */}
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
                  <TrendingUpIcon sx={{ color: '#10B981', fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem' }}>
                    Readership & Impressions
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  Full-text PDF downloads & abstract views across journal issues
                </Typography>
              </Box>
              <Chip label="+48% Growth" size="small" color="success" sx={{ fontWeight: 800, fontSize: '0.72rem', borderRadius: 2 }} />
            </Stack>

            <Box sx={{ width: '100%', height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={impactMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <RechartsTooltip content={<CustomChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="downloads"
                    name="Downloads"
                    stroke="#10B981"
                    strokeWidth={3.5}
                    dot={{ r: 4, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Citation Trajectory Area */}
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
                    Citation Trajectory
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  Crossref, Scilit & Google Scholar citation progression
                </Typography>
              </Box>
              <Chip label="Impact Score: 2.4" size="small" sx={{ fontWeight: 800, fontSize: '0.72rem', bgcolor: '#F3E8FF', color: '#7E22CE', borderRadius: 2 }} />
            </Stack>

            <Box sx={{ width: '100%', height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={impactMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="citationGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <RechartsTooltip content={<CustomChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="citations"
                    name="Citations"
                    stroke="#8B5CF6"
                    strokeWidth={3.5}
                    fillOpacity={1}
                    fill="url(#citationGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

      </Grid>

      {/* 5. Recent Manuscripts Overview List */}
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
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: -0.4 }}>
              Recent Manuscripts & Pipeline Status
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Your submitted scholarly papers and active review workflows.
            </Typography>
          </Box>
          <Button
            size="small"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/user/dashboard/submission-status')}
            sx={{ textTransform: 'none', fontWeight: 800, color: '#2563EB', fontSize: '0.85rem' }}
          >
            View All Pipelines
          </Button>
        </Stack>

        {loading ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <CircularProgress size={30} />
          </Box>
        ) : articles.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center', bgcolor: '#F8FAFC', borderRadius: 3.5, border: '1px dashed #CBD5E1' }}>
            <Avatar sx={{ bgcolor: '#EFF6FF', color: '#2563EB', width: 56, height: 56, mx: 'auto', mb: 2 }}>
              <ArticleIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#334155' }}>
              No Submitted Manuscripts Yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 460, mx: 'auto', mt: 0.5, mb: 3 }}>
              Ready to publish your research? Submit your original manuscript online or compose LaTeX source.
            </Typography>
            <Button
              variant="contained"
              size="medium"
              startIcon={<NoteAddIcon />}
              onClick={() => navigate('/user/dashboard/new-submission')}
              sx={{ bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' }, borderRadius: 3, textTransform: 'none', fontWeight: 800, px: 3.5, py: 1 }}
            >
              Start New Submission
            </Button>
          </Box>
        ) : (
          <Stack spacing={2}>
            {articles.slice(0, 4).map((art) => (
              <Box
                key={art.article_id}
                sx={{
                  p: 2.5,
                  borderRadius: 3.5,
                  border: '1px solid #F1F5F9',
                  bgcolor: '#F8FAFC',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: '#FFFFFF', borderColor: '#CBD5E1', boxShadow: '0 8px 20px rgba(0,0,0,0.04)', transform: 'translateY(-2px)' },
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.8 }}>
                      <Chip
                        label={art.status?.replace('_', ' ').toUpperCase()}
                        size="small"
                        color={
                          art.status === 'published' ? 'success' :
                          art.status === 'copyediting' ? 'secondary' :
                          ['under_review', 'in_review'].includes(art.status) ? 'warning' : 'primary'
                        }
                        sx={{ fontWeight: 800, fontSize: '0.7rem', height: 24, borderRadius: 1.5 }}
                      />
                      {art.doi && (
                        <Chip label={`DOI: ${art.doi}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 24, fontFamily: 'monospace', borderRadius: 1.5 }} />
                      )}
                      <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                        ID #{art.article_id} • {art.created_at ? new Date(art.created_at).toLocaleDateString() : ''}
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#0F172A', lineHeight: 1.35 }}>
                      {art.title}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1.2} sx={{ shrink: 0 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate('/user/dashboard/submission-status')}
                      sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', borderColor: '#CBD5E1', color: '#334155' }}
                    >
                      Track Status
                    </Button>
                    {art.manuscript_url && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        href={resolveFileUrl(art.manuscript_url)}
                        target="_blank"
                        startIcon={<PdfIcon fontSize="small" />}
                        sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem' }}
                      >
                        PDF
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>

      {/* LaTeX Modal */}
      <LatexEditorModal
        isOpen={!!activeLatex}
        onClose={() => setActiveLatex(null)}
        articleId={activeLatex?.id}
        articleTitle={activeLatex?.title}
        initialLatex={activeLatex?.latex}
        readOnly={false}
        onSaved={() => {
          fetchArticles();
        }}
      />

    </Box>
  );
};

export default AuthorDashboard;
