import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { BrandingProvider } from './context/BrandingContext';

import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import EditorialBoard from './pages/EditorialBoard';
import EditorProfile from './pages/EditorProfile';
import CallForPapers from './pages/CallForPapers';
import Submission from './pages/Submission';
import Team from './pages/Team';
import TeamProfile from './pages/TeamProfile';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Footer from './components/Footer';

// Public Scholarly Pages
import Issues from './pages/Issues';
import SpecialCollections from './pages/SpecialCollections';
import AuthorGuidelines from './pages/AuthorGuidelines';
import AnonymousReview from './pages/AnonymousReview';
import GlossaSpecialCollections from './pages/GlossaSpecialCollections';
import JournalPolicies from './pages/JournalPolicies';
import PublisherPolicies from './pages/PublisherPolicies';
import BecomeReviewer from './pages/BecomeReviewer';
import Governance from './pages/Governance';
import Search from './pages/Search';
import Ethics from './pages/Ethics';
import Template from './pages/Template';
import CurrentIssue from './pages/CurrentIssue';
import Archive from './pages/Archive';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Accessibility from './pages/Accessibility';

// Dashboard Shell Layout
import DashboardLayout from './pages/dashboards/DashboardLayout';

// Admin / Super Admin Module Pages (in /dashboards/admin/)
import AdminDashboard from './pages/dashboards/admin/AdminDashboard';
import AdminProfile from './pages/dashboards/admin/AdminProfile';
import UserManagement from './pages/dashboards/admin/UserManagement';
import EditorManagement from './pages/dashboards/admin/EditorManagement';
import SystemSettings from './pages/dashboards/admin/SystemSettings';
import BrandingUI from './pages/dashboards/admin/BrandingUI';
import AuditLogs from './pages/dashboards/admin/AuditLogs';
import Announcements from './pages/dashboards/admin/Announcements';
import PaperSubmissions from './pages/dashboards/admin/PaperSubmissions';
import VolumeIssueManagement from './pages/dashboards/admin/VolumeIssueManagement';
import ArchiveManagement from './pages/dashboards/admin/ArchiveManagement';

// Author Module Pages (in /dashboards/author/)
import AuthorDashboard from './pages/dashboards/author/AuthorDashboard';
import AuthorNewSubmission from './pages/dashboards/author/AuthorNewSubmission';
import AuthorPublications from './pages/dashboards/author/AuthorPublications';
import AuthorSubmissionStatus from './pages/dashboards/author/AuthorSubmissionStatus';

// Editor Module Pages (in /dashboards/editor/)
import EditorDashboard from './pages/dashboards/editor/EditorDashboard';
import AssistantEditorDashboard from './pages/dashboards/editor/AssistantEditorDashboard';

// Reviewer Module Pages (in /dashboards/reviewer/)
import ReviewerDashboard from './pages/dashboards/reviewer/ReviewerDashboard';

function App() {
  return (
    <BrandingProvider>
      <AuthProvider>
        <BrowserRouter>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
          
          <Routes>
            
            {/* Main Public Website Pages */}
            <Route path="/" element={
              <div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]">
                <Header />
                <Home />
                <Footer />
              </div>
            } />
            <Route path="/about" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><About /><Footer /></div>} />
            <Route path="/editorial-board" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><EditorialBoard /><Footer /></div>} />
            <Route path="/editor/:id" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><EditorProfile /><Footer /></div>} />
            <Route path="/call-for-papers" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><CallForPapers /><Footer /></div>} />
            <Route path="/submission" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Submission /><Footer /></div>} />
            <Route path="/team" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Team /><Footer /></div>} />
            <Route path="/team/:id" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><TeamProfile /><Footer /></div>} />
            <Route path="/contact" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Contact /><Footer /></div>} />
            
            {/* Scholarly Index & Policy Pages */}
            <Route path="/issues" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Issues /><Footer /></div>} />
            <Route path="/special-collections" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><SpecialCollections /><Footer /></div>} />
            <Route path="/author-guidelines" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><AuthorGuidelines /><Footer /></div>} />
            <Route path="/anonymous-review" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><AnonymousReview /><Footer /></div>} />
            <Route path="/start-submission" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Submission /><Footer /></div>} />
            <Route path="/glossa-special-collections" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><GlossaSpecialCollections /><Footer /></div>} />
            <Route path="/journal-policies" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><JournalPolicies /><Footer /></div>} />
            <Route path="/publisher-policies" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><PublisherPolicies /><Footer /></div>} />
            <Route path="/become-reviewer" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><BecomeReviewer /><Footer /></div>} />
            <Route path="/governance" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Governance /><Footer /></div>} />
            <Route path="/search" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Search /><Footer /></div>} />
            <Route path="/ethics" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Ethics /><Footer /></div>} />
            <Route path="/template" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Template /><Footer /></div>} />
            <Route path="/current-issue" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><CurrentIssue /><Footer /></div>} />
            <Route path="/archive" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Archive /><Footer /></div>} />
            <Route path="/privacy-policy" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><PrivacyPolicy /><Footer /></div>} />
            <Route path="/terms-of-use" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><TermsOfUse /><Footer /></div>} />
            <Route path="/accessibility" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Accessibility /><Footer /></div>} />
            
            {/* Authentication Pages */}
            <Route path="/login" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Login /><Footer /></div>} />
            <Route path="/register" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Register /><Footer /></div>} />
            <Route path="/forgot-password" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><ForgotPassword /><Footer /></div>} />
            <Route path="/reset-password" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><ResetPassword /><Footer /></div>} />

            {/* 1. Admin / Super Admin Dashboard Routes */}
            <Route path="/admin/dashboard" element={<DashboardLayout title="Admin Dashboard" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="editors" element={<EditorManagement />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="branding" element={<BrandingUI />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="volumes-issues" element={<VolumeIssueManagement />} />
              <Route path="archives" element={<ArchiveManagement />} />
              <Route path="submissions" element={<PaperSubmissions />} />
            </Route>
            
            {/* 2. Editor Dashboard Routes */}
            <Route path="/editor/dashboard" element={<DashboardLayout title="Editor Dashboard" />}>
              <Route index element={<EditorDashboard />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>
            
            {/* 3. Assistant Editor Dashboard Routes */}
            <Route path="/assistant-editor/dashboard" element={<DashboardLayout title="Assistant Editor Dashboard" />}>
              <Route index element={<AssistantEditorDashboard />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>
            
            {/* 4. Reviewer Dashboard Routes */}
            <Route path="/reviewer/dashboard" element={<DashboardLayout title="Reviewer Dashboard" />}>
              <Route index element={<ReviewerDashboard />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>
            
            {/* 5. Author Dashboard Routes */}
            <Route path="/user/dashboard" element={<DashboardLayout title="Author Dashboard" />}>
              <Route index element={<AuthorDashboard />} />
              <Route path="new-submission" element={<AuthorNewSubmission />} />
              <Route path="publications" element={<AuthorPublications />} />
              <Route path="submission-status" element={<AuthorSubmissionStatus />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>
            
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </BrandingProvider>
  );
}

export default App;
