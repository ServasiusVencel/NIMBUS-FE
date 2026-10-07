import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { 
  Radio, 
  MapPin, 
  Thermometer, 
  Droplets, 
  Sun, 
  Waves, 
  Wind, 
  ArrowRight, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Compass,
  Gauge,
  Flame,
  CloudRain,
  Info
} from 'lucide-react';

// Component to dynamically fit map bounds to current markers
function MapBoundsUpdater({ sensors }) {
  const map = useMap();
  useEffect(() => {
    if (!sensors || sensors.length === 0) return;
    const bounds = L.latLngBounds(sensors.map(s => [s.latitude, s.longitude]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
  }, [sensors, map]);
  return null;
}

export const SensorMap = () => {
  const { visibleSensors, activeSensorId, setActiveSensorId, setActiveTab, userRole } = useApp();
  const [selectedSensor, setSelectedSensor] = useState(
    visibleSensors.find(s => s.id === activeSensorId) || visibleSensors[0]
  );

  useEffect(() => {
    const s = visibleSensors.find(s => s.id === activeSensorId);
    if (s) setSelectedSensor(s);
  }, [activeSensorId, visibleSensors]);

  // Create custom vector HTML markers with status colors
  const createCustomMarker = (sensor, isActive) => {
    const statusColor = sensor.status === 'online' ? '#10b981' : sensor.status === 'warning' ? '#f59e0b' : '#ef4444';
    const activeRing = isActive 
      ? 'box-shadow: 0 0 0 4px #0284c7, 0 10px 20px rgba(2,132,199,0.45); transform: scale(1.18); z-index: 1000;' 
      : 'box-shadow: 0 4px 12px rgba(0,0,0,0.18);';

    return L.divIcon({
      className: 'nimbus-map-marker-wrapper',
      html: `
        <div style="
          width: 38px;
          height: 38px;
          background: #ffffff;
          border-radius: 50%;
          border: 3.5px solid ${statusColor};
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          ${activeRing}
        ">
          <div style="
            width: 10px;
            height: 10px;
            background: ${statusColor};
            border-radius: 50%;
          "></div>
          <span style="
            position: absolute;
            bottom: -22px;
            left: 50%;
            transform: translateX(-50%);
            background: #0f172a;
            color: #ffffff;
            font-size: 10px;
            font-family: var(--font-mono);
            font-weight: 700;
            padding: 2px 7px;
            border-radius: 6px;
            white-space: nowrap;
            letter-spacing: 0.02em;
            pointer-events: none;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          ">${sensor.id}</span>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });
  };

  const handleSelectStation = (sensor) => {
    setSelectedSensor(sensor);
    setActiveSensorId(sensor.id);
  };

  // Compute clear & simple hazard summaries for active sensor
  const fireLevel = selectedSensor?.fireRisk?.level || 'Moderate';
  const fireScore = selectedSensor?.fireRisk?.score || 0.45;
  const isFireHigh = fireLevel.toLowerCase().includes('high') || fireLevel.toLowerCase().includes('extreme');
  const isFireLow = fireLevel.toLowerCase().includes('low');

  const hasTmat = selectedSensor?.capabilities?.groundwater_tmat;
  const tmatVal = selectedSensor?.currentReadings?.water_table_depth_cm;
  const isDroughtCritical = hasTmat && tmatVal !== null && tmatVal < -40;
  const isDroughtWarning = (hasTmat && tmatVal !== null && tmatVal <= -30 && tmatVal >= -40) || (!hasTmat && selectedSensor?.currentReadings?.soil_moisture_pct < 65);

  const rainMm = selectedSensor?.currentReadings?.rainfall_intensity_mmh || 0.0;
  const isRaining = rainMm > 0;

  return (
    <div className="view-content animate-fade-in">
      {/* 1. TOP HEADER & STATION STATUS BAR */}
      <div className="nimbus-card map-overview-header-card">
        <div className="header-info-top">
          <div className="header-info-left">
            <div className="view-tag-row">
              <span className="view-tag">LIVE INTELLIGENCE DASHBOARD</span>
              <span className="station-active-pill font-mono">
                <Radio size={13} className="text-blue animate-pulse" />
                Stasiun Aktif: <strong>{selectedSensor?.id}</strong> ({selectedSensor?.name})
              </span>
            </div>
            <h2 className="view-title">Monitoring Iklim & Resiko Lingkungan</h2>
            <p className="view-subtitle">
              Ringkasan data real-time stasiun cuaca otomatis (AWS), analisis resiko kebakaran gambut, kekeringan muka air tanah (TMAT), dan intensitas curah hujan.
            </p>
          </div>

          {/* Sync Status Badge */}
          <div className="header-status-badge-group">
            <div className="header-sync-pill font-mono">
              <Clock size={14} className="text-muted" />
              <span>Update: <strong>{selectedSensor?.lastSync || 'Baru saja'}</strong></span>
            </div>
            <span className={`badge badge-${selectedSensor?.status || 'online'} text-sm`}>
              <span className={`dot dot-${selectedSensor?.status || 'online'}`} />
              {selectedSensor?.status?.toUpperCase() || 'ONLINE'}
            </span>
          </div>
        </div>

        {/* Ringkasan Cepat Multi-Bahaya (Tingkat Kebakaran, Kekeringan, & Intensitas Hujan) */}
        <div className="quick-overview-hazard-bar">
          <div className="hazard-kpi-item">
            <div className="hazard-kpi-icon-box bg-red-light">
              <Flame size={16} className="text-danger" />
            </div>
            <div className="hazard-kpi-info">
              <span className="hazard-kpi-label">Tingkat Kebakaran:</span>
              <div className="hazard-kpi-val-row">
                <span className={`hazard-kpi-badge font-bold ${isFireHigh ? 'text-danger' : isFireLow ? 'text-emerald' : 'text-amber'}`}>
                  {fireLevel === 'Low' ? 'Rendah' : fireLevel === 'Moderate' ? 'Sedang' : fireLevel === 'High' ? 'Tinggi' : 'Ekstrim'}
                </span>
                <span className="hazard-kpi-sub font-mono">FWI: {fireScore.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="hazard-kpi-divider" />

          <div className="hazard-kpi-item">
            <div className="hazard-kpi-icon-box bg-teal-light">
              <Waves size={16} className="text-teal" />
            </div>
            <div className="hazard-kpi-info">
              <span className="hazard-kpi-label">Tingkat Kekeringan:</span>
              <div className="hazard-kpi-val-row">
                <span className={`hazard-kpi-badge font-bold ${isDroughtCritical ? 'text-danger' : isDroughtWarning ? 'text-amber' : 'text-emerald'}`}>
                  {isDroughtCritical ? 'Kritis (Kering)' : isDroughtWarning ? 'Waspada' : 'Aman (Lembab)'}
                </span>
                <span className="hazard-kpi-sub font-mono">
                  {hasTmat ? `TMAT: ${tmatVal} cm` : `Tanah: ${selectedSensor?.currentReadings?.soil_moisture_pct || 80}%`}
                </span>
              </div>
            </div>
          </div>

          <div className="hazard-kpi-divider" />

          <div className="hazard-kpi-item">
            <div className="hazard-kpi-icon-box bg-blue-light">
              <CloudRain size={16} className="text-blue" />
            </div>
            <div className="hazard-kpi-info">
              <span className="hazard-kpi-label">Intensitas Hujan:</span>
              <div className="hazard-kpi-val-row">
                <span className={`hazard-kpi-badge font-bold ${isRaining ? 'text-blue' : 'text-slate-700'}`}>
                  {isRaining ? (rainMm > 20 ? 'Hujan Sangat Lebat' : rainMm > 10 ? 'Hujan Lebat' : 'Hujan Ringan') : '0.0 mm/jam (Kering)'}
                </span>
                <span className="hazard-kpi-sub font-mono">
                  {rainMm.toFixed(1)} mm/jam
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RINGKASAN DETAIL 3 KARTU: KEBAKARAN, KEKERINGAN, & INTENSITAS HUJAN */}
      <div className="hazard-summary-trio">
        {/* Card 1: Tingkat Kebakaran */}
        <div className={`nimbus-card hazard-card ${isFireHigh ? 'hazard-card-danger' : isFireLow ? 'hazard-card-safe' : 'hazard-card-warning'}`}>
          <div className="hazard-card-top">
            <div className="hazard-icon-title">
              <div className={`hazard-icon-box ${isFireHigh ? 'icon-danger-bg' : isFireLow ? 'icon-emerald-bg' : 'icon-amber-bg'}`}>
                <Flame size={22} className={isFireHigh ? 'text-danger' : isFireLow ? 'text-emerald' : 'text-amber'} />
              </div>
              <div>
                <span className="hazard-eyebrow">PSEUDO-FWI & CUACA</span>
                <h3 className="hazard-title">Tingkat Kebakaran</h3>
              </div>
            </div>
            <span className={`hazard-badge ${isFireHigh ? 'badge-danger' : isFireLow ? 'badge-online' : 'badge-warning'}`}>
              {fireLevel === 'Low' ? 'RENDAH' : fireLevel === 'Moderate' ? 'SEDANG' : fireLevel === 'High' ? 'TINGGI' : 'SANGAT TINGGI'}
            </span>
          </div>

          <div className="hazard-main-metric">
            <div className="hazard-score-wrap">
              <span className="hazard-score-num font-mono">{fireScore.toFixed(2)}</span>
              <span className="hazard-score-max">/ 1.0 (FWI)</span>
            </div>
            <div className="hazard-mini-tags font-mono">
              <span>Suhu: <strong>{selectedSensor?.currentReadings?.air_temperature_c}°C</strong></span>
              <span>RH: <strong>{selectedSensor?.currentReadings?.relative_humidity_pct}%</strong></span>
            </div>
          </div>

          <div className="hazard-message-box">
            {isFireHigh ? (
              <p className="hazard-desc text-danger-dark">
                🚨 <strong>WASPADA TINGGI:</strong> Daun & serasah sangat kering karena suhu panas ({selectedSensor?.currentReadings?.air_temperature_c}°C). Rawan percikan api. <em>Siagakan regu pemadam & patroli blok rawan.</em>
              </p>
            ) : isFireLow ? (
              <p className="hazard-desc text-emerald-dark">
                ✓ <strong>KONDISI AMAN:</strong> Kelembapan udara cukup tinggi ({selectedSensor?.currentReadings?.relative_humidity_pct}%). Potensi penyebaran api kebakaran lahan rendah.
              </p>
            ) : (
              <p className="hazard-desc text-warning-dark">
                ⚠️ <strong>POTENSI SEDANG:</strong> Fluktuasi panas matahari siang hari. Tetap awasi titik api dan bukaan lahan.
              </p>
            )}
          </div>
        </div>

        {/* Card 2: Tingkat Kekeringan & Gambut (TMAT) */}
        <div className={`nimbus-card hazard-card ${isDroughtCritical ? 'hazard-card-danger' : isDroughtWarning ? 'hazard-card-warning' : 'hazard-card-safe'}`}>
          <div className="hazard-card-top">
            <div className="hazard-icon-title">
              <div className={`hazard-icon-box ${isDroughtCritical ? 'icon-danger-bg' : isDroughtWarning ? 'icon-amber-bg' : 'icon-teal-bg'}`}>
                <Waves size={22} className={isDroughtCritical ? 'text-danger' : isDroughtWarning ? 'text-amber' : 'text-teal'} />
              </div>
              <div>
                <span className="hazard-eyebrow">HIDROLOGI GAMBUT (TMAT)</span>
                <h3 className="hazard-title">Tingkat Kekeringan</h3>
              </div>
            </div>
            <span className={`hazard-badge ${isDroughtCritical ? 'badge-danger' : isDroughtWarning ? 'badge-warning' : 'badge-online'}`}>
              {isDroughtCritical ? 'KRITIS (KERING)' : isDroughtWarning ? 'WASPADA' : 'AMAN (LEMBAB)'}
            </span>
          </div>

          <div className="hazard-main-metric">
            <div className="hazard-score-wrap">
              {hasTmat ? (
                <>
                  <span className="hazard-score-num font-mono">{tmatVal}</span>
                  <span className="hazard-score-max">cm (TMAT)</span>
                </>
              ) : (
                <>
                  <span className="hazard-score-num font-mono">{selectedSensor?.currentReadings?.soil_moisture_pct || 80}</span>
                  <span className="hazard-score-max">% (Tanah)</span>
                </>
              )}
            </div>
            <div className="hazard-mini-tags font-mono">
              {hasTmat ? (
                <>
                  <span>Batas Aman: <strong>-40.0 cm</strong></span>
                  <span className={isDroughtCritical ? 'text-danger font-bold' : 'text-emerald font-semibold'}>
                    {isDroughtCritical ? '⚠️ Melewati Batas Aman' : '✓ Di Atas Batas'}
                  </span>
                </>
              ) : (
                <span>Kelembaban Tanah: <strong>{selectedSensor?.currentReadings?.soil_moisture_pct}%</strong></span>
              )}
            </div>
          </div>

          <div className="hazard-message-box">
            {isDroughtCritical ? (
              <p className="hazard-desc text-danger-dark">
                🚨 <strong>MUKA AIR TURUN:</strong> Air tanah gambut ({tmatVal} cm) di bawah batas regulasi nasional (-40 cm). <em>Segera tutup pintu sekat kanal (canal blocking) untuk retensi air.</em>
              </p>
            ) : isDroughtWarning ? (
              <p className="hazard-desc text-warning-dark">
                ⚠️ <strong>PENURUNAN MUKA AIR:</strong> Mulai mendekati batas kering. Pantau retensi air di parit & kanal kebun.
              </p>
            ) : (
              <p className="hazard-desc text-emerald-dark">
                ✓ <strong>TATA AIR STABIL:</strong> Cadangan air tanah dalam batas optimal ({tmatVal} cm). Lapisan gambut bawah tanah basah & aman.
              </p>
            )}
          </div>
        </div>

        {/* Card 3: Intensitas Hujan */}
        <div className={`nimbus-card hazard-card ${isRaining ? 'hazard-card-rain' : 'hazard-card-neutral'}`}>
          <div className="hazard-card-top">
            <div className="hazard-icon-title">
              <div className="hazard-icon-box icon-blue-bg">
                <CloudRain size={22} className="text-blue" />
              </div>
              <div>
                <span className="hazard-eyebrow">PRESIPITASI AKTIF</span>
                <h3 className="hazard-title">Intensitas Hujan</h3>
              </div>
            </div>
            <span className={`hazard-badge ${isRaining ? 'badge-info' : 'badge-neutral'}`}>
              {isRaining ? (rainMm > 20 ? 'LEBAT' : rainMm > 10 ? 'SEDANG' : 'RINGAN') : '0.0 mm/jam (KERING)'}
            </span>
          </div>

          <div className="hazard-main-metric">
            <div className="hazard-score-wrap">
              <span className="hazard-score-num font-mono">{rainMm.toFixed(1)}</span>
              <span className="hazard-score-max">mm / jam</span>
            </div>
            <div className="hazard-mini-tags font-mono">
              <span>Kecepatan Angin: <strong>{selectedSensor?.currentReadings?.wind_speed_ms} m/s</strong></span>
              <span>Radiasi Surya: <strong>{selectedSensor?.currentReadings?.solar_radiation_wm2} W/m²</strong></span>
            </div>
          </div>

          <div className="hazard-message-box">
            {isRaining ? (
              <p className="hazard-desc text-blue-dark">
                🌧️ <strong>PRESIPITASI AKTIF:</strong> Sedang berlangsung hujan ({rainMm} mm/jam). <em>Tunda pemupukan tanah & penyemprotan bahan kimia untuk menghindari hanyut (runoff).</em>
              </p>
            ) : (
              <p className="hazard-desc text-secondary">
                ☀️ <strong>CUACA KERING / CERAH:</strong> Tidak ada hujan terukur (0.0 mm/jam). <em>Kondisi ideal untuk pemupukan tanah & mobilisasi kendaraan panen di lahan.</em>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD: MAP & TELEMETRY DETAIL (RESPONSIVE GRID) */}
      <div className="map-dashboard-grid">
        {/* Left: Map Container with Quick Station Selector */}
        <div className="nimbus-card map-frame-card">
          <div className="map-frame-toolbar">
            <div className="station-quick-pills">
              <span className="pills-label"><Radio size={14} /> Pilih Stasiun:</span>
              {visibleSensors.map(s => (
                <button
                  key={s.id}
                  className={`station-pill-btn ${s.id === selectedSensor?.id ? 'active' : ''}`}
                  onClick={() => handleSelectStation(s)}
                >
                  <span className={`dot dot-${s.status}`} />
                  <span className="font-mono">{s.id}</span>
                  {s.capabilities.groundwater_tmat && <span className="pill-tmat">TMAT</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="map-inner-canvas">
            <MapContainer
              center={[-0.7893, 105.0]}
              zoom={6}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />

              <MapBoundsUpdater sensors={visibleSensors} />

              {visibleSensors.map((sensor) => (
                <Marker
                  key={sensor.id}
                  position={[sensor.latitude, sensor.longitude]}
                  icon={createCustomMarker(sensor, sensor.id === selectedSensor?.id)}
                  eventHandlers={{
                    click: () => handleSelectStation(sensor),
                  }}
                >
                  <Popup>
                    <div className="nimbus-mini-popup">
                      <div className="popup-header-row">
                        <span className="font-mono font-bold text-blue">{sensor.id}</span>
                        <span className={`badge badge-${sensor.status} font-mono text-xs`}>{sensor.status.toUpperCase()}</span>
                      </div>
                      <div className="popup-name font-semibold">{sensor.name}</div>
                      <div className="popup-coords font-mono text-muted text-xs">
                        GPS: {sensor.latitude.toFixed(4)}, {sensor.longitude.toFixed(4)}
                      </div>
                      <div className="popup-readings-preview">
                        <span>🌡️ Suhu: {sensor.currentReadings.air_temperature_c}°C</span>
                        <span>💧 Kelembaban: {sensor.currentReadings.relative_humidity_pct}%</span>
                        {sensor.capabilities.groundwater_tmat && (
                          <span className={sensor.currentReadings.water_table_depth_cm < -40 ? 'text-danger font-bold' : ''}>
                            🌊 TMAT: {sensor.currentReadings.water_table_depth_cm} cm
                          </span>
                        )}
                      </div>
                      <button 
                        className="btn btn-primary btn-sm btn-block mt-2"
                        onClick={() => {
                          handleSelectStation(sensor);
                          setActiveTab('weather');
                        }}
                      >
                        Buka Detail Cuaca &rarr;
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Right: Selected Station Telemetry Card */}
        {selectedSensor && (
          <div className="nimbus-card station-intelligence-card animate-fade-in">
            {/* Station Header */}
            <div className="station-intelligence-header">
              <div>
                <div className="station-code-row">
                  <span className="station-badge-id font-mono">{selectedSensor.id}</span>
                  <span className={`badge badge-${selectedSensor.status}`}>
                    <span className={`dot dot-${selectedSensor.status}`} />
                    {selectedSensor.status.toUpperCase()}
                  </span>
                  {selectedSensor.capabilities.groundwater_tmat && (
                    <span className="badge badge-info">Sensor TMAT</span>
                  )}
                </div>
                <h3 className="station-card-title">{selectedSensor.name}</h3>
                <div className="station-coords-line font-mono text-muted text-xs">
                  <MapPin size={12} className="inline mr-1 text-blue" />
                  {selectedSensor.latitude.toFixed(4)}° S, {selectedSensor.longitude.toFixed(4)}° E
                </div>
              </div>
              <div className="station-sync-pill font-mono">
                <Clock size={12} /> {selectedSensor.lastSync}
              </div>
            </div>

            {/* Quick Metrics 2x2 Grid */}
            <div className="station-metrics-compact-grid">
              {/* Air Temp */}
              <div className="compact-metric-card">
                <div className="compact-metric-top">
                  <span className="compact-metric-lbl">Suhu Udara</span>
                  <div className="compact-icon-wrap icon-amber"><Thermometer size={15} /></div>
                </div>
                <div className="compact-metric-val">
                  <span className="font-mono">{selectedSensor.currentReadings.air_temperature_c}</span>
                  <span className="compact-unit">°C</span>
                </div>
              </div>

              {/* Humidity */}
              <div className="compact-metric-card">
                <div className="compact-metric-top">
                  <span className="compact-metric-lbl">Kelembaban</span>
                  <div className="compact-icon-wrap icon-blue"><Droplets size={15} /></div>
                </div>
                <div className="compact-metric-val">
                  <span className="font-mono">{selectedSensor.currentReadings.relative_humidity_pct}</span>
                  <span className="compact-unit">%</span>
                </div>
              </div>

              {/* Solar Radiation */}
              <div className="compact-metric-card">
                <div className="compact-metric-top">
                  <span className="compact-metric-lbl">Radiasi Surya</span>
                  <div className="compact-icon-wrap icon-amber"><Sun size={15} /></div>
                </div>
                <div className="compact-metric-val">
                  <span className="font-mono">{selectedSensor.currentReadings.solar_radiation_wm2}</span>
                  <span className="compact-unit">W/m²</span>
                </div>
              </div>

              {/* Wind Speed */}
              <div className="compact-metric-card">
                <div className="compact-metric-top">
                  <span className="compact-metric-lbl">Angin</span>
                  <div className="compact-icon-wrap icon-blue"><Wind size={15} /></div>
                </div>
                <div className="compact-metric-val">
                  <span className="font-mono">{selectedSensor.currentReadings.wind_speed_ms}</span>
                  <span className="compact-unit">m/s</span>
                </div>
              </div>
            </div>

            {/* PEATLAND GROUNDWATER (TMAT) CARD */}
            {selectedSensor.capabilities.groundwater_tmat ? (
              <div className={`tmat-highlight-card ${isDroughtCritical ? 'tmat-alert' : 'tmat-safe'}`}>
                <div className="tmat-highlight-header">
                  <div className="tmat-title-wrap">
                    <Waves size={16} className="text-teal" />
                    <span className="font-semibold text-sm">Muka Air Tanah Gambut (TMAT)</span>
                  </div>
                  <span className={`badge ${isDroughtCritical ? 'badge-danger' : 'badge-online'} font-mono`}>
                    {isDroughtCritical ? 'BAHAYA KERING' : 'NORMAL AMAN'}
                  </span>
                </div>
                <div className="tmat-val-row">
                  <span className="tmat-large-val font-mono">{selectedSensor.currentReadings.water_table_depth_cm}</span>
                  <span className="tmat-unit">cm dari permukaan</span>
                </div>
                <div className="tmat-depth-bar">
                  <div 
                    className="tmat-depth-fill" 
                    style={{ 
                      width: `${Math.min(100, Math.max(10, Math.abs(selectedSensor.currentReadings.water_table_depth_cm || 0) * 1.2))}%`,
                      background: isDroughtCritical ? '#ef4444' : '#10b981'
                    }}
                  />
                  <div className="tmat-threshold-marker" style={{ left: '48%' }} title="Batas Nasional -40 cm" />
                </div>
                <div className="tmat-note-row text-xs">
                  <span>Batas Regulasi: <strong>-40.0 cm</strong></span>
                  <span className={isDroughtCritical ? 'text-danger font-semibold' : 'text-emerald font-semibold'}>
                    {isDroughtCritical ? '⚠️ Melampaui Batas Bahaya' : '✓ Hidrologi Terjaga Baik'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="tmat-not-equipped-card">
                <Waves size={16} className="text-muted" />
                <span className="text-xs text-muted">Stasiun AWS Standar: Tidak dilengkapi sensor kedalaman gambut (TMAT).</span>
              </div>
            )}

            {/* Quick Action Navigation Buttons */}
            <div className="station-card-actions">
              <button 
                className="btn btn-primary btn-weather-action"
                onClick={() => {
                  setActiveSensorId(selectedSensor.id);
                  setActiveTab('weather');
                }}
              >
                <div className="btn-action-left">
                  <CloudRain size={16} />
                  <span>Analisis Cuaca Detail</span>
                </div>
                <ArrowRight size={15} className="action-arrow" />
              </button>
              <button 
                className="btn btn-fire-action"
                onClick={() => {
                  setActiveSensorId(selectedSensor.id);
                  setActiveTab('fire');
                }}
              >
                <div className="btn-action-left">
                  <Flame size={16} className="text-danger" />
                  <span>Model Kebakaran & FWI</span>
                </div>
                <ArrowRight size={15} className="action-arrow" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
