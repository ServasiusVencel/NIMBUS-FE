import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { MapView } from './views/MapView';
import { GeneralWeatherView } from './views/GeneralWeatherView';
import { FireWarningView } from './views/FireWarningView';
import { ClimateAgricultureView } from './views/ClimateAgricultureView';
import { OwnerDashboardView } from './views/OwnerDashboardView';
import './App.css';

function MainAppShell() {
  const { isLoggedIn, activeTab } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'map':
        return <MapView />;
      case 'weather':
      case 'download':
        return <GeneralWeatherView />;
      case 'fire':
        return <FireWarningView />;
      case 'agri':
        return <ClimateAgricultureView />;
      case 'owner':
      case 'settings':
        return <OwnerDashboardView />;
      default:
        return <MapView />;
    }
  };

  return (
    <section id="app" className="app" style={{ display: 'block' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main">
        <TopNav onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <div className="content">
          {renderScreen()}
        </div>
      </main>
    </section>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppShell />
    </AppProvider>
  );
}
