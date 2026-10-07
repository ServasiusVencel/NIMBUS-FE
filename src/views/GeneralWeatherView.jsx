import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { CurrentWeatherOverview } from '../components/weather/CurrentWeatherOverview';
import { Forecast10DayGrid } from '../components/weather/Forecast10DayGrid';
import { HistoricalTelemetryTable } from '../components/weather/HistoricalTelemetryTable';
import { ComboBox } from '../components/ui/combo-box';
import { Download, CloudRain } from 'lucide-react';

/**
 * GeneralWeatherView: Dedicated Weather Intelligence View.
 * Orchestrates real-time weather observations, localized sensor parameters,
 * and AI 10-day forward meteorological forecasts.
 */
export const GeneralWeatherView = () => {
  const { 
    activeSensor, 
    activeSensorId, 
    setActiveSensorId, 
    sensors, 
    forecast10Days,
    setActiveTab: setActiveAppTab 
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'forecast' | 'historical'
  const [apiForecast, setApiForecast] = useState([]);
  const [loadingForecast, setLoadingForecast] = useState(false);

  // Sync with API if live
  useEffect(() => {
    let isMounted = true;
    async function loadForecast() {
      if (!activeSensor) return;
      setLoadingForecast(true);
      try {
        const payload = {
          water_table_depth_cm: activeSensor.currentReadings?.water_table_depth_cm ?? -48.5,
          soil_moisture_pct: activeSensor.currentReadings?.soil_moisture_pct ?? 78.0,
          air_temperature_c: activeSensor.currentReadings?.air_temperature_c ?? 32.5,
          relative_humidity_pct: activeSensor.currentReadings?.relative_humidity_pct ?? 68.0,
          solar_radiation_wm2: activeSensor.currentReadings?.solar_radiation_wm2 ?? 820.0,
          rainfall_intensity_mmh: activeSensor.currentReadings?.rainfall_intensity_mmh ?? 0.0,
        };
        const res = await apiService.get10DayForecast(payload);
        if (isMounted && res.prediksi_10_hari) {
          setApiForecast(res.prediksi_10_hari);
        }
      } catch (err) {
        console.warn('Forecast API fetch error:', err);
      } finally {
        if (isMounted) setLoadingForecast(false);
      }
    }
    loadForecast();
    return () => { isMounted = false; };
  }, [activeSensorId, activeSensor]);

  // Sample historical records for 'historical' tab
  const sampleHistoricalRecords = [
    { time: '29 Sep 2026, 14:00 WIB', temp: '32.4°C', rh: '52%', solar: '710 W/m²', rain: '0.0 mm', wind: '2.8 m/s', tmat: '-48.5 cm' },
    { time: '29 Sep 2026, 13:00 WIB', temp: '32.1°C', rh: '54%', solar: '690 W/m²', rain: '0.0 mm', wind: '2.5 m/s', tmat: '-48.3 cm' },
    { time: '29 Sep 2026, 12:00 WIB', temp: '31.8°C', rh: '58%', solar: '650 W/m²', rain: '0.0 mm', wind: '2.1 m/s', tmat: '-48.0 cm' },
    { time: '29 Sep 2026, 11:00 WIB', temp: '30.5°C', rh: '63%', solar: '590 W/m²', rain: '0.0 mm', wind: '1.9 m/s', tmat: '-47.8 cm' },
    { time: '29 Sep 2026, 10:00 WIB', temp: '29.2°C', rh: '68%', solar: '510 W/m²', rain: '0.0 mm', wind: '1.8 m/s', tmat: '-47.6 cm' },
  ];

  const currentForecastList = apiForecast.length > 0 ? apiForecast : forecast10Days;
  const isTmatEquipped = activeSensor?.isTmatEquipped ? activeSensor.isTmatEquipped() : !!activeSensor?.capabilities?.groundwater_tmat;

  return (
    <section id="screen-weather" className="space-y-6 animate-fade-in min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
              <CloudRain size={18} />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              General Weather Intelligence
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Observasi meteorologi real-time mikroklimat stasiun dan model prediksi forward 10 hari AI.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <div className="w-64 sm:w-72">
            <ComboBox
              options={sensors.map(s => ({ value: s.id, label: `${s.id} · ${s.name || s.id}` }))}
              value={activeSensor?.id}
              onChange={(selectedId) => selectedId && setActiveSensorId(selectedId)}
              placeholder="Pilih Stasiun AWS..."
            />
          </div>

          <button
            type="button"
            onClick={() => setActiveAppTab('download')}
            className="h-10 px-3.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
            title="Buka Halaman Ekspor Data Lengkap"
          >
            <Download size={13} className="text-sky-600" />
            <span className="hidden sm:inline">Pusat</span> Ekspor Data
          </button>
        </div>
      </div>

      {/* Weather Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Ringkasan Observasi' },
          { id: 'forecast', label: 'Prediksi 10 Hari (AI)' },
          { id: 'historical', label: 'Tabel Riwayat 24 Jam' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-sky-500 text-sky-600 bg-sky-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. Overview Tab: Current Observations */}
      {activeTab === 'overview' && (
        <CurrentWeatherOverview sensor={activeSensor} />
      )}

      {/* 2. 10-Day Forecast Model */}
      {(activeTab === 'overview' || activeTab === 'forecast') && (
        <Forecast10DayGrid
          forecastList={currentForecastList}
          loading={loadingForecast}
        />
      )}

      {/* 3. Historical Telemetry Table Tab */}
      {activeTab === 'historical' && (
        <HistoricalTelemetryTable
          records={sampleHistoricalRecords}
          isTmatEquipped={isTmatEquipped}
        />
      )}
    </section>
  );
};

export default GeneralWeatherView;
