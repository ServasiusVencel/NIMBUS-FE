import React from 'react';
import { Layers } from 'lucide-react';

/**
 * ExportVariablesCard: Displays interactive multi-select checkboxes
 * for choosing telemetry channels/columns included in the exported dataset.
 */
export const ExportVariablesCard = ({
  variables = [],
  selectedParams = {},
  onToggleParam,
  onSelectAll
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Layers size={16} className="text-sky-600" />
          <span>Parameter Sensor</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => onSelectAll(true)}
            className="text-sky-600 hover:text-sky-700 font-semibold cursor-pointer"
          >
            Pilih Semua
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={() => onSelectAll(false)}
            className="text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
          >
            Kosongkan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {variables.map(param => (
          <label
            key={param.key}
            className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition select-none ${
              selectedParams[param.key]
                ? 'bg-sky-50/60 border-sky-300 text-slate-800'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <input
              type="checkbox"
              checked={!!selectedParams[param.key]}
              onChange={() => onToggleParam(param.key)}
              className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            <div className="min-w-0">
              <span className="text-xs font-semibold block text-slate-800 truncate">{param.label}</span>
              <span className="text-xs text-slate-500 font-mono">{param.unit}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ExportVariablesCard;
