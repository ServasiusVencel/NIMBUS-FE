import { EnterpriseClient } from '../../models/fleet/EnterpriseClient';
import { SensorStation } from '../../models/fleet/SensorStation';

export class FleetManager {
  /**
   * Derives active client entity
   */
  static getActiveClient(clients, activeClientId) {
    return clients.find(c => c.id === activeClientId) || clients[0];
  }

  /**
   * Derives visible sensors depending on role
   */
  static getVisibleSensors(sensors, activeClientId, userRole) {
    if (userRole === 'superadmin') {
      return sensors;
    }
    return sensors.filter(s => s.clientId === activeClientId);
  }

  /**
   * Derives active sensor entity
   */
  static getActiveSensor(sensors, activeSensorId, visibleSensors) {
    return sensors.find(s => s.id === activeSensorId) || visibleSensors[0] || sensors[0];
  }

  /**
   * Mutates client collection with a new client
   */
  static addClient(clients, newClientData) {
    const client = newClientData instanceof EnterpriseClient
      ? newClientData
      : EnterpriseClient.fromJSON(newClientData);
    return [...clients, client];
  }

  /**
   * Mutates existing client entity
   */
  static updateClient(clients, clientId, updatedData) {
    return clients.map(c => {
      if (c.id === clientId) {
        return new EnterpriseClient({ ...c, ...updatedData });
      }
      return c;
    });
  }

  /**
   * Toggles a module for a client
   */
  static toggleClientModule(clients, clientId, moduleKey) {
    return clients.map(c => {
      if (c.id === clientId) {
        return c.toggleModule(moduleKey);
      }
      return c;
    });
  }

  /**
   * Adds a new sensor station to fleet
   */
  static addSensor(sensors, newSensorData) {
    const sensor = newSensorData instanceof SensorStation
      ? newSensorData
      : SensorStation.fromJSON(newSensorData);
    return [...sensors, sensor];
  }

  /**
   * Updates an existing sensor station
   */
  static updateSensor(sensors, sensorId, updatedData) {
    return sensors.map(s => {
      if (s.id === sensorId) {
        return new SensorStation({ ...s, ...updatedData });
      }
      return s;
    });
  }

  /**
   * Toggles a sensor capability (e.g. groundwater_tmat)
   */
  static toggleSensorCapability(sensors, sensorId, capabilityKey) {
    return sensors.map(s => {
      if (s.id === sensorId) {
        return s.toggleCapability(capabilityKey);
      }
      return s;
    });
  }
}

export default FleetManager;
