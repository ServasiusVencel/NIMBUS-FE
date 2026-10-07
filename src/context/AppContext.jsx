import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_CLIENTS, 
  INITIAL_SENSORS, 
  GENERATE_10_DAY_FORECAST, 
  PEST_DISEASE_ALERTS,
  MOCK_SUPERADMIN_USERS 
} from '../data/mockData';
import { SensorStation } from '../models/fleet/SensorStation';
import { EnterpriseClient } from '../models/fleet/EnterpriseClient';
import { DailyOperationalWindow, PestAlert } from '../models/agriculture/AgriculturePlan';
import { AuthSessionManager } from './managers/AuthSessionManager';
import { FleetManager } from './managers/FleetManager';
import { BackendHealthMonitor } from './managers/BackendHealthMonitor';
import { NavigationGuard } from './managers/NavigationGuard';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // 1. Auth & Session State (managed via AuthSessionManager)
  const initialAuth = AuthSessionManager.getInitialState();
  const [isLoggedIn, setIsLoggedIn] = useState(initialAuth.isLoggedIn);
  const [currentUser, setCurrentUser] = useState(initialAuth.currentUser);
  const [userRole, setUserRole] = useState(initialAuth.userRole);

  // 2. Fleet & Station State (managed via FleetManager)
  const [clients, setClients] = useState(() => 
    INITIAL_CLIENTS.map(c => EnterpriseClient.fromJSON(c))
  );
  const [activeClientId, setActiveClientId] = useState('CLI-002');

  const [sensors, setSensors] = useState(() => 
    INITIAL_SENSORS.map(s => SensorStation.fromJSON(s))
  );
  const [activeSensorId, setActiveSensorId] = useState('AWS-PLG-01');

  // 3. Navigation State (guarded via NavigationGuard)
  const [activeTab, setActiveTabState] = useState('dashboard');
  const setActiveTab = (tab) => {
    setActiveTabState(NavigationGuard.normalizeTab(tab, userRole));
  };

  // 4. Backend Health State (polled via BackendHealthMonitor)
  const [backendHealth, setBackendHealth] = useState({ isLive: false, checked: false, data: null });
  const [isRetraining, setIsRetraining] = useState(false);

  useEffect(() => {
    // Session token check
    AuthSessionManager.verifySession().then(verifiedUser => {
      if (verifiedUser) {
        setCurrentUser(verifiedUser);
        setUserRole(verifiedUser.role || 'user');
        setIsLoggedIn(true);
      }
    });

    // Start background health polling
    return BackendHealthMonitor.startPolling(15000, setBackendHealth);
  }, []);

  // Fleet Entity Derivations
  const activeClient = FleetManager.getActiveClient(clients, activeClientId);
  const visibleSensors = FleetManager.getVisibleSensors(sensors, activeClientId, userRole);
  const activeSensor = FleetManager.getActiveSensor(sensors, activeSensorId, visibleSensors);

  const handleClientChange = (newClientId) => {
    setActiveClientId(newClientId);
    const clientSensors = sensors.filter(s => s.clientId === newClientId);
    if (clientSensors.length > 0) {
      setActiveSensorId(clientSensors[0].id);
    }
  };

  // Auth Action Handlers
  const login = async (email, password) => {
    const result = await AuthSessionManager.login(email, password);
    if (result.success) {
      setIsLoggedIn(true);
      setCurrentUser(result.user);
      setUserRole(result.role);
      setActiveTab('dashboard');
    }
    return result;
  };

  const loginWithSSO = async (provider, customData = {}) => {
    const result = await AuthSessionManager.loginWithSSO(provider, customData);
    if (result.success) {
      setIsLoggedIn(true);
      setCurrentUser(result.user);
      setUserRole(result.role);
      setActiveTab('dashboard');
    }
    return result;
  };

  const register = (userData) => AuthSessionManager.register(userData);

  const logout = async () => {
    await AuthSessionManager.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserRole('user');
    setActiveTab('dashboard');
  };

  const updateProfile = async (profileData) => {
    const updatedUser = AuthSessionManager.updateProfile(currentUser, profileData);
    setCurrentUser(updatedUser);
    return { success: true, user: updatedUser };
  };

  const changePassword = async (passwords) => AuthSessionManager.changePassword(passwords);

  // Fleet Action Handlers
  const addClient = (data) => setClients(prev => FleetManager.addClient(prev, data));
  const updateClient = (id, data) => setClients(prev => FleetManager.updateClient(prev, id, data));
  const toggleClientModule = (id, mod) => setClients(prev => FleetManager.toggleClientModule(prev, id, mod));
  const addSensor = (data) => setSensors(prev => FleetManager.addSensor(prev, data));
  const updateSensor = (id, data) => setSensors(prev => FleetManager.updateSensor(prev, id, data));
  const toggleSensorCapability = (id, cap) => setSensors(prev => FleetManager.toggleSensorCapability(prev, id, cap));

  // Domain Datasets
  const forecast10Days = GENERATE_10_DAY_FORECAST().map(f => DailyOperationalWindow.fromJSON(f));
  const pestAlerts = PEST_DISEASE_ALERTS.map(p => PestAlert.fromJSON(p));

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        userRole,
        activeClientId,
        activeClient,
        clients,
        sensors,
        visibleSensors,
        activeSensorId,
        activeSensor,
        activeTab,
        backendHealth,
        forecast10Days,
        pestAlerts,
        mockSuperadminUsers: MOCK_SUPERADMIN_USERS,
        isRetraining,
        setIsRetraining,
        setActiveTab,
        setActiveSensorId,
        handleClientChange,
        login,
        loginWithSSO,
        register,
        logout,
        addClient,
        updateClient,
        toggleClientModule,
        addSensor,
        updateSensor,
        toggleSensorCapability,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
