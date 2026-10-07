import { PdfReportGenerator } from '../../services/PdfReportGenerator.js';

export class TelemetryExportRequest {
  constructor({
    targetStation = 'all',
    startDate = '2026-09-01',
    endDate = '2026-09-29',
    resolution = 'hourly',
    fileFormat = 'csv',
    selectedParams = {},
    sensors = []
  } = {}) {
    this.targetStation = targetStation;
    this.startDate = startDate;
    this.endDate = endDate;
    this.resolution = resolution;
    this.fileFormat = fileFormat;
    this.sensors = Array.isArray(sensors) ? sensors : [];

    this.selectedParams = {
      air_temp: true,
      humidity: true,
      solar_rad: true,
      rainfall: true,
      wind: true,
      tmat: true,
      soil: true,
      battery: true,
      ...selectedParams
    };
  }

  // Domain Queries
  get isAllStations() {
    return this.targetStation === 'all';
  }

  get targetSensors() {
    if (this.isAllStations) {
      return this.sensors.length > 0 ? this.sensors : [];
    }
    const found = this.sensors.find(s => s.id === this.targetStation);
    return found ? [found] : this.sensors.slice(0, 1);
  }

  get stationLabel() {
    if (this.isAllStations) {
      return `Seluruh Armada (${this.sensors.length} Stasiun)`;
    }
    const s = this.sensors.find(x => x.id === this.targetStation);
    return s ? `${s.id} · ${s.name || s.id}` : this.targetStation;
  }

  get daysCount() {
    const s = new Date(this.startDate);
    const e = new Date(this.endDate);
    const diffTime = Math.abs(e - s);
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  get estimatedRowsCount() {
    const recordsPerDay = this.resolution === 'raw5m' ? 288 : this.resolution === 'hourly' ? 24 : 1;
    const count = this.targetSensors.length * this.daysCount * recordsPerDay;
    return Math.max(24, count);
  }

  get estimatedFileSizeKb() {
    const bytesPerRow = this.fileFormat === 'csv' ? 85 : this.fileFormat === 'json' ? 140 : 200;
    return Math.max(8, Math.round((this.estimatedRowsCount * bytesPerRow) / 1024));
  }

  get formattedFileSize() {
    const kb = this.estimatedFileSizeKb;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
  }

  get defaultFileName() {
    const targetTag = this.isAllStations ? 'AWS-FLEET' : this.targetStation;
    const ext = this.fileFormat === 'pdf' ? 'pdf' : this.fileFormat;
    return `Nimbus_Telemetry_${targetTag}_${this.startDate}_to_${this.endDate}.${ext}`;
  }

  get availableVariables() {
    return [
      { key: 'air_temp', label: 'Suhu Udara', unit: '°C' },
      { key: 'humidity', label: 'Kelembaban Udara', unit: 'RH %' },
      { key: 'solar_rad', label: 'Radiasi Surya', unit: 'W/m²' },
      { key: 'rainfall', label: 'Curah Hujan', unit: 'mm' },
      { key: 'wind', label: 'Kecepatan Angin', unit: 'm/s' },
      { key: 'tmat', label: 'Muka Air Gambut', unit: 'TMAT cm' },
      { key: 'soil', label: 'Kelembaban Tanah', unit: '%' },
      { key: 'battery', label: 'Tegangan Aki / Solar', unit: 'Volt' }
    ];
  }

  generatePreviewRows(limit = 5) {
    const sensorsToUse = this.targetSensors.length > 0 ? this.targetSensors : [{ id: 'AWS-PLG-01' }];
    const rows = [];
    const timestamps = [
      '2026-09-29 14:00',
      '2026-09-29 13:00',
      '2026-09-29 12:00',
      '2026-09-29 11:00',
      '2026-09-29 10:00'
    ];

    for (let i = 0; i < Math.min(limit, timestamps.length); i++) {
      const sensor = sensorsToUse[i % sensorsToUse.length];
      const r = sensor.currentReadings || {};
      const hasTmat = sensor.isTmatEquipped ? sensor.isTmatEquipped() : !!sensor.capabilities?.groundwater_tmat;

      rows.push({
        time: timestamps[i],
        id: sensor.id,
        temp: (r.air_temperature_c ?? 31.0 - i * 0.3).toFixed(1),
        rh: Math.round(r.relative_humidity_pct ?? 60 + i * 2),
        solar: Math.round(r.solar_radiation_wm2 ?? 700 - i * 40),
        rain: (r.rainfall_intensity_mmh ?? 0.0).toFixed(1),
        wind: (r.wind_speed_ms ?? 2.0).toFixed(1),
        tmat: hasTmat ? (r.water_table_depth_cm ?? -38.5 + i * 0.2).toFixed(1) : 'N/A',
        soil: (r.soil_moisture_pct ?? 78.0).toFixed(1),
        volt: '12.6'
      });
    }

    return rows;
  }

  executeDownload() {
    const fileName = this.defaultFileName;

    // PDF generation delegated to PdfReportGenerator service class
    if (this.fileFormat === 'pdf') {
      const generator = new PdfReportGenerator(this);
      generator.generate();
      return;
    }

    if (this.fileFormat === 'json') {
      const previewData = this.generatePreviewRows(20);
      const jsonStr = JSON.stringify({
        metadata: {
          platform: 'Nimbus Environmental Intelligence Platform',
          exported_at: new Date().toISOString(),
          station_scope: this.stationLabel,
          date_range: `${this.startDate} to ${this.endDate}`,
          resolution: this.resolution,
          variables_included: Object.keys(this.selectedParams).filter(k => this.selectedParams[k])
        },
        records: previewData
      }, null, 2);

      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    // Default CSV generation
    const headerCols = ['Timestamp', 'Station_ID'];
    if (this.selectedParams.air_temp) headerCols.push('Air_Temp_C');
    if (this.selectedParams.humidity) headerCols.push('Relative_Humidity_Pct');
    if (this.selectedParams.solar_rad) headerCols.push('Solar_Rad_Wm2');
    if (this.selectedParams.rainfall) headerCols.push('Rainfall_mm');
    if (this.selectedParams.wind) headerCols.push('Wind_Speed_ms');
    if (this.selectedParams.tmat) headerCols.push('Water_Table_cm');
    if (this.selectedParams.soil) headerCols.push('Soil_Moisture_Pct');
    if (this.selectedParams.battery) headerCols.push('Battery_Voltage_V');

    const csvLines = [headerCols.join(',')];
    const previewData = this.generatePreviewRows(24);

    previewData.forEach(row => {
      const line = [row.time, row.id];
      if (this.selectedParams.air_temp) line.push(row.temp);
      if (this.selectedParams.humidity) line.push(row.rh);
      if (this.selectedParams.solar_rad) line.push(row.solar);
      if (this.selectedParams.rainfall) line.push(row.rain);
      if (this.selectedParams.wind) line.push(row.wind);
      if (this.selectedParams.tmat) line.push(row.tmat);
      if (this.selectedParams.soil) line.push(row.soil);
      if (this.selectedParams.battery) line.push(row.volt);
      csvLines.push(line.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvLines.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default TelemetryExportRequest;
