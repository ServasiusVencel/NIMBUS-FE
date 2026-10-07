import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CLIENTS, INITIAL_SENSORS, GENERATE_10_DAY_FORECAST, PEST_DISEASE_ALERTS } from '../data/mockData';
import { apiService, getStoredToken, getStoredUser, setStoredToken, setStoredUser } from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Authentication & Token State
  const initialToken = getStoredToken();
  const initialUser = getStoredUser();

  const [isLoggedIn, setIsLoggedIn] = useState(!!initialToken);
  const [currentUser, setCurrentUser] = useState(initialUser || {
    id: 'user-default',
    email: 'operator@nimbus.earth',
    role: 'user',
    full_name: 'John Doe'
  });
  const [userRole, setUserRole] = useState(initialUser?.role || 'user'); // 'user' | 'superadmin'

  // Entities & Station State
  const [activeClientId, setActiveClientId] = useState('CLI-002');
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [sensors, setSensors] = useState(INITIAL_SENSORS);
  const [activeSensorId, setActiveSensorId] = useState('AWS-PLG-01');
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'weather' | 'fire' | 'agri' | 'owner' | 'settings'

  // Backend Health
  const [backendHealth, setBackendHealth] = useState({ isLive: false, checked: false, data: null });
  const [isRetraining, setIsRetraining] = useState(false);

  // Check Backend AI Health & verify session
  useEffect(() => {
    let isMounted = true;
    async function initCheck() {
      const res = await apiService.checkHealth();
      if (isMounted) {
        setBackendHealth({ isLive: res.isLive, checked: true, data: res.data });
      }

      // If token exists, verify with /api/v1/auth/me
      if (getStoredToken()) {
        try {
          const meRes = await apiService.getMe();
          if (isMounted && meRes.success && meRes.user) {
            setCurrentUser(meRes.user);
            setUserRole(meRes.user.role || 'user');
            setIsLoggedIn(true);
          }
        } catch {
          // Token might be expired or server restarted
        }
      }
    }

    initCheck();
    const interval = setInterval(async () => {
      const res = await apiService.checkHealth();
      if (isMounted) {
        setBackendHealth({ isLive: res.isLive, checked: true, data: res.data });
      }
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Derived Client & Sensors
  const activeClient = clients.find(c => c.id === activeClientId) || clients[0];
  const visibleSensors = userRole === 'superadmin'
    ? sensors
    : sensors.filter(s => s.clientId === activeClientId);
  const activeSensor = sensors.find(s => s.id === activeSensorId) || visibleSensors[0] || sensors[0];

  const handleClientChange = (newClientId) => {
    setActiveClientId(newClientId);
    const clientSensors = sensors.filter(s => s.clientId === newClientId);
    if (clientSensors.length > 0) {
      setActiveSensorId(clientSensors[0].id);
    }
  };

  // Auth: Login Action
  const login = async (email, password) => {
    try {
      const res = await apiService.login(email, password);
      if (res.access_token) {
        setIsLoggedIn(true);
        const userObj = res.user || { email, role: 'user', full_name: email.split('@')[0] };
        setCurrentUser(userObj);
        setUserRole(userObj.role || 'user');
        setActiveTab('map');
        return { success: true, user: userObj };
      }
      throw new Error('No access token returned from server');
    } catch (err) {
      // Offline fallback for demo if backend is offline
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        const isSuperadmin = email.includes('admin') || email.includes('super');
        const mockUser = {
          id: 'mock-offline-id',
          email,
          role: isSuperadmin ? 'superadmin' : 'user',
          full_name: isSuperadmin ? 'Nimbus Executive' : 'John Doe'
        };
        setStoredToken('mock-demo-token');
        setStoredUser(mockUser);
        setIsLoggedIn(true);
        setCurrentUser(mockUser);
        setUserRole(mockUser.role);
        setActiveTab('map');
        return { success: true, user: mockUser, offline: true };
      }
      throw err;
    }
  };

  // Auth: Register Action
  const register = async (userData) => {
    return await apiService.register(userData);
  };

  // Auth: Logout Action
  const logout = async () => {
    await apiService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserRole('user');
    setActiveTab('map');
  };

  // CMS Helpers
  const addClient = (newClient) => setClients(prev => [...prev, newClient]);
  const updateClient = (clientId, updatedData) => setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...updatedData } : c));
  const addSensor = (newSensor) => setSensors(prev => [...prev, newSensor]);
  const updateSensor = (sensorId, updatedData) => setSensors(prev => prev.map(s => s.id === sensorId ? { ...s, ...updatedData } : s));

  const forecast10Days = GENERATE_10_DAY_FORECAST();

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
        pestAlerts: PEST_DISEASE_ALERTS,
        isRetraining,
        setIsRetraining,
        setActiveTab,
        setActiveSensorId,
        handleClientChange,
        login,
        register,
        logout,
        addClient,
        updateClient,
        addSensor,
        updateSensor,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
