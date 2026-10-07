import { apiService } from '../../services/api';

/**
 * OOP Manager: BackendHealthMonitor
 * Manages interval polling and health telemetry for the Nimbus AI & FastAPI engine.
 */
export class BackendHealthMonitor {
  /**
   * Performs single health check
   */
  static async checkHealth() {
    return await apiService.checkHealth();
  }

  /**
   * Sets up periodic background polling
   * @param {number} intervalMs 
   * @param {function} onStatusUpdate 
   * @returns {function} cleanup unsubscription function
   */
  static startPolling(intervalMs = 15000, onStatusUpdate) {
    let isCancelled = false;

    const executeCheck = async () => {
      const res = await BackendHealthMonitor.checkHealth();
      if (!isCancelled && typeof onStatusUpdate === 'function') {
        onStatusUpdate({ isLive: res.isLive, checked: true, data: res.data });
      }
    };

    // Immediate first check
    executeCheck();

    // Recurring interval
    const timerId = setInterval(executeCheck, intervalMs);

    return () => {
      isCancelled = true;
      clearInterval(timerId);
    };
  }
}

export default BackendHealthMonitor;
