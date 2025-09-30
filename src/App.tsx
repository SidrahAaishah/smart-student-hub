import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Navigation } from './components/Navigation';
import { ThemeProvider } from './contexts/ThemeContext';

// Student Components
import { StudentDashboard } from './components/Student/Dashboard';
import { Activities } from './components/Student/Activities';
import { Portfolio } from './components/Student/Portfolio';
import { StudentAssistant } from './components/Student/StudentAssistant';

// Faculty Components
import { Approvals } from './components/Faculty/Approvals';
import { StudentMonitoring } from './components/Faculty/StudentMonitoring';

// Admin Components
import { AdminDashboard } from './components/Admin/Dashboard';
import { Analytics } from './components/Admin/Analytics';
import { Announcements } from './components/Admin/Announcements';

import { User } from './types';
import { storage } from './utils/storage';
import { initializeMockData } from './utils/mockData';
import { auth, canAccessRoute } from './utils/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('');
  const [isDataInitialized, setIsDataInitialized] = useState(false);

  useEffect(() => {
    // Initialize mock data on first load
    initializeMockData();
    setIsDataInitialized(true);
    
    // Check for authenticated user
    if (auth.isAuthenticated()) {
      const currentUser = auth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setDefaultView(currentUser.role);
      } else {
        // Invalid session, logout
        auth.logout();
      }
    }
  }, []);

  const setDefaultView = (role: string) => {
    switch (role) {
      case 'student':
        setCurrentView('dashboard');
        break;
      case 'faculty':
        setCurrentView('approvals');
        break;
      case 'admin':
        setCurrentView('dashboard');
        break;
      default:
        setCurrentView('dashboard');
    }
  };

  const handleLogin = (userData: User) => {
    // Validate user role
    if (!['student', 'faculty', 'admin'].includes(userData.role)) {
      console.error('Invalid user role');
      return;
    }
    
    // Ensure data is initialized before setting user
    initializeMockData();
    setIsDataInitialized(true);
    
    setUser(userData);
    storage.setUser(userData);
    setDefaultView(userData.role);
  };

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    setCurrentView('');
  };

  // Route protection based on role
  const isAuthorized = (route: string, userRole: string) => {
    return canAccessRoute(userRole, route);
  };

  const renderCurrentView = () => {
    if (!user || !isDataInitialized) return null;

    switch (user.role) {
      case 'student':
        // Check route authorization
        if (!isAuthorized(currentView, user.role)) {
          return <div className="text-center p-8"><p className="text-red-600">Access Denied: Insufficient permissions</p></div>;
        }
        switch (currentView) {
          case 'dashboard':
            return <StudentDashboard user={user} />;
          case 'activities':
            return <Activities userId={user.id} />;
          case 'portfolio':
            return <Portfolio userId={user.id} />;
          case 'assistant':
            return <StudentAssistant userId={user.id} />;
          default:
            return <StudentDashboard user={user} />;
        }
      case 'faculty':
        // Check route authorization
        if (!isAuthorized(currentView, user.role)) {
          return <div className="text-center p-8"><p className="text-red-600">Access Denied: Insufficient permissions</p></div>;
        }
        switch (currentView) {
          case 'approvals':
            return <Approvals />;
          case 'monitoring':
            return <StudentMonitoring />;
          default:
            return <Approvals />;
        }
      case 'admin':
        // Admin can access all routes
        switch (currentView) {
          case 'dashboard':
            return <AdminDashboard />;
          case 'analytics':
            return <Analytics />;
          case 'announcements':
            return <Announcements />;
          default:
            return <AdminDashboard />;
        }
      default:
        return <div className="text-center p-8"><p className="text-red-600">Invalid Role</p></div>;
    }
  };

  if (!user) {
    return (
      <ThemeProvider>
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Layout user={user} onLogout={handleLogout}>
          <Navigation
            userRole={user.role}
            currentView={currentView}
            onViewChange={setCurrentView}
          />
          <div className="mt-6">
            {renderCurrentView()}
          </div>
        </Layout>
      </div>
    </ThemeProvider>
  );
}

export default App;