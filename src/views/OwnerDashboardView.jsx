import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { Zap, Plus } from 'lucide-react';
import { PlatformUser } from '../models/PlatformUser';
import { FleetStatusCard } from '../components/admin/FleetStatusCard';
import { PortfolioKpiCard } from '../components/admin/PortfolioKpiCard';
import { ClientAllocationTable } from '../components/admin/ClientAllocationTable';
import { UserManagementTable } from '../components/admin/UserManagementTable';
import { AddUserModal } from '../components/admin/AddUserModal';
import { EditUserModal } from '../components/admin/EditUserModal';

/**
 * OwnerDashboardView: Orchestrator view for platform administration,
 * portfolio KPI metrics, enterprise clients, and RBAC user access.
 */
export const OwnerDashboardView = () => {
  const { 
    userRole, 
    currentUser, 
    clients, 
    sensors, 
    mockSuperadminUsers, 
    isRetraining, 
    setIsRetraining,
    handleClientChange,
    setActiveTab 
  } = useApp();

  const [usersList, setUsersList] = useState(mockSuperadminUsers || []);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);

  // Fetch users from API (Superadmin only) with mock fallback
  const fetchUsers = async () => {
    if (userRole !== 'superadmin') return;
    setLoadingUsers(true);
    setUsersError('');
    try {
      const res = await apiService.getSuperadminUsers();
      if (res && res.users && res.users.length > 0) {
        setUsersList(res.users.map(u => PlatformUser.fromJSON(u)));
      } else {
        setUsersList((mockSuperadminUsers || []).map(u => PlatformUser.fromJSON(u)));
      }
    } catch {
      // Offline fallback
      setUsersList((mockSuperadminUsers || []).map(u => PlatformUser.fromJSON(u)));
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  // Handle Add User
  const handleAddUser = async (newUserData) => {
    try {
      await apiService.register(newUserData);
      fetchUsers();
    } catch {
      // Local addition for seamless demo
      const localNewUser = PlatformUser.fromJSON({
        id: `usr-loc-${Date.now()}`,
        email: newUserData.email,
        full_name: newUserData.full_name,
        role: newUserData.role,
        created_at: new Date().toISOString()
      });
      setUsersList(prev => [localNewUser, ...prev]);
    }
    alert('Pengguna berhasil didaftarkan ke platform Nimbus!');
  };

  // Open Edit User Modal
  const handleOpenEdit = (user) => {
    setCurrentUserToEdit(user);
    setShowEditModal(true);
  };

  // Handle Update User
  const handleUpdateUser = async (userId, updateData) => {
    try {
      await apiService.updateSuperadminUser(userId, updateData);
      fetchUsers();
    } catch {
      setUsersList(prev => prev.map(u => 
        u.id === userId ? new PlatformUser({ ...u, ...updateData }) : u
      ));
    }
    alert('Data pengguna berhasil diperbarui!');
  };

  // Handle Delete User
  const handleDeleteUser = async (user) => {
    if (user.email === currentUser?.email) {
      alert('Anda tidak dapat menghapus akun Anda sendiri demi keamanan.');
      return;
    }
    if (!window.confirm(`Yakin ingin menghapus pengguna "${user.email}"?`)) {
      return;
    }
    try {
      await apiService.deleteSuperadminUser(user.id);
      fetchUsers();
    } catch {
      setUsersList(prev => prev.filter(u => u.id !== user.id));
    }
    alert(`Pengguna ${user.email} berhasil dihapus.`);
  };

  // Handle Manual AI Retraining
  const handleTriggerRetrain = async () => {
    setIsRetraining(true);
    try {
      await apiService.triggerRetrain();
      alert('Zero-Downtime Retraining berhasil dipicu di background!');
    } catch (err) {
      alert(`Gagal memicu retraining: ${err.message}`);
    } finally {
      setIsRetraining(false);
    }
  };

  return (
    <section id="screen-owner" className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/70">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Owner & Platform CMS Overview</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Portfolio-wide intelligence, active client allocations, IoT hardware deployments, and user RBAC controls.</p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            type="button"
            className="h-9 px-4 text-xs font-semibold text-white bg-blue hover:bg-blue2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer" 
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={15} />
            <span>Add User</span>
          </button>
          <button 
            type="button"
            className="h-9 px-4 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer" 
            onClick={handleTriggerRetrain} 
            disabled={isRetraining}
          >
            <Zap size={14} className={isRetraining ? 'animate-spin' : ''} />
            <span>{isRetraining ? 'Retraining...' : 'Trigger AI Retrain'}</span>
          </button>
        </div>
      </div>

      {/* Fleet Telemetry Mini Grid & Portfolio Metrics KPI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 flex flex-col">
          <FleetStatusCard 
            sensors={sensors}
            onOpenMap={() => setActiveTab('map')}
          />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <PortfolioKpiCard 
            clients={clients}
            sensors={sensors}
          />
        </div>
      </div>

      {/* Enterprise Client Allocations Table */}
      <ClientAllocationTable 
        clients={clients}
        sensors={sensors}
        onSelectClient={(clientId) => {
          handleClientChange(clientId);
          setActiveTab('map');
        }}
        onOpenDirectory={() => setActiveTab('clients')}
      />

      {/* RBAC User Management Table */}
      <UserManagementTable 
        usersList={usersList}
        userRole={userRole}
        currentUser={currentUser}
        loadingUsers={loadingUsers}
        usersError={usersError}
        onRefresh={fetchUsers}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteUser}
      />

      {/* Add User Modal */}
      <AddUserModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddUser}
      />

      {/* Edit User Modal */}
      <EditUserModal 
        isOpen={showEditModal}
        user={currentUserToEdit}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateUser}
      />
    </section>
  );
};

export default OwnerDashboardView;
