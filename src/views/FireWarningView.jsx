import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';

export const FireWarningView = () => {
  const { activeSensor, activeSensorId, setActiveSensorId, sensors } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Realtime FWI Calculation state
  const [calcTemp, setCalcTemp] = useState(33.5);
  const [calcRH, setCalcRH] = useState(48.0);
  const [calcSolar, setCalcSolar] = useState(720.0);
  const [calcRain, setCalcRain] = useState(0.0);
  const [calcResult, setCalcResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // Trigger FWI calculation
  const handleCalculateFWI = async () => {
    setCalculating(true);
    try {
      const res = await apiService.calculatePseudoFWI({
        air_temperature_c: parseFloat(calcTemp),
        relative_humidity_pct: parseFloat(calcRH),
        solar_radiation_wm2: parseFloat(calcSolar),
        rainfall_intensity_mmh: parseFloat(calcRain)
      });
      if (res.data) setCalcResult(res.data);
    } catch (err) {
      console.warn('FWI calc error:', err);
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    handleCalculateFWI();
  }, []);

  const fwiScore = calcResult?.pseudo_fwi_score || 0.535;
  const riskLabel = calcResult?.risk_label || 'High Risk';
  const isHighRisk = fwiScore > 0.5;

  return (
    <section id="screen-fire" className="screen active">
      <div className="page-title">
        <div>
          <h2>Fire Warning Index</h2>
          <p>Predictive fire-risk intelligence for your monitored location.</p>
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
        <button className={activeTab === 'forecast' ? 'active' : ''} onClick={() => setActiveTab('forecast')}>Forecast</button>
        <button className={activeTab === 'index' ? 'active' : ''} onClick={() => setActiveTab('index')}>Index Detail</button>
        <button className={activeTab === 'calculator' ? 'active' : ''} onClick={() => setActiveTab('calculator')}>FWI Simulator</button>
      </div>

      {/* Early Warning Banner */}
      {isHighRisk && (
        <div style={{
          background: '#fff5f5',
          border: '1px solid #fed7d7',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: 'var(--red)',
          fontSize: 13,
          fontWeight: 600
        }}>
          <span style={{ fontSize: 18 }}>🚨</span>
          <div>
            <b>WASPADA KEBAKARAN LAHAN TINGGI (NIMBUS 5-LAYER INTELLIGENCE)</b>
            <div style={{ fontWeight: 400, color: 'var(--text)', fontSize: 12, marginTop: 2 }}>
              Indeks Pseudo-FWI mencapai {fwiScore}. Vegetasi kering dan mudah terbakar. Tingkatkan patroli dan siagakan sekat kanal.
            </div>
          </div>
        </div>
      )}

      {/* Current Risk & 10-day FWI bar chart */}
      <div className="risk">
        <div className="card">
          <span className="muted">Current Fire Risk · 29 Sep 2026, 14:00 WIB</span>
          <div className="riskbox" style={{ marginTop: 15 }}>
            <div className="gauge">
              {/* Needle pointer based on score */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                width: 3,
                height: 55,
                backgroundColor: 'var(--navy)',
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) rotate(${(fwiScore * 180) - 90}deg)`,
                transition: 'transform 0.5s ease',
                zIndex: 2,
                borderRadius: 2
              }} />
              <div style={{
                position: 'absolute',
                bottom: -5,
                left: '50%',
                width: 12,
                height: 12,
                backgroundColor: 'var(--navy)',
                borderRadius: '50%',
                transform: 'translateX(-50%)',
                zIndex: 3
              }} />
            </div>
            <div>
              <div className="risk-high" style={{ color: isHighRisk ? 'var(--red)' : 'var(--amber)' }}>
                {riskLabel}
              </div>
              <p className="muted" style={{ margin: '4px 0' }}>FWI Score: <b>{fwiScore}</b></p>
              <p className="muted" style={{ margin: 0, fontSize: 12 }}>
                Risk is elevated in the next 3 days due to low humidity and dry vegetation conditions.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>10-Day FWI Forecast</h3>
            <span className="muted" style={{ fontSize: 11 }}>Layer 4 Multi-Horizon</span>
          </div>
          <div className="chart">
            <div className="linechart">
              <div className="bar" style={{ height: '35%' }} title="Day 1: 0.35 (Low)"></div>
              <div className="bar" style={{ height: '43%' }} title="Day 2: 0.43 (Moderate)"></div>
              <div className="bar" style={{ height: '52%' }} title="Day 3: 0.52 (High)"></div>
              <div className="bar" style={{ height: '70%', background: 'var(--amber)' }} title="Day 4: 0.70 (High)"></div>
              <div className="bar" style={{ height: '86%', background: 'var(--red)' }} title="Day 5: 0.86 (Extreme)"></div>
              <div className="bar" style={{ height: '73%', background: 'var(--amber)' }} title="Day 6: 0.73 (High)"></div>
              <div className="bar" style={{ height: '58%' }} title="Day 7: 0.58 (High)"></div>
              <div className="bar" style={{ height: '43%' }} title="Day 8: 0.43 (Moderate)"></div>
              <div className="bar" style={{ height: '30%' }} title="Day 9: 0.30 (Low)"></div>
              <div className="bar" style={{ height: '32%' }} title="Day 10: 0.32 (Low)"></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: 'var(--muted)' }}>
              <span>Day 1</span>
              <span>Day 3</span>
              <span>Day 5 (Peak)</span>
              <span>Day 7</span>
              <span>Day 10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Index Components */}
      <div className="card" style={{ marginTop: 18 }}>
        <h3>Index Components (Canadian FWI Structure)</h3>
        <div className="module-grid" style={{ marginTop: 10 }}>
          <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
            <b>FFMC (Fine Fuel)</b>
            <p style={{ margin: '4px 0 0', fontSize: 11 }}>Fine Fuel Moisture Code (Litter & cured fuels)</p>
            <div style={{ marginTop: 6, fontWeight: 700, color: 'var(--text)' }}>88.4</div>
          </div>
          <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
            <b>DMC (Duff Moisture)</b>
            <p style={{ margin: '4px 0 0', fontSize: 11 }}>Loosely compacted organic layers</p>
            <div style={{ marginTop: 6, fontWeight: 700, color: 'var(--text)' }}>42.1</div>
          </div>
          <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
            <b>DC (Drought Code)</b>
            <p style={{ margin: '4px 0 0', fontSize: 11 }}>Deep, compact organic fuel layers</p>
            <div style={{ marginTop: 6, fontWeight: 700, color: 'var(--text)' }}>310.5</div>
          </div>
          <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
            <b>ISI (Initial Spread)</b>
            <p style={{ margin: '4px 0 0', fontSize: 11 }}>Rate of fire spread without fuel quantity</p>
            <div style={{ marginTop: 6, fontWeight: 700, color: 'var(--text)' }}>7.8</div>
          </div>
          <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
            <b>BUI (Buildup Index)</b>
            <p style={{ margin: '4px 0 0', fontSize: 11 }}>Total fuel available for combustion</p>
            <div style={{ marginTop: 6, fontWeight: 700, color: 'var(--text)' }}>58.2</div>
          </div>
          <div style={{ padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
            <b>FWI (Fire Weather Index)</b>
            <p style={{ margin: '4px 0 0', fontSize: 11 }}>General index of fire intensity</p>
            <div style={{ marginTop: 6, fontWeight: 700, color: 'var(--red)' }}>24.5 (High)</div>
          </div>
        </div>

        <p style={{ marginTop: 18, fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
          For peatland locations with groundwater-level sensors, Nimbus applies a peatland-specific risk model incorporating water-table depth (TMAT) and drawdown anomalies into Layer 2 hydrological calibration.
        </p>
      </div>

      {/* Interactive Deterministic FWI Calculator */}
      <div className="card" style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Deterministic Pseudo-FWI Engine (POST /api/v1/fwi/calculate)</h3>
          <button className="primary" style={{ height: 32, fontSize: 12, padding: '0 12px' }} onClick={handleCalculateFWI}>
            {calculating ? 'Calculating...' : 'Recalculate Index'}
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>
          Evaluate formula: <code>Pseudo-FWI = (0.35 × Suhu) + (0.35 × RH) + (0.20 × Radiasi) + (0.10 × Hujan)</code>
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 12 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600 }}>Air Temp (°C)</label>
            <input
              type="number"
              step="0.5"
              className="select"
              style={{ width: '100%', marginTop: 4 }}
              value={calcTemp}
              onChange={(e) => setCalcTemp(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600 }}>Humidity (%)</label>
            <input
              type="number"
              step="1"
              className="select"
              style={{ width: '100%', marginTop: 4 }}
              value={calcRH}
              onChange={(e) => setCalcRH(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600 }}>Solar Rad (W/m²)</label>
            <input
              type="number"
              step="10"
              className="select"
              style={{ width: '100%', marginTop: 4 }}
              value={calcSolar}
              onChange={(e) => setCalcSolar(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600 }}>Rainfall (mm/h)</label>
            <input
              type="number"
              step="0.5"
              className="select"
              style={{ width: '100%', marginTop: 4 }}
              value={calcRain}
              onChange={(e) => setCalcRain(e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
