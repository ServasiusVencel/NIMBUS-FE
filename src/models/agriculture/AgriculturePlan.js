/**
 * Domain Entities: DailyOperationalWindow & PestAlert (OOP Pattern)
 * Encapsulates agricultural intelligence, activity recommendations & pest risks
 */

export class DailyOperationalWindow {
  constructor(data = {}) {
    this.dayNumber = data.day || 1;
    this.date = data.date || '';
    this.dayName = data.dayName || 'Day';
    this.condition = data.condition || 'Clear';
    this.icon = data.icon || 'Sun';
    this.temperatureMax = data.temperatureMax || 32.0;
    this.temperatureMin = data.temperatureMin || 24.0;
    this.humidity = data.humidity || 65.0;
    this.rainProbability = data.rainProbability || 10;
    this.rainfallMm = data.rainfallMm || 0.0;
    this.solarRadiation = data.solarRadiation || 650;
    this.tmatProjectionCm = data.tmatProjectionCm ?? null;
    this.fireRiskLevel = data.fireRiskLevel || 'Moderate';

    this.operationalWindows = {
      fertilization: 'GOOD',
      spraying: 'GOOD',
      harvest: 'GOOD',
      otherOperations: 'GOOD',
      ...(data.operationalWindows || {})
    };
  }

  isOperationSafe(activityKey) {
    const status = this.operationalWindows[activityKey] || 'GOOD';
    return status === 'GOOD';
  }

  getStatusBadge(activityKey) {
    const status = this.operationalWindows[activityKey] || 'GOOD';
    switch (status) {
      case 'GOOD':
        return { label: '● Direkomendasikan', code: 'good', color: 'var(--green)' };
      case 'CAUTION':
        return { label: '● Waspada / Cek Lapangan', code: 'caution', color: 'var(--amber)' };
      case 'NOT RECOMMENDED':
      default:
        return { label: '● Tidak Direkomendasikan', code: 'notrec', color: 'var(--red)' };
    }
  }

  static fromJSON(json) {
    return new DailyOperationalWindow(json);
  }
}

export class PestAlert {
  constructor(data = {}) {
    this.id = data.id || '';
    this.diseaseName = data.diseaseName || '';
    this.commodity = data.commodity || 'Kelapa Sawit';
    this.riskLevel = data.riskLevel || 'MEDIUM'; // 'HIGH' | 'MEDIUM' | 'LOW'
    this.riskScore = data.riskScore || 50;
    this.incubationForecast = data.incubationForecast || '';
    this.weatherTrigger = data.weatherTrigger || '';
    this.recommendedAction = data.recommendedAction || '';
    this.affectedStations = Array.isArray(data.affectedStations) ? [...data.affectedStations] : [];
  }

  isHighRisk() {
    return this.riskLevel.toUpperCase() === 'HIGH';
  }

  getBadge() {
    if (this.isHighRisk()) {
      return { label: 'BAHAYA TINGGI', color: 'var(--red)', bg: '#fef2f2' };
    }
    if (this.riskLevel.toUpperCase() === 'MEDIUM') {
      return { label: 'WASPADA SEDANG', color: 'var(--amber)', bg: '#fffbeb' };
    }
    return { label: 'MONITORING AMAN', color: 'var(--green)', bg: '#f0fdf4' };
  }

  affectsStation(stationId) {
    return this.affectedStations.includes(stationId);
  }

  static fromJSON(json) {
    return new PestAlert(json);
  }
}

export default { DailyOperationalWindow, PestAlert };
