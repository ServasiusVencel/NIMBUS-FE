
export class SensorStation {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || this.id;
    this.clientId = data.clientId || '';
    this.projectId = data.projectId || '';
    this.latitude = typeof data.latitude === 'number' ? data.latitude : parseFloat(data.latitude || 0);
    this.longitude = typeof data.longitude === 'number' ? data.longitude : parseFloat(data.longitude || 0);
    this.status = data.status || 'online'; // 'online' | 'warning' | 'offline'
    this.condition = data.condition || 'Clear Sky';
    this.weatherIcon = data.weatherIcon || 'sun';
    this.installedDate = data.installedDate || new Date().toISOString().split('T')[0];
    this.lastSync = data.lastSync || 'Just now';

    this.capabilities = {
      air_temperature: true,
      relative_humidity: true,
      solar_radiation: true,
      rainfall: true,
      wind: true,
      groundwater_tmat: false,
      soil_moisture: true,
      co2: false,
      ...(data.capabilities || {})
    };

    this.currentReadings = {
      air_temperature_c: 30.0,
      relative_humidity_pct: 65.0,
      solar_radiation_wm2: 600.0,
      rainfall_intensity_mmh: 0.0,
      wind_speed_ms: 2.0,
      wind_direction_deg: 90,
      air_pressure_hpa: 990.0,
      water_table_depth_cm: null,
      soil_moisture_pct: 80.0,
      ...(data.currentReadings || {})
    };

    this.fireRisk = {
      level: 'Moderate',
      score: 0.45,
      fwi_components: { ffmc: 80, dmc: 25, dc: 200, isi: 4.5, bui: 38, fwi: 12 },
      peatlandHazard: null,
      ...(data.fireRisk || {})
    };
  }

  // Capability queries
  hasCapability(key) {
    return !!this.capabilities[key];
  }

  isTmatEquipped() {
    return this.hasCapability('groundwater_tmat');
  }

  toggleCapability(key) {
    const nextVal = !this.capabilities[key];
    const newCapabilities = { ...this.capabilities, [key]: nextVal };
    const newReadings = { ...this.currentReadings };

    if (key === 'groundwater_tmat') {
      if (nextVal && (newReadings.water_table_depth_cm === null || newReadings.water_table_depth_cm === undefined)) {
        newReadings.water_table_depth_cm = -38.0;
      } else if (!nextVal) {
        newReadings.water_table_depth_cm = null;
      }
    }

    return new SensorStation({
      ...this,
      capabilities: newCapabilities,
      currentReadings: newReadings
    });
  }

  // Hydrological Status (Muka Air Tanah Gambut / TMAT)
  get waterTableDepth() {
    return this.currentReadings.water_table_depth_cm;
  }

  isTmatCritical() {
    // Government Threshold: -40.0 cm
    return this.isTmatEquipped() && this.waterTableDepth !== null && this.waterTableDepth < -40.0;
  }

  isTmatWarning() {
    return this.isTmatEquipped() &&
      this.waterTableDepth !== null &&
      this.waterTableDepth >= -40.0 &&
      this.waterTableDepth <= -30.0;
  }

  getTmatAssessment() {
    if (!this.isTmatEquipped()) {
      return {
        equipped: false,
        status: 'N/A',
        label: 'Sensor TMAT Tidak Terpasang',
        color: 'var(--muted)',
        recommendation: 'Stasiun AWS standar tanpa piezometer muka air gambut.'
      };
    }

    const depth = this.waterTableDepth;
    if (depth === null || depth === undefined) {
      return {
        equipped: true,
        status: 'UNKNOWN',
        label: 'Data Tidak Tersedia',
        color: 'var(--muted)',
        recommendation: 'Menunggu pembacaan sinyal telemetri.'
      };
    }

    if (depth < -60.0) {
      return {
        equipped: true,
        status: 'EXTREME_DANGER',
        label: 'KRITIS PARAH (RAWAN KEBAKARAN BAWAH TANAH)',
        color: 'var(--red)',
        isCritical: true,
        recommendation: 'Segera lakukan pembasahan darurat (re-wetting) dan tutup seluruh sekat kanal!'
      };
    }

    if (depth < -40.0) {
      return {
        equipped: true,
        status: 'CRITICAL',
        label: 'MELEWATI BATAS AMAN (-40 cm)',
        color: 'var(--red)',
        isCritical: true,
        recommendation: 'Tutup pintu sekat kanal (canal block) untuk menahan cadangan air gambut.'
      };
    }

    if (depth <= -30.0) {
      return {
        equipped: true,
        status: 'CAUTION',
        label: 'WASPADA KERING',
        color: 'var(--amber)',
        isWarning: true,
        recommendation: 'Mulai mendekati ambang batas kering. Pantau debit parit dan kanal kebun.'
      };
    }

    return {
      equipped: true,
      status: 'SAFE',
      label: 'NORMAL AMAN (LEMBAB)',
      color: 'var(--green)',
      isSafe: true,
      recommendation: 'Tata air gambut terjaga baik, cadangan air tanah mencukupi.'
    };
  }

  // Fire Risk evaluation
  getFireRiskSummary() {
    const level = this.fireRisk?.level || 'Moderate';
    const score = this.fireRisk?.score ?? 0.45;
    const isHigh = level.toLowerCase().includes('high') || level.toLowerCase().includes('extreme');
    const isLow = level.toLowerCase().includes('low');

    return {
      level,
      score,
      isHigh,
      isLow,
      isModerate: !isHigh && !isLow,
      color: isHigh ? 'var(--red)' : isLow ? 'var(--green)' : 'var(--amber)',
      badgeClass: isHigh ? 'badge-danger' : isLow ? 'badge-online' : 'badge-warning'
    };
  }

  // Precipitation evaluation
  getPrecipitationAssessment() {
    const rainMm = this.currentReadings?.rainfall_intensity_mmh || 0.0;
    const isRaining = rainMm > 0;
    let label = 'Cerah / Kering (0.0 mm/jam)';
    let badge = 'KERING';

    if (rainMm > 20.0) {
      label = 'Hujan Sangat Lebat (>20 mm/jam)';
      badge = 'SANGAT LEBAT';
    } else if (rainMm > 10.0) {
      label = 'Hujan Lebat (10-20 mm/jam)';
      badge = 'LEBAT';
    } else if (rainMm > 2.0) {
      label = 'Hujan Sedang (2-10 mm/jam)';
      badge = 'SEDANG';
    } else if (rainMm > 0) {
      label = 'Gerimis / Hujan Ringan (<2 mm/jam)';
      badge = 'RINGAN';
    }

    return {
      isRaining,
      rainMm,
      label,
      badge,
      recommendation: isRaining
        ? 'Tunda pemupukan tanah dan semprot pestisida agar tidak tercuci aliran air (runoff).'
        : 'Kondisi kering kondusif untuk aplikasi pupuk, penyemprotan, dan transportasi panen.'
    };
  }

  formatCoordinates() {
    return `${this.latitude.toFixed(4)}, ${this.longitude.toFixed(4)}`;
  }

  // Active capability labels list for badges
  get activeCapabilityLabels() {
    const list = [];
    if (this.capabilities.air_temperature) list.push('Temp');
    if (this.capabilities.relative_humidity) list.push('RH');
    if (this.capabilities.solar_radiation) list.push('Solar');
    if (this.capabilities.rainfall) list.push('Rain');
    if (this.capabilities.wind) list.push('Wind');
    if (this.capabilities.soil_moisture) list.push('Soil');
    if (this.capabilities.co2) list.push('CO2');
    return list;
  }

  // Status badge visual metadata
  getStatusDisplay() {
    const s = this.status || 'online';
    return {
      status: s,
      label: s.toUpperCase(),
      badgeClass: `badge badge-${s}`,
      dotClass: `dot dot-${s}`
    };
  }

  // Groundwater TMAT toggle button state
  getTmatButtonConfig() {
    const isEquipped = this.isTmatEquipped();
    return {
      isEquipped,
      label: isEquipped ? 'TMAT Enabled' : 'Disabled',
      btnClass: `btn btn-sm ${isEquipped ? 'btn-primary' : 'btn-secondary'}`,
      title: isEquipped ? 'TMAT Piezometer aktif (Muka Air Gambut terpantau)' : 'TMAT tidak aktif pada stasiun ini'
    };
  }

  // OOP Factory Pattern: Create a new AWS fleet station with valid defaults
  static createNewFleetStation({ name, clientId = 'CLI-001', latitude = -0.5, longitude = 101.5, hasTmat = true, stationIndex = 1 }) {
    const cleanName = (name || '').trim();
    const prefix = cleanName.length >= 4
      ? cleanName.substring(0, 4).toUpperCase()
      : (cleanName.padEnd(4, 'X')).toUpperCase();
    const id = `AWS-${prefix}-${String(stationIndex).padStart(2, '0')}`;
    const latNum = parseFloat(latitude) || -0.5;
    const lonNum = parseFloat(longitude) || 101.5;

    return new SensorStation({
      id,
      name: `${id} (${cleanName || 'Station'})`,
      clientId,
      projectId: `PRJ-${id}`,
      latitude: latNum,
      longitude: lonNum,
      status: 'online',
      condition: 'Normal Ops',
      weatherIcon: 'sun',
      installedDate: new Date().toISOString().split('T')[0],
      lastSync: 'Just now',
      capabilities: {
        air_temperature: true,
        relative_humidity: true,
        solar_radiation: true,
        rainfall: true,
        wind: true,
        groundwater_tmat: !!hasTmat,
        soil_moisture: true,
        co2: false,
      },
      currentReadings: {
        air_temperature_c: 31.0,
        relative_humidity_pct: 60.0,
        solar_radiation_wm2: 680.0,
        rainfall_intensity_mmh: 0.0,
        wind_speed_ms: 2.0,
        wind_direction_deg: 90,
        air_pressure_hpa: 990.0,
        water_table_depth_cm: hasTmat ? -35.0 : null,
        soil_moisture_pct: 80.0,
      },
      fireRisk: {
        level: 'Moderate',
        score: 0.40,
        fwi_components: { ffmc: 80, dmc: 25, dc: 200, isi: 4.5, bui: 38, fwi: 12 },
        peatlandHazard: hasTmat ? {
          tmatStatus: 'SAFE',
          criticalDepth: -40.0,
          message: 'Water table level within normal hydrological parameters.',
        } : null,
      }
    });
  }

  static fromJSON(json) {
    return new SensorStation(json);
  }
}

export default SensorStation;
