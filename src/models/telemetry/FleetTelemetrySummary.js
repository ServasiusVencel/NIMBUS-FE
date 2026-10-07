
export class FleetTelemetrySummary {
  /**
   * @param {import('../fleet/SensorStation').SensorStation[]} sensors 
   */
  constructor(sensors = []) {
    this.sensors = Array.isArray(sensors) ? sensors : [];
  }

  get totalCount() {
    return this.sensors.length;
  }

  get onlineCount() {
    return this.sensors.filter(s => s.status === 'online').length;
  }

  get warningCount() {
    return this.sensors.filter(s =>
      s.status === 'warning' ||
      (s.isTmatCritical && s.isTmatCritical()) ||
      (s.getFireRiskSummary && s.getFireRiskSummary().isHigh)
    ).length;
  }

  get tmatEquippedSensors() {
    return this.sensors.filter(s => s.isTmatEquipped && s.isTmatEquipped());
  }

  get tmatCriticalSensors() {
    return this.sensors.filter(s => s.isTmatCritical && s.isTmatCritical());
  }

  get rainingSensors() {
    return this.sensors.filter(s => {
      const assessment = s.getPrecipitationAssessment ? s.getPrecipitationAssessment() : null;
      return assessment ? assessment.isRaining : (s.currentReadings?.rainfall_intensity_mmh || 0) > 0;
    });
  }

  get averageTemperature() {
    if (this.totalCount === 0) return 0;
    const total = this.sensors.reduce((acc, s) => acc + (s.currentReadings?.air_temperature_c || 0), 0);
    return parseFloat((total / this.totalCount).toFixed(1));
  }

  get averageHumidity() {
    if (this.totalCount === 0) return 0;
    const total = this.sensors.reduce((acc, s) => acc + (s.currentReadings?.relative_humidity_pct || 0), 0);
    return Math.round(total / this.totalCount);
  }

  get averageWindSpeed() {
    if (this.totalCount === 0) return 0;
    const total = this.sensors.reduce((acc, s) => acc + (s.currentReadings?.wind_speed_ms || 0), 0);
    return parseFloat((total / this.totalCount).toFixed(1));
  }

  get averageSolarRadiation() {
    if (this.totalCount === 0) return 0;
    const total = this.sensors.reduce((acc, s) => acc + (s.currentReadings?.solar_radiation_wm2 || 0), 0);
    return Math.round(total / this.totalCount);
  }

  get averageFireScore() {
    if (this.totalCount === 0) return 0;
    const total = this.sensors.reduce((acc, s) => acc + (s.fireRisk?.score || 0), 0);
    return parseFloat((total / this.totalCount).toFixed(2));
  }

  get offlineCount() {
    return this.sensors.filter(s => s.status === 'offline').length;
  }

  get healthScorePercentage() {
    if (this.totalCount === 0) return 100;
    const healthy = this.sensors.filter(s =>
      s.status === 'online' &&
      !(s.isTmatCritical && s.isTmatCritical()) &&
      !(s.getFireRiskSummary && s.getFireRiskSummary().isHigh)
    ).length;
    return Math.round((healthy / this.totalCount) * 100);
  }

  get averageBatteryVoltage() {
    return 12.6; // Nominal 12V LiFePO4 IoT System
  }

  get averageGsmSignalDbm() {
    return -74; // 4G/LTE strong connection avg
  }

  get tempRange() {
    if (this.totalCount === 0) return { min: 0, max: 0 };
    const temps = this.sensors.map(s => s.currentReadings?.air_temperature_c ?? 30);
    return {
      min: Math.min(...temps),
      max: Math.max(...temps)
    };
  }

  get wettestStation() {
    if (this.totalCount === 0) return null;
    return [...this.sensors].sort((a, b) =>
      (b.currentReadings?.rainfall_intensity_mmh || 0) - (a.currentReadings?.rainfall_intensity_mmh || 0)
    )[0];
  }

  get windiestStation() {
    if (this.totalCount === 0) return null;
    return [...this.sensors].sort((a, b) =>
      (b.currentReadings?.wind_speed_ms || 0) - (a.currentReadings?.wind_speed_ms || 0)
    )[0];
  }

  get averageWaterTableDepth() {
    const tmatSensors = this.tmatEquippedSensors.filter(s =>
      s.currentReadings?.water_table_depth_cm !== null &&
      s.currentReadings?.water_table_depth_cm !== undefined
    );
    if (tmatSensors.length === 0) return null;
    const sum = tmatSensors.reduce((acc, s) => acc + s.currentReadings.water_table_depth_cm, 0);
    return parseFloat((sum / tmatSensors.length).toFixed(1));
  }

  get hottestStation() {
    if (this.totalCount === 0) return null;
    return [...this.sensors].sort((a, b) =>
      (b.currentReadings?.air_temperature_c || 0) - (a.currentReadings?.air_temperature_c || 0)
    )[0];
  }

  get driestPeatStation() {
    const tmatSensors = this.tmatEquippedSensors.filter(s =>
      s.currentReadings?.water_table_depth_cm !== null &&
      s.currentReadings?.water_table_depth_cm !== undefined
    );
    if (tmatSensors.length === 0) return null;
    return [...tmatSensors].sort((a, b) =>
      (a.currentReadings.water_table_depth_cm) - (b.currentReadings.water_table_depth_cm)
    )[0];
  }

  get recentAlerts() {
    const alerts = [];
    this.sensors.forEach(s => {
      const isCrit = s.isTmatCritical && s.isTmatCritical();
      const isWarnTmat = s.isTmatWarning && s.isTmatWarning();
      const fire = s.getFireRiskSummary ? s.getFireRiskSummary() : null;
      const rain = s.getPrecipitationAssessment ? s.getPrecipitationAssessment() : null;

      if (isCrit) {
        alerts.push({
          id: `${s.id}-tmat-crit`,
          sensorId: s.id,
          type: 'danger',
          title: 'Muka Air Gambut Melewati Batas Kritis',
          desc: `TMAT terukur ${s.currentReadings.water_table_depth_cm} cm (< -40 cm PP 71/2014). Rawan kebakaran bawah tanah.`,
          time: '12 mnt lalu'
        });
      } else if (isWarnTmat) {
        alerts.push({
          id: `${s.id}-tmat-warn`,
          sensorId: s.id,
          type: 'warning',
          title: 'Waspada Penurunan Cadangan Air Gambut',
          desc: `TMAT mendekati batas aman di ${s.currentReadings.water_table_depth_cm} cm. Periksa pintu sekat kanal.`,
          time: '25 mnt lalu'
        });
      }

      if (fire && fire.isHigh) {
        alerts.push({
          id: `${s.id}-fire-high`,
          sensorId: s.id,
          type: 'danger',
          title: 'Indeks Potensi Kebakaran Tinggi (FDRS)',
          desc: `Suhu ${s.currentReadings?.air_temperature_c}°C & RH rendah. Risiko sulutan biomassa tinggi.`,
          time: '18 mnt lalu'
        });
      }

      if (rain && rain.isRaining) {
        alerts.push({
          id: `${s.id}-rain-active`,
          sensorId: s.id,
          type: 'info',
          title: `Hujan Aktif Terdeteksi (${rain.badge})`,
          desc: `Intensitas presipitasi ${rain.rainMm} mm/jam terukur di stasiun ini.`,
          time: '34 mnt lalu'
        });
      }

      if (s.status === 'offline') {
        alerts.push({
          id: `${s.id}-offline`,
          sensorId: s.id,
          type: 'offline',
          title: 'Telemetri Terputus (Offline)',
          desc: 'Tidak ada sinyal paket data MQTT dalam 3 siklus transmisi terakhir.',
          time: '1 jam lalu'
        });
      }
    });

    if (alerts.length === 0) {
      alerts.push({
        id: 'fleet-nominal',
        sensorId: this.sensors[0]?.id || 'AWS-FLEET',
        type: 'success',
        title: 'Seluruh Armada Beroperasi Normal',
        desc: 'Kondisi mikroklimat konsesi aman, tidak ada anomali terdeteksi.',
        time: 'Baru saja'
      });
    }

    return alerts;
  }

  filterSensors({ query = '', filterType = 'all' } = {}) {
    const cleanQuery = query.trim().toLowerCase();

    return this.sensors.filter(sensor => {
      if (cleanQuery) {
        const matchesId = sensor.id.toLowerCase().includes(cleanQuery);
        const matchesName = sensor.name.toLowerCase().includes(cleanQuery);
        if (!matchesId && !matchesName) return false;
      }

      if (filterType === 'warning') {
        const isWarn = sensor.status === 'warning';
        const isCritTmat = sensor.isTmatCritical ? sensor.isTmatCritical() : false;
        const isHighFire = sensor.getFireRiskSummary ? sensor.getFireRiskSummary().isHigh : false;
        return isWarn || isCritTmat || isHighFire;
      }

      if (filterType === 'tmat') {
        return sensor.isTmatEquipped ? sensor.isTmatEquipped() : false;
      }

      if (filterType === 'rain') {
        const assessment = sensor.getPrecipitationAssessment ? sensor.getPrecipitationAssessment() : null;
        return assessment ? assessment.isRaining : (sensor.currentReadings?.rainfall_intensity_mmh || 0) > 0;
      }

      return true;
    });
  }
}

export default FleetTelemetrySummary;
