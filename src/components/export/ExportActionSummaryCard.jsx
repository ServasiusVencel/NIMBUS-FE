import React from 'react';
import { FileSpreadsheet, Database, Download, CheckCircle2, HardDrive, FileText } from 'lucide-react';

export const ExportActionSummaryCard = ({
  fileFormat = 'csv',
  onFileFormatChange,
  exportRequest,
  isExporting = false,
  exportSuccess = false,
  onExport
}) => {
  const stationLabel = exportRequest?.stationLabel || 'Seluruh Armada';
  const startDate = exportRequest?.startDate || '-';
  const endDate = exportRequest?.endDate || '-';
  const estimatedRows = exportRequest?.estimatedRowsCount?.toLocaleString() || '2,880';
  const estimatedSize = exportRequest?.formattedFileSize || '245 KB';

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-sm text-slate-800">
            <FileSpreadsheet size={16} className="text-sky-600" />
            <span>Format & Unduh</span>
          </div>

          <div className="my-4 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Format Berkas
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onFileFormatChange('csv')}
                className={`py-2 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition ${fileFormat === 'csv'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                  }`}
              >
                <FileSpreadsheet size={14} />
                <span>CSV</span>
              </button>

              <button
                type="button"
                onClick={() => onFileFormatChange('json')}
                className={`py-2 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition ${fileFormat === 'json'
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-300 shadow-2xs'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                  }`}
              >
                <Database size={14} />
                <span>JSON</span>
              </button>

              <button
                type="button"
                onClick={() => onFileFormatChange('pdf')}
                className={`py-2 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition ${fileFormat === 'pdf'
                    ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-2xs'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                  }`}
              >
                <FileText size={14} />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Dynamic Dataset Summary Specs */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Stasiun:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[180px] text-right">
                {stationLabel}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Periode:</span>
              <span className="font-mono text-slate-800">{startDate} s/d {endDate}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimasi:</span>
              <span className="font-semibold text-slate-800">~{estimatedRows} baris ({estimatedSize})</span>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div>
          <button
            type="button"
            onClick={onExport}
            disabled={isExporting}
            className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm ${exportSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-600/25'
                : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/25 hover:shadow-md'
              }`}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Mengemas Data...</span>
              </>
            ) : exportSuccess ? (
              <>
                <CheckCircle2 size={17} />
                <span>Berhasil Diunduh!</span>
              </>
            ) : (
              <>
                <Download size={17} />
                <span>Unduh ({fileFormat.toUpperCase()})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportActionSummaryCard;
