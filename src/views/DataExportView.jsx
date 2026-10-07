import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Download } from 'lucide-react';
import { TelemetryExportRequest } from '../models/TelemetryExportRequest';
import {
  ExportScopeCard,
  ExportVariablesCard,
  ExportActionSummaryCard,
  ExportPreviewTable,
  ExportHistoryLog
} from '../components/export';

export const DataExportView = () => {
  const { visibleSensors, activeClient } = useApp();

  // Export parameters state
  const [targetStation, setTargetStation] = useState('all');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-29');
  const [datePreset, setDatePreset] = useState('30days');
  const [resolution, setResolution] = useState('hourly');
  const [fileFormat, setFileFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Selected telemetry parameter channels
  const [selectedParams, setSelectedParams] = useState({
    air_temp: true,
    humidity: true,
    solar_rad: true,
    rainfall: true,
    wind: true,
    tmat: true,
    soil: true,
    battery: true
  });

  // Export history log state
  const [downloadHistory, setDownloadHistory] = useState([
    {
      id: 'exp-1',
      filename: 'Nimbus_Telemetry_AWS-FLEET_2026-09-01_to_2026-09-29.csv',
      station: 'Seluruh Armada (6 Stasiun)',
      range: '01 Sep - 29 Sep 2026',
      size: '284 KB',
      timestamp: 'Hari ini, 14:20 WIB',
      format: 'CSV'
    },
    {
      id: 'exp-2',
      filename: 'Nimbus_Telemetry_AWS-PLG-01_2026-09-15_to_2026-09-22.csv',
      station: 'AWS-PLG-01',
      range: '15 Sep - 22 Sep 2026',
      size: '48 KB',
      timestamp: 'Kemarin, 09:12 WIB',
      format: 'CSV'
    }
  ]);

  // Instantiate OOP Domain Model
  const exportRequest = useMemo(() => {
    return new TelemetryExportRequest({
      targetStation,
      startDate,
      endDate,
      resolution,
      fileFormat,
      selectedParams,
      sensors: visibleSensors
    });
  }, [targetStation, startDate, endDate, resolution, fileFormat, selectedParams, visibleSensors]);

  // Date Preset quick handlers
  const handlePresetSelect = (preset) => {
    setDatePreset(preset);
    const end = new Date('2026-09-29');
    let start = new Date(end);

    if (preset === '7days') {
      start.setDate(end.getDate() - 7);
    } else if (preset === '30days') {
      start.setDate(end.getDate() - 30);
    } else if (preset === '90days') {
      start.setDate(end.getDate() - 90);
    } else {
      return;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const handleToggleParam = (paramKey) => {
    setSelectedParams(prev => ({ ...prev, [paramKey]: !prev[paramKey] }));
  };

  const handleSelectAllParams = (select) => {
    const updated = {};
    exportRequest.availableVariables.forEach(v => {
      updated[v.key] = select;
    });
    setSelectedParams(updated);
  };

  // Trigger export using the OOP domain entity method
  const handleExecuteExport = (historyItem = null) => {
    setIsExporting(true);

    setTimeout(() => {
      try {
        let requestToDownload = exportRequest;

        // If triggered from re-downloading a specific history item, honor that item's format
        if (historyItem && historyItem.format) {
          requestToDownload = new TelemetryExportRequest({
            targetStation,
            startDate,
            endDate,
            resolution,
            fileFormat: historyItem.format.toLowerCase(),
            selectedParams,
            sensors: visibleSensors
          });
        }

        requestToDownload.executeDownload();

        // Record export in history log
        setDownloadHistory(prev => [
          {
            id: `exp-${Date.now()}`,
            filename: requestToDownload.defaultFileName,
            station: requestToDownload.stationLabel,
            range: `${startDate} s/d ${endDate}`,
            size: requestToDownload.formattedFileSize,
            timestamp: 'Baru saja',
            format: (historyItem?.format || fileFormat).toUpperCase()
          },
          ...prev
        ]);

        setIsExporting(false);
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3500);
      } catch (err) {
        console.error('Export download error:', err);
        setIsExporting(false);
        alert(`Gagal mengunduh berkas: ${err?.message || 'Terjadi kesalahan saat memproses dokumen.'}`);
      }
    }, 600);
  };

  // Generate real-time preview sample rows from domain entity
  const previewRows = useMemo(() => {
    return exportRequest.generatePreviewRows(5);
  }, [exportRequest]);

  return (
    <section id="screen-data-export" className="space-y-6 animate-fade-in min-w-0">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
              <Download size={18} />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Ekspor Data
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Unduh data sensor AWS ke format CSV, JSON, atau PDF.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            {activeClient?.name || 'PT Agrindo Nusantara'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-w-0">

        <div className="lg:col-span-8 space-y-5">
          <ExportScopeCard
            sensors={visibleSensors}
            targetStation={targetStation}
            onTargetStationChange={setTargetStation}
            resolution={resolution}
            onResolutionChange={setResolution}
            datePreset={datePreset}
            onDatePresetChange={handlePresetSelect}
            startDate={startDate}
            onStartDateChange={(val) => {
              setStartDate(val);
              setDatePreset('custom');
            }}
            endDate={endDate}
            onEndDateChange={(val) => {
              setEndDate(val);
              setDatePreset('custom');
            }}
          />

          <ExportVariablesCard
            variables={exportRequest.availableVariables}
            selectedParams={selectedParams}
            onToggleParam={handleToggleParam}
            onSelectAll={handleSelectAllParams}
          />
        </div>

        <div className="lg:col-span-4">
          <ExportActionSummaryCard
            fileFormat={fileFormat}
            onFileFormatChange={setFileFormat}
            exportRequest={exportRequest}
            isExporting={isExporting}
            exportSuccess={exportSuccess}
            onExport={handleExecuteExport}
          />
        </div>

      </div>

      <ExportPreviewTable rows={previewRows} />

      <ExportHistoryLog
        history={downloadHistory}
        onReDownload={handleExecuteExport}
      />

    </section>
  );
};

export default DataExportView;
