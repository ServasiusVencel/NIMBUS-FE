import React from 'react';
import { useApp } from '../context/AppContext';
import { SensorMap } from '../components/SensorMap';
import { IntelligenceModulesSection } from '../components/dashboard/IntelligenceModulesSection';

export const MapView = () => {
  const { setActiveTab } = useApp();

  return (
    <section id="screen-map" className="block animate-fade-in space-y-7">
      <SensorMap />
      <IntelligenceModulesSection onNavigate={setActiveTab} />
    </section>
  );
};

export default MapView;
