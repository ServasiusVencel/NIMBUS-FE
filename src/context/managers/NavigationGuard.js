/**
 * OOP Manager: NavigationGuard
 * Encapsulates role-based access control (RBAC) and tab route normalization.
 */
export class NavigationGuard {
  static CMS_TABS = ['owner', 'clients', 'sensors', 'modules', 'ai_health'];

  /**
   * Normalizes requested tab with alias mapping and Superadmin RBAC enforcement
   * @param {string} requestedTab 
   * @param {string} userRole 
   * @returns {string} valid canonical tab
   */
  static normalizeTab(requestedTab, userRole = 'user') {
    let target = requestedTab === 'agriculture' ? 'agri' : requestedTab;

    if (NavigationGuard.CMS_TABS.includes(target) && userRole !== 'superadmin') {
      return 'dashboard';
    }

    return target;
  }
}

export default NavigationGuard;
