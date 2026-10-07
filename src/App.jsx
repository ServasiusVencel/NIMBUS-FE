import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { GeneralDashboardView } from './views/GeneralDashboardView';
import { MapView } from './views/MapView';
import { GeneralWeatherView } from './views/GeneralWeatherView';
import { FireWarningView } from './views/FireWarningView';
import { ClimateAgricultureView } from './views/ClimateAgricultureView';
import { DataExportView } from './views/DataExportView';
import { OwnerDashboardView } from './views/OwnerDashboardView';
import { ClientManagementView } from './views/ClientManagementView';
import { SensorManagementView } from './views/SensorManagementView';
import { ModuleConfigView } from './views/ModuleConfigView';
import { AiEngineView } from './views/AiEngineView';
import { SettingsView } from './views/SettingsView';
import './App.css';

/**
 * Page titles mapping for browser tabs
 */
const PAGE_TITLES = {
  '/dashboard': 'Nimbus — Telemetry Intelligence Dashboard',
  '/map': 'Nimbus — Map & Sensor Stations',
  '/weather': 'Nimbus — General Weather Analytics',
  '/fire': 'Nimbus — Fire Warning Index (FWI)',
  '/agri': 'Nimbus — Climate Agriculture',
  '/export': 'Nimbus — Telemetry Data Exporter',
  '/settings': 'Nimbus — Pengaturan Akun & Profil',
  '/owner': 'Nimbus — Executive Owner Overview',
  '/clients': 'Nimbus — Manajemen Klien Enterprise',
  '/sensors': 'Nimbus — Armada Sensor AWS',
  '/modules': 'Nimbus — Konfigurasi Modul',
  '/ai-engine': 'Nimbus — AI Engine & MLOps',
  '/login': 'Nimbus — Masuk ke Platform'
};

/**
 * Superadmin Route Guard: Restricts CMS access to superadmin role
 */
function SuperadminRoute({ children }) {
  const { userRole } = useApp();
  if (userRole !== 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

/**
 * Main Application Layout Shell with Real Page-per-Page URL Routing & Transition Feedback
 */
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Dynamic Browser Tab Title & Page Loading Feedback on Route Change
  useEffect(() => {
    // 1. Update browser tab title
    const currentTitle = PAGE_TITLES[location.pathname] || 'Nimbus — Environmental Intelligence';
    document.title = currentTitle;

    // 2. Page transition loader feedback
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div id="app" className="flex h-screen w-screen overflow-hidden bg-[#f8fafc]">
      {/* Top Loading Indicator Bar for Page Navigation */}
      {isPageLoading && (
        <div className="fixed top-0 inset-x-0 h-1 bg-sky-500 z-50 animate-pulse shadow-sm shadow-sky-500/50" />
      )}

      {/* Multi-page Sidebar with real NavLinks */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <TopNav onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0 transition-opacity duration-150 ${
            isPageLoading ? 'opacity-85' : 'opacity-100'
          }`}
        >
          <Routes>
            {/* Client Workspace Multi-Pages */}
            <Route path="/dashboard" element={<GeneralDashboardView />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/weather" element={<GeneralWeatherView />} />
            <Route path="/fire" element={<FireWarningView />} />
            <Route path="/agri" element={<ClimateAgricultureView />} />
            <Route path="/export" element={<DataExportView />} />
            <Route path="/download" element={<Navigate to="/export" replace />} />

            {/* Global Settings Page (Accessible by both superadmin & operators) */}
            <Route path="/settings" element={<SettingsView />} />

            {/* Platform CMS Multi-Pages (Strictly Superadmin Only) */}
            <Route path="/owner" element={<SuperadminRoute><OwnerDashboardView /></SuperadminRoute>} />
            <Route path="/clients" element={<SuperadminRoute><ClientManagementView /></SuperadminRoute>} />
            <Route path="/sensors" element={<SuperadminRoute><SensorManagementView /></SuperadminRoute>} />
            <Route path="/modules" element={<SuperadminRoute><ModuleConfigView /></SuperadminRoute>} />
            <Route path="/ai-engine" element={<SuperadminRoute><AiEngineView /></SuperadminRoute>} />
            <Route path="/ai_health" element={<Navigate to="/ai-engine" replace />} />

            {/* Fallbacks */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/**
 * Root Router with Authentication Guards
 */
function AppRoutes() {
  const { isLoggedIn } = useApp();

  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      {/* Protected App Routes */}
      <Route
        path="/*"
        element={isLoggedIn ? <AppLayout /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
