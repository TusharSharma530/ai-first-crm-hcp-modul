import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from './store';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/Toast';
import { fetchProfile } from './features/auth/authSlice';

import LogInteractionForm from './features/interactions/LogInteractionForm';
import InteractionsPage from './features/interactions/InteractionsPage';
import ChatInterface from './features/chat/ChatInterface';
import HelpDeskForm from './features/helpdesk/HelpDeskForm';
import ComplaintStatus from './features/helpdesk/ComplaintStatus';
import DocsPage from './features/docs/DocsPage';

import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ProfilePage from './features/auth/ProfilePage';
import EditProfilePage from './features/auth/EditProfilePage';
import ChangePasswordPage from './features/auth/ChangePasswordPage';
import SettingsPage from './features/auth/SettingsPage';

import './styles/layout.css';
import './styles/auth.css';

const HomePage = () => (
  <div className="home-page">
    <div className="home-row">
      <div className="home-card">
        <LogInteractionForm />
      </div>
      <div className="home-card">
        <ChatInterface />
      </div>
    </div>
    <div className="home-row">
      <div className="home-card">
        <HelpDeskForm />
      </div>
      <div className="home-card">
        <ComplaintStatus />
      </div>
    </div>
  </div>
);

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('crm_token');
    if (token) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  return (
    <Layout>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/interactions" element={<ProtectedRoute><InteractionsPage /></ProtectedRoute>} />
        <Route path="/docs" element={<ProtectedRoute><DocsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </Provider>
  );
}

export default App;
