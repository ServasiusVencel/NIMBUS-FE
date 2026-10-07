import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';

export const OwnerDashboardView = () => {
  const { userRole, currentUser } = useApp();
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState('');
  
  // Retrain status
  const [retrainStatus, setRetrainStatus] = useState(null);
  const [isRetraining, setIsRetraining] = useState(false);

  // Modal states for user management
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);

  // Form states
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('Password123!');
  const [newUserFullName, setNewUserFullName] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');

  const [editFullName, setEditFullName] = useState('');
  const [editRole, setEditRole] = useState('user');
  const [editPassword, setEditPassword] = useState('');

  // Fetch users from API (Superadmin only)
  const fetchUsers = async () => {
    if (userRole !== 'superadmin') return;
    setLoadingUsers(true);
    setUsersError('');
    try {
      const res = await apiService.getSuperadminUsers();
      if (res.users) {
        setUsersList(res.users);
      }
    } catch (err) {
      setUsersError(err.message || 'Failed to load users from database');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userRole]);

  // Handle Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await apiService.register({
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
        full_name: newUserFullName,
      });
      setShowAddModal(false);
      setNewUserEmail('');
      setNewUserFullName('');
      fetchUsers();
      alert('Pengguna berhasil didaftarkan ke database Supabase!');
    } catch (err) {
      alert(`Gagal menambah pengguna: ${err.message}`);
    }
  };

  // Open Edit User Modal
  const openEdit = (user) => {
    setCurrentUserToEdit(user);
    setEditFullName(user.full_name || '');
    setEditRole(user.role || 'user');
    setEditPassword('');
    setShowEditModal(true);
  };

  // Handle Update User
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!currentUserToEdit) return;
    try {
      const updateData = {
        full_name: editFullName,
        role: editRole,
      };
      if (editPassword) updateData.password = editPassword;

      await apiService.updateSuperadminUser(currentUserToEdit.id, updateData);
      setShowEditModal(false);
      fetchUsers();
      alert('Data pengguna berhasil diperbarui!');
    } catch (err) {
      alert(`Gagal memperbarui pengguna: ${err.message}`);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (user) => {
    if (user.email === currentUser?.email) {
      alert('Anda tidak dapat menghapus akun Anda sendiri demi keamanan.');
      return;
    }
    if (!window.confirm(`Yakin ingin menghapus pengguna "${user.email}" dari database Supabase?`)) {
      return;
    }
    try {
      await apiService.deleteSuperadminUser(user.id);
      fetchUsers();
      alert(`Pengguna ${user.email} berhasil dihapus.`);
    } catch (err) {
      alert(`Gagal menghapus pengguna: ${err.message}`);
    }
  };

  // Handle Manual AI Retraining
  const handleTriggerRetrain = async () => {
    setIsRetraining(true);
    try {
      const res = await apiService.triggerRetrain();
      setRetrainStatus(res);
      alert('Zero-Downtime Retraining berhasil dipicu di background!');
    } catch (err) {
      alert(`Gagal memicu retraining: ${err.message}`);
    } finally {
      setIsRetraining(false);
    }
  };

  return (
    <section id="screen-owner" className="screen active">
      <div className="page-title">
        <div>
          <h2>Owner Dashboard</h2>
          <p>Portfolio-wide monitoring of projects, IoT deployments and client environments.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="primary" style={{ padding: '0 16px' }} onClick={() => setShowAddModal(true)}>
            + Add User / Project
          </button>
          <button className="secondary" style={{ height: 38 }} onClick={handleTriggerRetrain} disabled={isRetraining}>
            {isRetraining ? 'Retraining...' : '⚡ Trigger AI Retrain'}
          </button>
        </div>
      </div>

      {/* Admin Grid: Admin Map & Portfolio Status */}
      <div className="admin-grid">
        <div className="admin-map">
          <div className="map-grid"></div>
          <div className="flatland">
            <span className="land-a"></span>
            <span className="land-b"></span>
            <span className="land-c"></span>
            <span className="land-d"></span>
            <span className="land-e"></span>
          </div>
          <span className="sensor online s1" title="AWS-PLG-01"></span>
          <span className="sensor online s2" title="AWS-PLG-02"></span>
          <span className="sensor warning s3" title="AWS-PT-03"></span>
          <span className="sensor danger s5" title="AWS-PLG-05"></span>
          <span className="sensor offline s6" title="AWS-PT-06"></span>
          <span className="sensor online s8" title="AWS-AGR-08"></span>
        </div>

        <div className="card">
          <h3>Portfolio Status</h3>
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
            <span>Total Projects</span>
            <b>12</b>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
            <span>Active Clients</span>
            <b>9</b>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
            <span>IoT Sensors</span>
            <b>134</b>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
            <span>Online</span>
            <b style={{ color: 'var(--green)' }}>126</b>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
            <span>Offline</span>
            <b style={{ color: 'var(--red)' }}>5</b>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
            <span>Warning</span>
            <b style={{ color: 'var(--amber)' }}>3</b>
          </p>
        </div>
      </div>

      {/* Projects & Clients Table */}
      <div className="card" style={{ marginTop: 18 }}>
        <h3>Projects & Clients</h3>
        <table className="table" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Sensors</th>
              <th>Status</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Palm Oil Estate</td>
              <td>PT Lestari Hijau</td>
              <td>29</td>
              <td><span className="pill">Active</span></td>
              <td>2 min ago</td>
            </tr>
            <tr>
              <td>Peatland Monitoring</td>
              <td>PT Nusantara Carbon</td>
              <td>18</td>
              <td><span className="pill">Active</span></td>
              <td>4 min ago</td>
            </tr>
            <tr>
              <td>Agriculture Cluster</td>
              <td>Farmer Cooperative A</td>
              <td>41</td>
              <td><span className="pill">Active</span></td>
              <td>8 min ago</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* CMS & User Management connected to Supabase */}
      <div className="card" style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>CMS & User Management (Supabase Database)</h3>
            <p className="muted" style={{ margin: '4px 0 0', fontSize: 12 }}>
              Authorized via Bearer JWT Token. Superadmin exclusive RBAC access.
            </p>
          </div>
          {userRole === 'superadmin' && (
            <button className="primary" style={{ height: 32, fontSize: 12, padding: '0 12px' }} onClick={fetchUsers}>
              {loadingUsers ? 'Refreshing...' : '↻ Refresh Users'}
            </button>
          )}
        </div>

        {userRole !== 'superadmin' ? (
          <div style={{ padding: 18, background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 8, marginTop: 12 }}>
            <b style={{ color: 'var(--amber)' }}>🔒 Restricted Superadmin Access</b>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--text)' }}>
              Anda saat ini masuk sebagai <b>{currentUser?.email}</b> dengan role <b>'{userRole}'</b>. Manajemen pengguna database Supabase memerlukan hak akses <b>'superadmin'</b>.
            </p>
          </div>
        ) : (
          <div style={{ marginTop: 14 }}>
            {usersError && (
              <div style={{ color: 'var(--red)', fontSize: 12, marginBottom: 8 }}>
                ⚠️ {usersError}
              </div>
            )}

            <table className="table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id}>
                    <td><b>{u.full_name || '—'}</b></td>
                    <td>{u.email}</td>
                    <td>
                      <span className="pill" style={{
                        background: u.role === 'superadmin' ? '#fef3c7' : '#e9f8ef',
                        color: u.role === 'superadmin' ? '#b45309' : '#168449'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleString() : '—'}
                    </td>
                    <td>
                      <button
                        className="secondary"
                        style={{ height: 26, fontSize: 11, padding: '0 8px', marginRight: 6 }}
                        onClick={() => openEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="secondary"
                        style={{ height: 26, fontSize: 11, padding: '0 8px', color: 'var(--red)', borderColor: '#fca5a5' }}
                        onClick={() => handleDeleteUser(u)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New User (Supabase Auth)</h3>
            <p className="muted" style={{ fontSize: 12 }}>Account will be created and activated immediately without email confirmation.</p>
            <form onSubmit={handleAddUser}>
              <div className="field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Nama Pengguna"
                  value={newUserFullName}
                  onChange={(e) => setNewUserFullName(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="user@perusahaan.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Password123!"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Role</label>
                <select className="select" style={{ width: '100%' }} value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
                  <option value="user">User / Operator</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                <button type="button" className="secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="primary">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && currentUserToEdit && (
        <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit User: {currentUserToEdit.email}</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="field">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Role</label>
                <select className="select" style={{ width: '100%' }} value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                  <option value="user">user</option>
                  <option value="superadmin">superadmin</option>
                </select>
              </div>
              <div className="field">
                <label>New Password (Leave empty to keep current)</label>
                <input
                  type="password"
                  placeholder="Optional new password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                <button type="button" className="secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
