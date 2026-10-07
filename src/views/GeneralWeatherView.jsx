import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';

export const GeneralWeatherView = () => {
  const { activeSensor, activeSensorId, setActiveSensorId, sensors } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // overview, forecast, historical, download
  const [forecastData, setForecastData] = useState([]);
  const [loadingForecast, setLoadingForecast] = useState(false);

  // Download inputs
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-29');
  const [selectedVar, setSelectedVar] = useState('All Weather Variables');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Fetch forecast from API if live
  useEffect(() => {
    let isMounted = true;
    async function loadForecast() {
      setLoadingForecast(true);
      try {
        const payload = {
          water_table_depth_cm: activeSensor?.currentReadings?.water_table_depth_cm || -48.5,
          soil_moisture_pct: activeSensor?.currentReadings?.soil_moisture_pct || 78.0,
          air_temperature_c: activeSensor?.currentReadings?.air_temperature_c || 32.5,
          relative_humidity_pct: activeSensor?.currentReadings?.relative_humidity_pct || 68.0,
          solar_radiation_wm2: activeSensor?.currentReadings?.solar_radiation_wm2 || 820.0,
          rainfall_intensity_mmh: activeSensor?.currentReadings?.rainfall_intensity_mmh || 0.0,
        };
        const res = await apiService.get10DayForecast(payload);
        if (isMounted && res.prediksi_10_hari) {
          setForecastData(res.prediksi_10_hari);
        }
      } catch (err) {
        console.warn('Forecast API fetch error:', err);
      } finally {
        if (isMounted) setLoadingForecast(false);
      }
    }
    loadForecast();
    return () => { isMounted = false; };
  }, [activeSensorId]);

  // Fallback 10-day forecast if API is busy
  const defaultForecast = [
    { day: 'Mon', date: '29 Sep', icon: '☀', max: '33°', min: '24°', pop: '0%', fwi: 'High' },
    { day: 'Tue', date: '30 Sep', icon: '🌤', max: '32°', min: '24°', pop: '10%', fwi: 'High' },
    { day: 'Wed', date: '1 Oct', icon: '🌧', max: '31°', min: '24°', pop: '40%', fwi: 'Moderate' },
    { day: 'Thu', date: '2 Oct', icon: '🌧', max: '30°', min: '23°', pop: '80%', fwi: 'Low' },
    { day: 'Fri', date: '3 Oct', icon: '🌧', max: '31°', min: '23°', pop: '60%', fwi: 'Moderate' },
    { day: 'Sat', date: '4 Oct', icon: '☀', max: '32°', min: '24°', pop: '10%', fwi: 'High' },
    { day: 'Sun', date: '5 Oct', icon: '☀', max: '33°', min: '24°', pop: '0%', fwi: 'High' },
    { day: 'Mon', date: '6 Oct', icon: '☀', max: '33°', min: '24°', pop: '0%', fwi: 'High' },
    { day: 'Tue', date: '7 Oct', icon: '☀', max: '32°', min: '24°', pop: '5%', fwi: 'Moderate' },
    { day: 'Wed', date: '8 Oct', icon: '🌧', max: '31°', min: '23°', pop: '30%', fwi: 'Moderate' },
  ];

  const handleDownload = () => {
    setDownloadSuccess(true);
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Timestamp,Station_ID,Air_Temp_C,Relative_Humidity_Pct,Solar_Rad_Wm2,Rainfall_mm,Water_Table_cm\n" +
      `2026-09-29 14:00:00,${activeSensor?.id || 'AWS-PLG-01'},32.5,68,820,0,-48.5\n` +
      `2026-09-29 13:00:00,${activeSensor?.id || 'AWS-PLG-01'},32.1,69,810,0,-48.2\n` +
      `2026-09-29 12:00:00,${activeSensor?.id || 'AWS-PLG-01'},31.8,71,780,0,-48.0\n` +
      `2026-09-29 11:00:00,${activeSensor?.id || 'AWS-PLG-01'},30.9,74,720,0,-47.9\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Nimbus_Telemetry_${activeSensor?.id || 'PLG-01'}_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <section id="screen-weather" className="screen active">
      <div className="page-title">
        <div>
          <h2>General Weather</h2>
          <p>Real-time observations, 10-day forecast and downloadable sensor data.</p>
        </div>
        <select
          className="select"
          value={activeSensor?.id}
          onChange={(e) => setActiveSensorId(e.target.value)}
        >
          {sensors.map(s => (
            <option key={s.id} value={s.id}>{s.id} · {s.name || s.id}</option>
          ))}
        </select>
      </div>

      <div className="tabs">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={activeTab === 'forecast' ? 'active' : ''} onClick={() => setActiveTab('forecast')}>10-Day Forecast</button>
        <button className={activeTab === 'historical' ? 'active' : ''} onClick={() => setActiveTab('historical')}>Historical Data</button>
        <button className={activeTab === 'download' ? 'active' : ''} onClick={() => setActiveTab('download')}>Download</button>
      </div>

      {/* Current Weather Grid */}
      <div className="weather-current">
        <div className="card">
          <span className="muted">Current Weather · 29 Sep 2026, 14:00 WIB</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 18 }}>
            <div style={{ fontSize: 48 }}>☀</div>
            <div>
              <div className="metric-big">
                {activeSensor?.currentReadings?.air_temperature_c?.toFixed(1) || '32.5'}°C
              </div>
              <div className="muted">{activeSensor?.condition || 'Clear Sky'}</div>
            </div>
          </div>
          <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--line)', display: 'flex', gap: 18, fontSize: 12 }}>
            <div>Station: <b>{activeSensor?.id || 'AWS-PLG-01'}</b></div>
            <div>GPS: <b>{activeSensor?.latitude?.toFixed(4)}, {activeSensor?.longitude?.toFixed(4)}</b></div>
            <div>Status: <span className="pill">Online</span></div>
          </div>
        </div>

        <div className="card">
          <h3>Sensor Variables</h3>
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
            <span>Air Temperature</span>
            <b style={{ color: 'var(--text)' }}>{activeSensor?.currentReadings?.air_temperature_c || '32.5'}°C</b>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
            <span>Relative Humidity</span>
            <b style={{ color: 'var(--text)' }}>{activeSensor?.currentReadings?.relative_humidity_pct || '68'}%</b>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
            <span>Solar Radiation</span>
            <b style={{ color: 'var(--text)' }}>{activeSensor?.currentReadings?.solar_radiation_wm2 || '820'} W/m²</b>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
            <span>Rainfall</span>
            <b style={{ color: 'var(--text)' }}>{activeSensor?.currentReadings?.rainfall_intensity_mmh || '0'} mm</b>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
            <span>Water Table Depth (TMAT)</span>
            <b style={{ color: activeSensor?.currentReadings?.water_table_depth_cm < -40 ? 'var(--red)' : 'var(--green)' }}>
              {activeSensor?.currentReadings?.water_table_depth_cm || '-48.5'} cm
            </b>
          </p>
        </div>
      </div>

      {/* 10-Day Forecast */}
      <div className="card" style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>10-Day Forecast</h3>
          {loadingForecast && <span className="muted" style={{ fontSize: 12 }}>Syncing with AI Forecaster...</span>}
        </div>
        <div className="forecast">
          {(forecastData.length > 0 ? forecastData : defaultForecast).map((item, idx) => {
            const dayName = item.day || `Day ${idx + 1}`;
            const dateStr = item.date || item.tanggal || '';
            const temp = item.max || (item.detail_cuaca ? `${Math.round(item.detail_cuaca.suhu_c)}°` : '32°');
            const pop = item.pop || (item.detail_cuaca ? `${Math.round(item.detail_cuaca.probabilitas_hujan * 100)}%` : '10%');
            const icon = item.icon || (item.hujan === 'Tinggi' ? '🌧' : item.hujan === 'Sedang' ? '🌤' : '☀');

            return (
              <div className="day" key={idx}>
                <strong>{dayName}<br />{dateStr}</strong>
                <div className="icon">{icon}</div>
                <b>{temp}</b><br />
                <span className="muted">24° · {pop}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Download Historical Data Card */}
      <div className="card" style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Download Historical Data</h3>
          <button className="primary" style={{ height: 38, padding: '0 16px' }} onClick={handleDownload}>
            {downloadSuccess ? '✓ Downloaded' : 'Download CSV'}
          </button>
        </div>
        <p>
          Select date range and variables. Water table level is automatically available for sensors equipped with the additional groundwater sensor.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
          <input
            type="date"
            className="select"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="select"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <select
            className="select"
            value={selectedVar}
            onChange={(e) => setSelectedVar(e.target.value)}
          >
            <option>All Weather Variables</option>
            <option>Air Temperature</option>
            <option>Humidity</option>
            <option>Solar Radiation</option>
            <option>Groundwater Level</option>
          </select>
        </div>
      </div>
    </section>
  );
};
