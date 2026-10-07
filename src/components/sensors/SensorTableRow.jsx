import React from 'react';
import { Radio, Waves } from 'lucide-react';
import { SensorStation } from '../../models/SensorStation';
import { Toggle } from '../ui/Toggle';

export const SensorTableRow = ({ station, client, onToggleTmat }) => {
  const s = station instanceof SensorStation ? station : new SensorStation(station);

  const coords = s.formatCoordinates();
  const isEquipped = s.isTmatEquipped ? s.isTmatEquipped() : !!s.capabilities?.groundwater_tmat;
  const capabilities = s.activeCapabilityLabels || [];
  const isOnline = s.status === 'online';
  const isWarning = s.status === 'warning';

  return (
    <tr className="hover:bg-slate-50/70 transition-colors">
      {/* Station Name & ID */}
      <td className="py-3.5 px-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Radio size={15} />
          </div>
          <div>
            <div className="font-bold text-slate-800 text-xs">{s.name}</div>
            <div className="font-mono text-[11px] text-slate-400">ID: {s.id}</div>
          </div>
        </div>
      </td>

      {/* Assigned Client */}
      <td className="py-3.5 px-4">
        <span className="font-semibold text-slate-700">
          {client ? client.name : s.clientId}
        </span>
      </td>

      {/* GPS Coordinates */}
      <td className="py-3.5 px-4">
        <span className="font-mono text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
          {coords}
        </span>
      </td>

      {/* Online / Warning / Danger Badge */}
      <td className="py-3.5 px-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono border ${isOnline
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : isWarning
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-red-500'
            }`} />
          {s.status?.toUpperCase() || 'ONLINE'}
        </span>
      </td>

      {/* Capability Chips */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1 flex-wrap max-w-xs">
          {capabilities.map(cap => (
            <span
              key={cap}
              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600"
            >
              {cap}
            </span>
          ))}
        </div>
      </td>

      {/* TMAT Control Toggle */}
      <td className="py-3.5 px-5 text-right">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <span className={`text-[11px] font-semibold flex items-center gap-1 ${isEquipped ? 'text-teal-700' : 'text-slate-400'}`}>
            <Waves size={12} className={isEquipped ? 'text-teal-500' : 'text-slate-300'} />
            <span>{isEquipped ? 'Active' : 'Disabled'}</span>
          </span>
          <Toggle
            checked={isEquipped}
            onChange={() => onToggleTmat(s.id)}
            size="sm"
            color="primary"
            title={isEquipped ? 'TMAT Piezometer aktif (Muka Air Gambut terpantau)' : 'TMAT tidak aktif pada stasiun ini'}
          />
        </label>
      </td>
    </tr>
  );
};
