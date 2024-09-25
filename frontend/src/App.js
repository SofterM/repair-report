import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportForm from './pages/ReportForm';
import EditReportForm from './pages/EditReportForm';
import Admin from './pages/Admin';
import AdminEdit from './pages/AdminEdit'; // เพิ่ม import สำหรับ AdminEdit
import ProtectedRoute from './components/ProtectedRoute';
import ToastNotification from './components/ToastNotification';
import PageTransition from './components/PageTransition';
import NotFound from './pages/NotFound';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PageTransition><Dashboard /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/report" element={
          <ProtectedRoute>
            <PageTransition><ReportForm /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/edit-report/:id" element={
          <ProtectedRoute>
            <PageTransition><EditReportForm /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <PageTransition><Admin /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/adminedit/:id" element={
          <ProtectedRoute requiredRole="admin">
            <PageTransition><AdminEdit /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AnimatedRoutes />
          <ToastNotification />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;