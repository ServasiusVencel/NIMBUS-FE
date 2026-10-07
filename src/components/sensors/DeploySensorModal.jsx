import React, { useState, useEffect } from 'react';
import { X, Waves } from 'lucide-react';
import { SensorStation } from '../../models/SensorStation';
import { ComboBox } from '../ui/combo-box';
import { Toggle } from '../ui/Toggle';

/**
 * DeploySensorModal: Modal form dialog for deploying a new telemetry station.
 * Utilizes SensorStation.createNewFleetStation factory method for clean OOP creation.
 */
export const DeploySensorModal = ({ isOpen, onClose, onSubmit, clients = [], existingSensorsCount = 0 }) => {
  const defaultClientId = clients[0]?.id || 'CLI-001';
  const [formData, setFormData] = useState({
    name: '',
    clientId: defaultClientId,
    latitude: -0.5,
    longitude: 101.5,
    hasTmat: true,
  });

  const [error, setError] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      clientId: clients[0]?.id || 'CLI-001',
      latitude: -0.5,
      longitude: 101.5,
      hasTmat: true,
    });
    setError('');
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Nama stasiun wajib diisi.');
      return;
    }

    const lat = parseFloat(formData.latitude);
    const lon = parseFloat(formData.longitude);
    if (isNaN(lat) || isNaN(lon)) {
      setError('Koordinat latitude dan longitude harus berupa angka valid.');
      return;
    }

    // OOP Factory instantiation
    const newStation = SensorStation.createNewFleetStation({
      name: formData.name,
      clientId: formData.clientId,
      latitude: lat,
      longitude: lon,
      hasTmat: formData.hasTmat,
      stationIndex: existingSensorsCount + 1,
    });

    onSubmit(newStation);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" 
      onClick={handleClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-deploy-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue/10 text-blue flex items-center justify-center">
              <Waves size={18} />
            </div>
            <h3 id="modal-deploy-title" className="text-base font-bold text-slate-800">Deploy New Telemetry Station</h3>
          </div>
          <button 
            type="button"
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" 
            onClick={handleClose} 
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 my-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
          <div>
            <label htmlFor="station-name-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Station Name & Location Reference
            </label>
            <input 
              id="station-name-input"
              type="text" 
              placeholder="e.g. Siak Peatland Zone B"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              autoFocus
              className="w-full h-10 px-3.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="station-client-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Assigned Enterprise Client
            </label>
            <ComboBox
              id="station-client-select"
              options={clients.map(c => ({ value: c.id, label: c.name }))}
              value={formData.clientId}
              onChange={(val) => val && setFormData({ ...formData, clientId: val })}
              placeholder="Pilih Klien..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="station-lat-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Latitude (S/N)
              </label>
              <input 
                id="station-lat-input"
                type="number" 
                step="any"
                value={formData.latitude}
                onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                required
                className="w-full h-10 px-3.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="station-lon-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Longitude (E/W)
              </label>
              <input 
                id="station-lon-input"
                type="number" 
                step="any"
                value={formData.longitude}
                onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                required
                className="w-full h-10 px-3.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer select-none">
              <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Waves size={14} className="text-blue shrink-0" />
                Equip with Peatland Groundwater Table (TMAT) Piezometer
              </span>
              <Toggle
                checked={formData.hasTmat}
                onChange={e => setFormData({ ...formData, hasTmat: e.target.checked })}
                size="sm"
                color="primary"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 mt-5">
            <button 
              type="button" 
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer" 
              onClick={handleClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-semibold text-white bg-blue hover:bg-blue2 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Deploy Station
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
