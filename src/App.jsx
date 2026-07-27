import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import EditorialBoard from './pages/EditorialBoard';
import CallForPapers from './pages/CallForPapers';
import Submission from './pages/Submission';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Footer from './components/Footer';

// Dashboards
import DashboardLayout from './pages/dashboards/DashboardLayout';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import EditorDashboard from './pages/dashboards/EditorDashboard';
import AssistantEditorDashboard from './pages/dashboards/AssistantEditorDashboard';
import AuthorDashboard from './pages/dashboards/AuthorDashboard';

function App() {
  return (
    <BrowserRouter>
      {/* 
        We separate the layout so that public pages get the Header & Japandi theme,
        while Dashboard pages get the Sidebar & Admin theme.
      */}
      <Routes>
        
        {/* Public Pages */}
        <Route path="/" element={
          <div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]">
            <Header />
            <Home />
            <Footer />
          </div>
        } />
        <Route path="/about" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><About /><Footer /></div>} />
        <Route path="/editorial-board" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><EditorialBoard /><Footer /></div>} />
        <Route path="/call-for-papers" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><CallForPapers /><Footer /></div>} />
        <Route path="/submission" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Submission /><Footer /></div>} />
        <Route path="/team" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Team /><Footer /></div>} />
        <Route path="/contact" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Contact /><Footer /></div>} />
        
        {/* Auth Pages */}
        <Route path="/login" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Login /><Footer /></div>} />
        <Route path="/register" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><Register /><Footer /></div>} />
        <Route path="/forgot-password" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><ForgotPassword /><Footer /></div>} />
        <Route path="/reset-password" element={<div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#2C2C2C]"><Header /><ResetPassword /><Footer /></div>} />

        {/* Dashboard Routes */}
        <Route path="/admin/dashboard" element={<DashboardLayout title="Admin Dashboard" />}>
          <Route index element={<AdminDashboard />} />
        </Route>
        
        <Route path="/editor/dashboard" element={<DashboardLayout title="Editor Dashboard" />}>
          <Route index element={<EditorDashboard />} />
        </Route>
        
        <Route path="/assistant-editor/dashboard" element={<DashboardLayout title="Assistant Editor Dashboard" />}>
          <Route index element={<AssistantEditorDashboard />} />
        </Route>
        
        <Route path="/user/dashboard" element={<DashboardLayout title="Author Dashboard" />}>
          <Route index element={<AuthorDashboard />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
