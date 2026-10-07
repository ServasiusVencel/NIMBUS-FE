// NIMBUS Enterprise Initial Mock & Seed Data

export const INITIAL_CLIENTS = [
  {
    id: 'CLI-001',
    name: 'PT Nusantara Agro Lestari',
    industry: 'Palm Oil & Agriculture',
    pic: 'Ir. Bambang Hartono, M.Sc',
    email: 'bambang.h@nusantara-agro.co.id',
    phone: '+62 811-9872-3411',
    status: 'active',
    projects: ['PRJ-RIAU-01', 'PRJ-JAMBI-02'],
    assignedSensors: ['AWS-RIAU-02', 'AWS-JAMBI-03'],
    enabledModules: {
      general_weather: true,
      fire_warning: true,
      climate_agriculture: true,
      pest_warning: true,
      emission_intelligence: false,
      carbon_mrv: false,
    },
  },
  {
    id: 'CLI-002',
    name: 'Sumatra Peatland Conservation & Restoration',
    industry: 'Peatland Forestry & Carbon Concession',
    pic: 'Dr. Sarah Nurulita',
    email: 'sarah.nurulita@peatland-restoration.org',
    phone: '+62 812-4455-8899',
    status: 'active',
    projects: ['PRJ-PEAT-PLG'],
    assignedSensors: ['AWS-PLG-01'],
    enabledModules: {
      general_weather: true,
      fire_warning: true,
      climate_agriculture: false,
      pest_warning: false,
      emission_intelligence: true,
      carbon_mrv: true,
    },
  },
  {
    id: 'CLI-003',
    name: 'Borneo Tropical Ecosystems Ltd.',
    industry: 'Integrated Agroforestry & REDD+ Project',
    pic: 'Marcus Wong',
    email: 'm.wong@borneo-tropical.com',
    phone: '+62 813-8822-1100',
    status: 'active',
    projects: ['PRJ-KAL-KAPUAS'],
    assignedSensors: ['AWS-KAL-04', 'AWS-KAL-05'],
    enabledModules: {
      general_weather: true,
      fire_warning: true,
      climate_agriculture: true,
      pest_warning: true,
      emission_intelligence: true,
      carbon_mrv: true,
    },
  },
];

export const INITIAL_SENSORS = [
  {
    id: 'AWS-PLG-01',
    name: 'AWS-PLG-01 (Peatland Core Zone A)',
    clientId: 'CLI-002',
    projectId: 'PRJ-PEAT-PLG',
    latitude: -0.9476,
    longitude: 101.4321,
    status: 'online', // 'online' | 'warning' | 'offline'
    condition: 'Sunny / Dry', // dominant condition
    weatherIcon: 'sun',
    installedDate: '2024-03-15',
    lastSync: 'Just now (1 min ago)',
    capabilities: {
      air_temperature: true,
      relative_humidity: true,
      solar_radiation: true,
      rainfall: true,
      wind: true,
      groundwater_tmat: true, // Special sensor!
      soil_moisture: true,
      co2: false,
    },
    currentReadings: {
      air_temperature_c: 32.4,
      relative_humidity_pct: 52.0,
      solar_radiation_wm2: 710.0,
      rainfall_intensity_mmh: 0.0,
      wind_speed_ms: 2.8,
      wind_direction_deg: 120,
      air_pressure_hpa: 986.2,
      water_table_depth_cm: -48.5, // Below -40 cm national alert threshold!
      soil_moisture_pct: 76.5,
    },
    fireRisk: {
      level: 'High',
      score: 0.62,
      fwi_components: {
        ffmc: 88.5,
        dmc: 45.2,
        dc: 340.0,
        isi: 8.4,
        bui: 68.1,
        fwi: 24.3,
      },
      peatlandHazard: {
        tmatStatus: 'CAUTION',
        criticalDepth: -40.0,
        message: 'Water table is currently at -48.5 cm (exceeding standard 40 cm limit). Fire spread risk in peat layer is ELEVATED.',
      }
    }
  },
  {
    id: 'AWS-RIAU-02',
    name: 'AWS-RIAU-02 (Estate Pelalawan Block 4)',
    clientId: 'CLI-001',
    projectId: 'PRJ-RIAU-01',
    latitude: 0.3421,
    longitude: 101.8942,
    status: 'online',
    condition: 'Clear Sky',
    weatherIcon: 'sun',
    installedDate: '2023-11-20',
    lastSync: '3 mins ago',
    capabilities: {
      air_temperature: true,
      relative_humidity: true,
      solar_radiation: true,
      rainfall: true,
      wind: true,
      groundwater_tmat: false, // Standard AWS, NO TMAT
      soil_moisture: true,
      co2: false,
    },
    currentReadings: {
      air_temperature_c: 30.8,
      relative_humidity_pct: 64.0,
      solar_radiation_wm2: 650.0,
      rainfall_intensity_mmh: 0.0,
      wind_speed_ms: 1.9,
      wind_direction_deg: 95,
      air_pressure_hpa: 991.0,
      water_table_depth_cm: null,
      soil_moisture_pct: 84.0,
    },
    fireRisk: {
      level: 'Moderate',
      score: 0.42,
      fwi_components: {
        ffmc: 82.1,
        dmc: 28.4,
        dc: 190.0,
        isi: 4.8,
        bui: 42.0,
        fwi: 12.8,
      },
      peatlandHazard: null,
    }
  },
  {
    id: 'AWS-JAMBI-03',
    name: 'AWS-JAMBI-03 (Batanghari Peat Estate)',
    clientId: 'CLI-001',
    projectId: 'PRJ-JAMBI-02',
    latitude: -1.5833,
    longitude: 103.6167,
    status: 'warning',
    condition: 'Severe Dry Heat',
    weatherIcon: 'hazard',
    installedDate: '2024-01-10',
    lastSync: '12 mins ago',
    capabilities: {
      air_temperature: true,
      relative_humidity: true,
      solar_radiation: true,
      rainfall: true,
      wind: true,
      groundwater_tmat: true, // Peatland with TMAT
      soil_moisture: true,
      co2: false,
    },
    currentReadings: {
      air_temperature_c: 34.2,
      relative_humidity_pct: 46.0,
      solar_radiation_wm2: 820.0,
      rainfall_intensity_mmh: 0.0,
      wind_speed_ms: 3.6,
      wind_direction_deg: 140,
      air_pressure_hpa: 983.5,
      water_table_depth_cm: -76.8, // Extreme drop
      soil_moisture_pct: 64.0,
    },
    fireRisk: {
      level: 'Very High',
      score: 0.79,
      fwi_components: {
        ffmc: 93.2,
        dmc: 62.4,
        dc: 420.0,
        isi: 11.2,
        bui: 92.5,
        fwi: 36.4,
      },
      peatlandHazard: {
        tmatStatus: 'CRITICAL',
        criticalDepth: -40.0,
        message: 'CRITICAL: Water table depth has receded to -76.8 cm! Peat dry layer is deeply combustible. Immediate canal block wetting required.',
      }
    }
  },
  {
    id: 'AWS-KAL-04',
    name: 'AWS-KAL-04 (Kahayan River Monitoring)',
    clientId: 'CLI-003',
    projectId: 'PRJ-KAL-KAPUAS',
    latitude: -2.2136,
    longitude: 113.9213,
    status: 'offline',
    condition: 'Offline',
    weatherIcon: 'cloud-offline',
    installedDate: '2023-08-04',
    lastSync: '3 days ago (Battery Discharged)',
    capabilities: {
      air_temperature: true,
      relative_humidity: true,
      solar_radiation: true,
      rainfall: true,
      wind: true,
      groundwater_tmat: true,
      soil_moisture: false,
      co2: false,
    },
    currentReadings: {
      air_temperature_c: 28.0,
      relative_humidity_pct: 75.0,
      solar_radiation_wm2: 450.0,
      rainfall_intensity_mmh: 0.0,
      wind_speed_ms: 1.0,
      wind_direction_deg: 0,
      air_pressure_hpa: 988.0,
      water_table_depth_cm: -35.0,
      soil_moisture_pct: null,
    },
    fireRisk: {
      level: 'Low',
      score: 0.22,
      fwi_components: {
        ffmc: 70.0,
        dmc: 12.0,
        dc: 90.0,
        isi: 2.1,
        bui: 18.0,
        fwi: 4.5,
      },
      peatlandHazard: null,
    }
  },
  {
    id: 'AWS-KAL-05',
    name: 'AWS-KAL-05 (Kapuas Basin Peatland)',
    clientId: 'CLI-003',
    projectId: 'PRJ-KAL-KAPUAS',
    latitude: -0.0263,
    longitude: 109.3425,
    status: 'online',
    condition: 'Passing Showers',
    weatherIcon: 'rain',
    installedDate: '2024-02-18',
    lastSync: 'Just now (live backend link)',
    capabilities: {
      air_temperature: true,
      relative_humidity: true,
      solar_radiation: true,
      rainfall: true,
      wind: true,
      groundwater_tmat: true,
      soil_moisture: true,
      co2: false,
    },
    currentReadings: {
      air_temperature_c: 29.5,
      relative_humidity_pct: 78.0,
      solar_radiation_wm2: 520.0,
      rainfall_intensity_mmh: 2.4,
      wind_speed_ms: 2.1,
      wind_direction_deg: 110,
      air_pressure_hpa: 984.5,
      water_table_depth_cm: -28.4,
      soil_moisture_pct: 92.5,
    },
    fireRisk: {
      level: 'Low',
      score: 0.18,
      fwi_components: {
        ffmc: 65.0,
        dmc: 10.5,
        dc: 80.0,
        isi: 1.8,
        bui: 15.0,
        fwi: 3.2,
      },
      peatlandHazard: {
        tmatStatus: 'SAFE',
        criticalDepth: -40.0,
        message: 'Water table depth is -28.4 cm (within safe standard < 40 cm). Peat soil moisture adequate.',
      }
    }
  }
];

// 10-Day Forward Forecast Model Matrix
export const GENERATE_10_DAY_FORECAST = (baseDate = new Date()) => {
  const days = [];
  const conditionSamples = [
    { cond: 'Clear / Sunny', icon: 'Sun', rainProb: 10, rainMm: 0.0, tempMax: 33.2, tempMin: 24.1, hum: 52, fwi: 'High', fert: 'GOOD', spray: 'GOOD', harvest: 'GOOD' },
    { cond: 'Partly Cloudy', icon: 'CloudSun', rainProb: 25, rainMm: 0.5, tempMax: 32.0, tempMin: 23.8, hum: 58, fwi: 'Moderate', fert: 'GOOD', spray: 'GOOD', harvest: 'GOOD' },
    { cond: 'Scattered Clouds', icon: 'Cloud', rainProb: 30, rainMm: 1.2, tempMax: 31.5, tempMin: 23.5, hum: 65, fwi: 'Moderate', fert: 'GOOD', spray: 'CAUTION', harvest: 'GOOD' },
    { cond: 'Heavy Rain / Thunderstorm', icon: 'CloudLightning', rainProb: 85, rainMm: 38.5, tempMax: 27.5, tempMin: 22.0, hum: 92, fwi: 'Low', fert: 'NOT RECOMMENDED', spray: 'NOT RECOMMENDED', harvest: 'NOT RECOMMENDED' },
    { cond: 'Moderate Rain', icon: 'CloudRain', rainProb: 70, rainMm: 18.0, tempMax: 28.0, tempMin: 22.5, hum: 88, fwi: 'Low', fert: 'NOT RECOMMENDED', spray: 'NOT RECOMMENDED', harvest: 'CAUTION' },
    { cond: 'Light Showers', icon: 'CloudDrizzle', rainProb: 45, rainMm: 4.2, tempMax: 29.5, tempMin: 23.0, hum: 76, fwi: 'Low', fert: 'CAUTION', spray: 'CAUTION', harvest: 'GOOD' },
    { cond: 'Overcast & Humid', icon: 'Cloud', rainProb: 40, rainMm: 2.0, tempMax: 30.0, tempMin: 23.4, hum: 72, fwi: 'Moderate', fert: 'GOOD', spray: 'GOOD', harvest: 'GOOD' },
    { cond: 'Clear & Hot', icon: 'Sun', rainProb: 15, rainMm: 0.0, tempMax: 33.8, tempMin: 24.5, hum: 50, fwi: 'High', fert: 'GOOD', spray: 'GOOD', harvest: 'GOOD' },
    { cond: 'Extreme Heat & Dry', icon: 'Flame', rainProb: 5, rainMm: 0.0, tempMax: 35.0, tempMin: 25.0, hum: 44, fwi: 'Very High', fert: 'GOOD', spray: 'CAUTION', harvest: 'GOOD' },
    { cond: 'Passing Showers', icon: 'CloudSunRain', rainProb: 35, rainMm: 3.5, tempMax: 30.5, tempMin: 23.2, hum: 68, fwi: 'Moderate', fert: 'GOOD', spray: 'GOOD', harvest: 'GOOD' },
  ];

  for (let i = 1; i <= 10; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const sample = conditionSamples[(i - 1) % conditionSamples.length];

    days.push({
      day: i,
      date: dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      condition: sample.cond,
      icon: sample.icon,
      temperatureMax: sample.tempMax,
      temperatureMin: sample.tempMin,
      humidity: sample.hum,
      rainProbability: sample.rainProb,
      rainfallMm: sample.rainMm,
      solarRadiation: 550 + Math.round(Math.random() * 250),
      tmatProjectionCm: -35 - (i * 1.8), // gradual water recession in dry days
      fireRiskLevel: sample.fwi,
      operationalWindows: {
        fertilization: sample.fert,
        spraying: sample.spray,
        harvest: sample.harvest,
        otherOperations: sample.fert === 'NOT RECOMMENDED' ? 'NOT RECOMMENDED' : 'GOOD',
      }
    });
  }

  return days;
};

// Pest & Disease Early Warning Seed Data
export const PEST_DISEASE_ALERTS = [
  {
    id: 'PEST-01',
    diseaseName: 'Oil Palm Leaf Blight (Curvularia / Helminthosporium)',
    commodity: 'Oil Palm (Elaeis guineensis)',
    riskLevel: 'HIGH',
    riskScore: 78,
    incubationForecast: 'Outbreak risk elevated in 3–5 days',
    weatherTrigger: 'Relative Humidity > 85% sustained with ambient temp 28°C–31°C following rain showers.',
    recommendedAction: 'Inspect nursery & young palms. Apply preventative copper-based fungicide before heavy rainfall resumes.',
    affectedStations: ['AWS-RIAU-02', 'AWS-PLG-01'],
  },
  {
    id: 'PEST-02',
    diseaseName: 'Basal Stem Rot (Ganoderma boninense)',
    commodity: 'Oil Palm',
    riskLevel: 'MEDIUM',
    riskScore: 54,
    incubationForecast: 'Chronic soil moisture deficit accelerating spore transmission',
    weatherTrigger: 'Groundwater drop below 60 cm on acidic peat matrix.',
    recommendedAction: 'Maintain canal water retention. Apply Trichoderma bio-agent to root perimeter.',
    affectedStations: ['AWS-PLG-01', 'AWS-JAMBI-03'],
  },
  {
    id: 'PEST-03',
    diseaseName: 'Bagworm Outbreak (Metisa plana / Mahasena corbetti)',
    commodity: 'Oil Palm & Horticultural Buffer',
    riskLevel: 'LOW',
    riskScore: 28,
    incubationForecast: 'Normal baseline activity, monitored weekly',
    weatherTrigger: 'Prolonged dry spells with calm winds (< 1.5 m/s).',
    recommendedAction: 'Regular census. Maintain beneficial nectar plants (Cassia cobanensis, Turnera subulata).',
    affectedStations: ['AWS-RIAU-02'],
  },
];

// Superadmin Fallback Mock Users for CMS Demo
export const MOCK_SUPERADMIN_USERS = [
  {
    id: 'usr-sa-001',
    email: 'admin@nimbus.earth',
    full_name: 'Nimbus Superadministrator',
    role: 'superadmin',
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'usr-op-002',
    email: 'operator@nimbus.earth',
    full_name: 'Field Operations Lead',
    role: 'user',
    created_at: '2026-02-15T09:30:00Z',
  },
  {
    id: 'usr-cl-003',
    email: 'bambang.h@nusantara-agro.co.id',
    full_name: 'Ir. Bambang Hartono, M.Sc',
    role: 'user',
    created_at: '2026-03-01T11:20:00Z',
  },
  {
    id: 'usr-cl-004',
    email: 'sarah.nurulita@peatland-restoration.org',
    full_name: 'Dr. Sarah Nurulita',
    role: 'user',
    created_at: '2026-03-20T14:15:00Z',
  },
];
