
export class EnterpriseClient {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || 'Unnamed Client';
    this.industry = data.industry || 'Agriculture';
    this.pic = data.pic || '-';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.status = data.status || 'active'; // 'active' | 'suspended'
    this.projects = Array.isArray(data.projects) ? [...data.projects] : [];
    this.assignedSensors = Array.isArray(data.assignedSensors) ? [...data.assignedSensors] : [];

    this.enabledModules = {
      general_weather: true,
      fire_warning: true,
      climate_agriculture: true,
      pest_warning: true,
      emission_intelligence: false,
      carbon_mrv: false,
      ...(data.enabledModules || {})
    };
  }

  isModuleEnabled(key) {
    return this.enabledModules[key] !== false;
  }

  toggleModule(key) {
    const currentVal = this.isModuleEnabled(key);
    return new EnterpriseClient({
      ...this,
      enabledModules: {
        ...this.enabledModules,
        [key]: !currentVal
      }
    });
  }

  assignSensor(sensorId) {
    if (this.assignedSensors.includes(sensorId)) return this;
    return new EnterpriseClient({
      ...this,
      assignedSensors: [...this.assignedSensors, sensorId]
    });
  }

  removeSensor(sensorId) {
    return new EnterpriseClient({
      ...this,
      assignedSensors: this.assignedSensors.filter(id => id !== sensorId)
    });
  }

  getActiveModulesCount() {
    return Object.values(this.enabledModules).filter(Boolean).length;
  }

  static fromJSON(json) {
    return new EnterpriseClient(json);
  }
}

export default EnterpriseClient;
