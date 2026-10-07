# NIMBUS — Climate & Environmental Intelligence Platform

> **Tagline:** *Climate & Environmental Intelligence for a Resilient Tomorrow*

---

## 📌 1. Core Positioning & Product Philosophy

**NIMBUS** is an enterprise-grade predictive climate & environmental intelligence platform integrating:
$$\text{IoT / AWS Sensors} + \text{Satellite Imagery} + \text{Climate Data} + \text{Environmental Data} + \text{Agricultural Data} + \text{AI/ML}$$

### Value Chain:
$$\text{Prediction} \longrightarrow \text{Risk Intelligence} \longrightarrow \text{Recommendation} \longrightarrow \text{Action} \longrightarrow \text{Evidence}$$

### Key Differentiation:
NIMBUS is **NOT** merely:
* ❌ A simple weather forecast dashboard (avoiding direct competition with raw official meteorology agencies like BMKG).
* ❌ A basic IoT telemetry monitoring tool.
* ❌ A standalone GIS viewer or generic agricultural app.
* ❌ A passive carbon spreadsheet.

**Instead, NIMBUS is:**
* ✅ **An Intelligence Layer & Decision Support System** transforming raw environmental sensor data into high-value operational recommendations and corporate sustainability (ESG) intelligence.

---

## 🎯 2. Core Problem Solved: Data to Decision

Many enterprises collect extensive environmental telemetry, but it remains trapped in:
$$\text{Raw Data} \longrightarrow \text{Static Dashboard}$$

Field operators and sustainability executives are still left guessing:
1. *Is tomorrow safe for fertilizer application without runoff waste?*
2. *When is the optimal window for pesticide spraying (avoiding rain wash-off or strong wind drift)?*
3. *Do current microclimate conditions create an acute wildfire/land fire hazard?*
4. *What is the Peatland Water Table Depth (TMAT)? Are we crossing the regulatory/fire danger threshold?*
5. *Is there an incoming pest or disease outbreak in the next 7–10 days?*
6. *How can this operational data verify compliance for ESG and carbon project MRV?*

**NIMBUS closes this gap:**
$$\mathbf{Data \longrightarrow Intelligence \longrightarrow Decision}$$

---

## 🏛️ 3. Three-Pillar Architecture

```
                                  NIMBUS
                                     │
                    Climate & Environmental Intelligence
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
        ▼                            ▼                            ▼
    PILLAR 1                     PILLAR 2                     PILLAR 3
   Predictive                    Emission                  Carbon Project
  Intelligence                 Intelligence                 Intelligence
        │                            │                            │
        ▼                            ▼                            ▼
 • Climate Risk               • GHG / Carbon               • Carbon Projects
 • Agricultural Risk            Accounting                   MRV
 • Environmental Risk         • Scope 1, 2, 3              • REDD+, ARR, IFM
                              • Inventory Management       • Blue Carbon
```

> **Current Implementation Focus:** **PILLAR 1 (Predictive Intelligence)** and the **CMS & Administration Layer**.

---

## 🎨 4. UI/UX Design System & Aesthetics

### Visual Identity
* **Design Philosophy:** Minimalist, elegant, high-clarity enterprise dashboard. No clutter, no unnecessary decorative ornaments.
* **Language:** **English** across all labels, metrics, alerts, and navigation.
* **Responsiveness:** Fluid grid and responsive layout (Desktop, Tablet, and Mobile).
* **Color Palette:**
  * **Primary (Dominant):** Crisp White (`#FFFFFF`, `#F8FAFC`) & Clean Blue (`#0284C7`, `#0369A1`, `#1E40AF`, `#2563EB`).
  * **Secondary / Neutral:** Subtle Slate Greys (`#F1F5F9`, `#E2E8F0`, `#64748B`, `#334155`).
  * **Alert / Hazard Accents:** Vivid Red & Crimson (`#EF4444`, `#DC2626`, `#991B1B`) for severe fire danger, flood risk, offline sensors, and critical alerts.
  * **Warning / Caution Accents:** Amber & Orange (`#F59E0B`, `#D97706`).
  * **Safe / Optimal Accents:** Emerald Green (`#10B981`, `#059669`).

---

## 🖥️ 5. User Journeys & Dashboard Modules

### 5.1 Authentication (Login Page)
* Secure login interface (`/login`).
* Role-based access:
  * **Client User:** Assigned to specific projects and client-owned AWS IoT sensors.
  * **Owner / Admin:** Global platform overview, all clients, all projects, CMS & user configuration.

---

### 5.2 Client Landing Page: Interactive Map & Sensor Hub
* **Flat & Clean Interactive Map:**
  * Displays deployed IoT AWS stations belonging to the client's project.
  * Markers indicate sensor operational status or dominant weather/risk condition:
    * 🟢 **Online** | 🟠 **Warning** | 🔴 **Offline**
    * Or conditions: Sunny ☀️, Rainy 🌧️, Flood Alert 🌊, Drought Risk 🌾.
* **Sensor Drawer / Detail Modal:**
  * Station Identifier: e.g., `AWS-PLG-01` (from CMS).
  * GPS Coordinates: e.g., `-0.9476, 101.4321` *(no city name required)*.
  * Real-time connectivity status & last sync timestamp.
  * Quick metric snapshot & one-click jump to module analysis.

---

### 5.3 Module 1: General Weather Intelligence
1. **Real-Time Actual Weather:**
   * Air Temperature (`°C`)
   * Relative Humidity (`%`)
   * Solar Radiation (`W/m²`)
   * Rainfall Intensity (`mm/h`)
   * Wind Speed (`m/s`) & Direction (`°`)
   * **Groundwater Level / TMAT (`cm`):** Dynamically shown **only if** the sensor has water table capabilities.
2. **10-Day Localized Weather Forecast:**
   * 10-day forward projections: Condition (Clear/Sunny, Cloudy, Overcast, Rain, Flood Hazard).
   * Daily min/max temperature, humidity, rainfall probabilities, and solar index.
3. **Historical Data Downloader:**
   * Date range selection (Calendar picker).
   * Variable selector checkboxes: Air Temp, Humidity, Solar Radiation, Rainfall, Wind (+ *Groundwater Level* if supported).
   * Export action: Instant **Download CSV** generation.

---

### 5.4 Module 2: Fire Warning Index (FWI) & Peatland Fire Intelligence

> Module 2 is powered by the **Nimbus Fire Intelligence Engine** (see [Section 6](#-6-nimbus-fire-intelligence-engine--algorithm--data-moat)). It is **not** a static PFWI calculator.

1. **Fire Risk Status & Gauge:**
   * Risk Levels: `Low` | `Moderate` | `High` | `Very High` | `Extreme`.
   * Displays both the **scientific baseline index** (PFVI / Pseudo-FWI) and the **AI fire probability** (site-calibrated, %).
2. **Multi-Horizon Fire Risk Forecast:**
   * Fire risk outlook for **+1, +3, +7 and +10 days**, produced by the AI model trained on the site's **entire** historical dataset.
3. **FWI Component Sub-Indices (Scientific Baseline):**
   * Canadian Standard: **FFMC**, **DMC**, **DC**, **ISI**, **BUI**, **FWI**.
   * Pseudo-FWI deterministic formula based on Van Wagner (1987):
     $$\text{Pseudo-FWI} = (0.35 \times \text{Temp}) + (0.35 \times \text{RH}) + (0.20 \times \text{Solar}) + (0.10 \times \text{Rain})$$
4. **Peatland Water Table (TMAT) Intelligence (Differentiator):**
   * Peatland fire model fusing atmospheric drying (VPD, solar, temperature) with **Water Table Depth (WTD/TMAT)**, rainfall and soil moisture.
   * Shows the 40 cm national regulatory threshold **and** the AI-learned **site-specific threshold** for the selected sensor.
5. **Lag & Dry-Spell Indicators:**
   * Consecutive days with WTD beyond threshold, days since significant rainfall, WTD trend (cm/day), cumulative VPD.
6. **Prediction vs. Outcome Log:**
   * Past predictions compared with verified fire / no-fire outcomes (hotspot / field report) — the feedback loop that drives retraining.

---

### 5.5 Module 3: Climate-Resilient Agriculture
1. **Operational Windows Matrix:**
   Analyzes forward forecasts to prescribe optimal field operational windows:
   * **Fertilization:** Recommended clear days without heavy precipitation runoff.
   * **Pesticide Spraying:** Optimal days with calm wind and zero rain wash-off risk.
   * **Herbicide Application:** Suitable temperature and dry ground conditions.
   * **Harvesting:** Favorable traction and crop quality protection days.
   * **Other Field Operations:** General field logistics feasibility.
   * **Status Codes:** `GOOD` (🟢 Clear/Optimal) | `CAUTION` (🟡 Variable) | `NOT RECOMMENDED` (🔴 Risk).
2. **Pest & Disease Early Warning:**
   * Risk index, forecast, and proactive mitigation recommendations based on microclimate humidity-temperature triggers.

---

### 5.6 Owner & CMS Dashboard (Content & System Management)
A full-featured administration portal for platform owners:
1. **Global Map View:** View all client sensors, cross-region deployment health, and active hazards.
2. **Client Management:** Create, edit, suspend enterprise clients; assign projects and organizational parameters.
3. **PIC Management:** Manage Persons-in-Charge, contact details, department, and notification preferences.
4. **User Management:** Create accounts, set credentials, assign roles (`Owner`, `Project Manager`, `Field Operator`, `Auditor`).
5. **Module Management (Dynamic Feature Toggles):**
   * Configurable per client:
     * *Client A:* Weather (ON), Fire (ON), Agriculture (ON), Pest (OFF), Emission (OFF).
     * *Client B:* Weather (ON), Fire & Peatland (ON), Agriculture (OFF), Carbon (ON).
6. **Sensor Management:**
   * Add/Edit AWS Station metadata: ID, Name, Project, Client, Latitude, Longitude, Installation Date.
   * **Sensor Capabilities Checklist:**
     `[x] Temperature` | `[x] Relative Humidity` | `[x] Solar Radiation` | `[x] Rainfall` | `[x] Wind` | `[x] Groundwater Level (TMAT)` | `[x] Soil Moisture`
   * *Rule:* Frontend dynamically renders TMAT and Peatland modules only when the capability flag is active.

---

## 🔥 6. Nimbus Fire Intelligence Engine — Algorithm & Data Moat

### 6.1 Principle: Data Moat ≠ Simply Having a Lot of Data

For peatland, the relationship between **WTD, rainfall, soil moisture, atmospheric drying and fire occurrence is site-specific**. The PFVI research itself uses daily groundwater, rainfall and soil moisture data for calibration and verification against fire events.

```
Day 1                                 After 1 year
Temperature, RH, Solar,               365 days × multiple variables
WTD, Rainfall                                     ↓
      ↓                               ~8,760 hourly / 365 daily observations
PFWI = 35                                         ↓
                                      Nimbus understands:
                                      - seasonal pattern    - WTD response
                                      - drying pattern      - lag effect
                                      - rainfall response   - local fire conditions
```

Data volume alone is **not** a moat. The moat forms when that data is used to build models that become increasingly **site-specific, predictive and hard to replicate** without the same historical dataset.

### 6.2 The 5 AI Functions

#### A. Learn the site's "normal condition" (site-specific thresholds)
A generic rule (`WTD > 60 cm → dangerous`) is replaced by thresholds learned per location:

```
Generic Model                    Nimbus Site-Specific Model
WTD < 60 cm = High Risk          Location A: WTD < 55 cm + VPD > X + dry spell > Y → High Risk
                                 Location B: WTD < 70 cm + VPD > X + dry spell > Y → High Risk
```

Example — Location A: `40 cm` relatively safe · `55 cm` drying begins · `65 cm` risk rising · `75 cm + high VPD + 10 dry days` → sharp increase. Thresholds differ because peat drying also depends on local hydrology and soil water retention.

#### B. Learn the lag effect (temporal dependency)
Fire rarely occurs on the day drying starts:

```
Day -10  WTD 35 cm  →  Day -5  WTD 50 cm  →  Day -2  WTD 63 cm  →  Day -1  WTD 67 cm  →  Day 0  FIRE
```

The model therefore uses lagged sequences, not only the current value:

$$WTD_t,\ WTD_{t-1},\ \dots,\ WTD_{t-n} \qquad Rain_t,\ \dots,\ Rain_{t-n} \qquad VPD_t,\ \dots,\ VPD_{t-n}$$

> *"WTD 65 cm today is not necessarily very dangerous. But WTD > 60 cm for 12 consecutive days + no significant rainfall + high VPD yields a much higher risk."* — something a static fire index cannot capture.

#### C. Discover variable interactions (non-linear)
$$\text{Simple: } FireRisk = f(WTD) \qquad \text{Nimbus: } FireRisk = f(WTD, VPD, Rain, Solar, Duration, Trend, \dots)$$

| Condition | Learned risk |
| :--- | :---: |
| WTD 60 cm + low VPD | Moderate |
| WTD 60 cm + high VPD + 12 days without rain | High |
| WTD 60 cm + high VPD + 20 days without rain + deepening WTD trend | Very High |

Recent tropical-peatland research even uses CNN + ConvLSTM + probabilistic calibration to capture spatial and temporal fire risk.

#### D. Learn from prediction errors (feedback loop)
```
Prediction (1 Aug: 82%) → Actual (no fire)   ⇒ false alarm stored
Prediction (35%)        → Actual (FIRE)      ⇒ missed event stored

Prediction → Actual outcome → Error → Model retraining → Better prediction
```

#### E. Anomaly detection & site calibration
Detects deviations from the site's learned normal behavior (sudden WTD drop, canal drainage effect, sensor drift) and recalibrates the scientific baseline per site.

### 6.3 Engine Pipeline

```
                 SENSOR
                   ↓
        Daily Environmental Data
                   ↓
        ┌─────────────────────┐
        │ Nimbus Data Engine  │
        └─────────────────────┘
                   ↓
          Historical Dataset  (ALL data since installation)
                   ↓
        ┌─────────────────────┐
        │ Feature Engineering │  lags, rolling windows, dry spell, VPD, trends
        └─────────────────────┘
                   ↓
       ┌────────────────────────┐
       │ AI / ML Model          │
       │ - temporal patterns    │
       │ - lag effects          │
       │ - interactions         │
       │ - anomaly detection    │
       │ - site calibration     │
       └────────────────────────┘
                   ↓
             Fire Prediction
                   ↓
             Actual Outcome
                   ↓
             Model Feedback ──────────→ AI (retrain)
```

$$Data \rightarrow Prediction \rightarrow Outcome \rightarrow Learning \rightarrow Better\ Prediction$$

### 6.4 Fire Label (Ground Truth) — Mandatory for a Prediction Moat

Temperature, RH, solar and WTD alone produce an **environmental data moat**, not yet a **fire prediction moat**. Ground truth is required:

`IoT` + `NASA FIRMS hotspots` + `burned area` + `rainfall` + `satellite soil moisture` + `land cover` + `canal / drainage` + `historical fire events` + `peat characteristics` → **Fire? YES / NO**

| Date | WTD | Temp | RH | VPD | Rain | Solar | Fire |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | :---: |
| D1 | 45 | 30 | 80 | 0.8 | 10 | 300 | 0 |
| D2 | 50 | 31 | 75 | 1.1 | 0 | 450 | 0 |
| D3 | 58 | 32 | 70 | 1.6 | 0 | 500 | 0 |
| D4 | 67 | 33 | 65 | 2.0 | 0 | 550 | 1 |

After thousands of observations the AI learns the conditions that **precede** fire.

### 6.5 The 5 Layers of the Engine

| Layer | Name | Input → Output |
| :---: | :--- | :--- |
| 1 | **Scientific Index** | PFVI / peat drought-fire model → scientific baseline (low groundwater ↔ fire events) |
| 2 | **Local Calibration** | Scientific index + local IoT history → site-specific calibration |
| 3 | **AI Prediction** | Historical IoT + satellite + climate + hydrology + fire observations → ML → fire probability |
| 4 | **Forecast** | Current condition → weather/climate forecast → hydrological forecast → AI → risk at **1 / 3 / 7 / 10 days** |
| 5 | **Continuous Learning** | Prediction → actual fire/no-fire → error analysis → retraining → improved model |

### 6.6 Training Strategy: Full-History, Not a Sliding Window

The analysis & forecast API **no longer uses a fixed 7-day lookback**. On every call/retrain:

1. **All** available observations for the site (since sensor installation) are aggregated to daily records.
2. Lag/rolling features are engineered over the full series.
3. The model is (re)trained on the **entire** dataset.
4. The forecast starts from the latest observation, using the model learned from all history.

The longer a site is monitored, the more seasonal, lag and outcome patterns the model has seen — this is what makes the moat compound.

### 6.7 Data Flywheel

```
MORE TIME → MORE OBSERVATIONS → MORE FIRE EVENTS → MORE TRAINING EXAMPLES
    ↑                                                        ↓
MORE DATA ← MORE SENSOR DEPLOYMENT ← MORE CUSTOMER RETENTION ← BETTER SITE CALIBRATION → BETTER RISK PREDICTION
```

### 6.8 Four Dimensions of the Nimbus Environmental Data Moat

| Dimension | Description |
| :--- | :--- |
| **1. Temporal Moat** | 1 month → 1 year → 3 years → 5 years of history; deeper seasonal & lag understanding |
| **2. Spatial Moat** | Sensor A + B + C + D…; the AI learns differences between locations |
| **3. Outcome Moat** | Every fire / no-fire event becomes a training label — highly valuable |
| **4. Model Moat** | Site-specific thresholds + feature relationships + predictive models + calibrated probabilities |

Competitors cannot simply buy sensors — they must collect years of history and wait for fire events to obtain equivalent training data.

### 6.9 Positioning

> *Nimbus builds a proprietary environmental intelligence dataset by continuously combining localized IoT observations, satellite observations, climate data, hydrological conditions and verified fire outcomes. The longer each site is monitored, the more Nimbus can calibrate its models to the site's unique hydrological and climatic behavior, creating increasingly site-specific predictive intelligence.*

Research in Indonesia shows that hydrological dynamics (simulated soil moisture & WTD) improve neural-network active-fire prediction compared to weather variables alone.

$$\boxed{IoT + Satellite + Climate + Hydrology + Fire\ History \rightarrow AI \rightarrow Predictive\ Fire\ Intelligence}$$

**PFVI is not replaced by AI:** PFVI is the scientific foundation → IoT provides continuous local observation → AI learns local dynamics → Nimbus delivers site-specific predictive fire intelligence.

---

## 📡 7. Backend REST API Specification

Backend Base URL: `http://localhost:8000` (Local) / Production domain.

### Key Endpoints:

| Endpoint | Method | Purpose | Key Request/Response Fields |
| :--- | :---: | :--- | :--- |
| `/health` | `GET` | Health check & model status | `models_loaded`, `models_available` (rain, fire, drought) |
| `/api/v1/predict` | `POST` | Real-time multi-hazard prediction | Inputs: `water_table_depth_cm`, `air_temperature_c`, `relative_humidity_pct`, `solar_radiation_wm2`, etc. Output: `ringkasan`, `predictions`, `early_warning_system` |
| `/api/v1/predict/batch` | `POST` | Batch telemetry synchronization | Array of sensor records |
| `/api/v1/forecast/10-days`| `POST` | 10-day forward hazard forecast | Daily breakdown: `tingkat_kebakaran`, `kekeringan`, `hujan`, `pseudo_fwi_score`, `detail_cuaca` |
| `/api/v1/fwi/calculate` | `POST` | Deterministic Pseudo-FWI score | Computes weights & scores for temp, RH, solar, rain |
| `/api/v1/dataset/analysis-and-forecast` | `GET` | Full-history analysis + 10-day forecast | **No `days` parameter.** Model is trained on the **entire** dataset; returns all daily history + forecast from the latest observation |
| `/api/v1/scheduler/status` | `GET` | Automated retraining job status | `next_execution`, `job_name` |
| `/api/v1/retrain` | `POST` | Trigger background model retrain | Zero-downtime hot reload confirmation |
| `/api/v1/metrics` | `GET` | Accuracy, F1-scores & feature weights | Accuracy for rain (98.4%), fire (95.4%), drought (95.2%) |

### Data Dictionary:
* `water_table_depth_cm` (*TMAT*): Kedalaman air tanah dalam cm (e.g., `-138.5`).
* `soil_moisture_pct`: Kelembaban tanah % (`0.0` - `100.0`).
* `air_temperature_c`: Suhu udara °C.
* `relative_humidity_pct`: Kelembapan udara %.
* `solar_radiation_wm2`: Radiasi matahari W/m².
* `rainfall_intensity_mmh`: Intensitas hujan mm/jam.
* `wind_speed_ms`: Kecepatan angin m/s.
* `latitude` & `longitude`: Koordinat geografis stasiun AWS.

---

## 💻 8. Frontend Technical Architecture (React.js + Vite)

* **Build Tool:** Vite + React (Fast refresh, modern ES modules).
* **Styling:** Modular Vanilla CSS / CSS Variables design system following the minimalist White & Blue aesthetic.
* **State Management:** Lightweight React Context / Zustand for authenticated session, active client/project selection, and active sensor state.
* **Map Integration:** Leaflet / React-Leaflet with custom vector pins and status pulsing effects.
* **Charts:** Chart.js / Recharts for 10-day trend lines, weather bars, and FWI gauges.
* **API Service Layer:** Typed Fetch/Axios service with automatic fallback to mock/demo telemetry if backend is offline, ensuring seamless live demonstrations.

---

## 🔒 9. Developer Golden Rules
1. **Never lose context:** All UI components, state logic, and copywriting must align with the 3 pillars and the specific module rules defined above.
2. **Dynamic UI rendering:** Never hardcode groundwater/TMAT features for all sensors; check sensor capabilities first.
3. **Decision-driven presentation:** Always present recommendations (Good, Caution, Not Recommended) alongside raw physical numbers.
4. **Professionalism:** English UI copy, elegant layouts, accessible color contrast, and instant responsiveness.
