import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus } from 'lucide-react';
import { SensorTable } from '../components/sensors/SensorTable';
import { DeploySensorModal } from '../components/sensors/DeploySensorModal';

/**
 * SensorManagementView: Orchestrates the IoT Telemetry Fleet Management page.
 * Migrated to pure Tailwind CSS v4.
 */
export const SensorManagementView = () => {
  const { sensors, addSensor, toggleSensorCapability, clients } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCreateSensor = (newStationInstance) => {
    addSensor(newStationInstance);
  };

  const handleToggleTmat = (stationId) => {
    toggleSensorCapability(stationId, 'groundwater_tmat');
  };

  return (
    <div className="animate-fade-in space-y-5">
      {/* View Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold font-mono tracking-wider bg-sky-50 text-sky-700 border border-sky-100 uppercase">
            CMS HARDWARE FLEET
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
            IoT Telemetry & AWS Station Fleet
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Konfigurasi parameter telemetri, kalibrasi sensor mikroklimat, dan kontrol aktivasi piezometer kedalaman muka air tanah (TMAT) lahan gambut.
          </p>
        </div>

        <button 
          className="self-start sm:self-center px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs rounded-xl shadow-xs shadow-sky-500/25 transition flex items-center gap-2 cursor-pointer shrink-0 group"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} className="transition-transform group-hover:rotate-90" />
          <span>Deploy New AWS Station</span>
        </button>
      </div>

      {/* Fleet Stations Table Component */}
      <SensorTable 
        sensors={sensors}
        clients={clients}
        onToggleTmat={handleToggleTmat}
      />

      {/* Isolated Deploy Station Modal Component */}
      <DeploySensorModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateSensor}
        clients={clients}
        existingSensorsCount={sensors.length}
      />
    </div>
  );
};

export default SensorManagementView;
