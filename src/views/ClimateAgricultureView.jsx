import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OperationWindowsGrid } from '../components/agriculture/OperationWindowsGrid';
import { DailyAgronomyCard } from '../components/agriculture/DailyAgronomyCard';
import { PestRadarCard } from '../components/agriculture/PestRadarCard';
import { ComboBox } from '../components/ui/combo-box';

/**
 * ClimateAgricultureView: Orchestrates actionable agronomy operational windows,
 * daily field microclimate analysis, and bioclimatic pest & disease warnings.
 */
export const ClimateAgricultureView = () => {
  const { activeSensor, setActiveSensorId, sensors, forecast10Days, pestAlerts } = useApp();
  const [activeActivity, setActiveActivity] = useState('fertilization'); // 'fertilization' | 'spraying' | 'harvest' | 'otherOperations'
  const [activeTab, setActiveTab] = useState('windows'); // 'windows' | 'pest' | 'recom'
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const activities = [
    { id: 'fertilization', label: '🌱 Pemupukan (Fertilization)' },
    { id: 'spraying', label: '🧪 Semprot Pestisida (Spraying)' },
    { id: 'harvest', label: '🌾 Panen & Angkut (Harvesting)' },
    { id: 'otherOperations', label: '🚜 Operasional Lahan Lainnya' },
  ];

  const activeDay = forecast10Days[selectedDayIdx] || forecast10Days[0];
  const activeActivityObj = activities.find(a => a.id === activeActivity);

  return (
    <section id="screen-agri" className="space-y-6 animate-fade-in">
      {/* Page Title & Station Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/70">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Climate-Resilient Agriculture Planning</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Turn microclimate predictions into actionable operational windows for plantation operations and pest mitigation.</p>
        </div>
        <div className="w-full sm:w-72 shrink-0 self-start sm:self-auto">
          <ComboBox
            options={sensors.map(s => ({ value: s.id, label: `${s.id} · ${s.name || s.id}` }))}
            value={activeSensor?.id}
            onChange={(selectedId) => selectedId && setActiveSensorId(selectedId)}
            placeholder="Pilih Stasiun AWS..."
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: 'windows', label: 'Jadwal Operasional (10 Hari)' },
          { id: 'pest', label: 'Radar Hama & Penyakit' },
          { id: 'recom', label: 'Rekomendasi Agronomi' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                isActive 
                  ? 'border-blue text-blue bg-blue/5' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. Operation Windows Matrix Grid */}
      {(activeTab === 'windows' || activeTab === 'recom') && (
        <OperationWindowsGrid 
          activities={activities}
          activeActivity={activeActivity}
          onSelectActivity={setActiveActivity}
          forecast10Days={forecast10Days}
          selectedDayIdx={selectedDayIdx}
          onSelectDay={setSelectedDayIdx}
        />
      )}

      {/* 2. Detailed Daily Agronomy Field Analysis Card */}
      {(activeTab === 'windows' || activeTab === 'recom') && activeDay && (
        <DailyAgronomyCard 
          activeDay={activeDay}
          activeActivity={activeActivity}
          activityLabel={activeActivityObj?.label || ''}
        />
      )}

      {/* 3. Pest & Disease Warning Radar Card */}
      {(activeTab === 'windows' || activeTab === 'pest') && (
        <PestRadarCard 
          pestAlerts={pestAlerts}
          activeSensorId={activeSensor?.id}
        />
      )}
    </section>
  );
};

export default ClimateAgricultureView;
