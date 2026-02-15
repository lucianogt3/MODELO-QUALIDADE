
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicForm from './components/PublicForm';
import QualityDashboard from './components/QualityDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import AdminSettings from './components/AdminSettings';
import { Notification, User, Sector, Role, NotificationStatus, IncidentClassification } from './types';

const INITIAL_ROLES: Role[] = [
  { id: '1', name: 'Qualidade', permissions: ['all'] },
  { id: '2', name: 'Gestor', permissions: ['analysis'] },
  { id: '3', name: 'Administrador', permissions: ['admin'] }
];

const INITIAL_SECTORS: Sector[] = [
  { id: '1', name: 'Unidade 4° andar', active: true },
  { id: '2', name: 'OPME', active: true },
  { id: '3', name: 'Farmácia', active: true },
  { id: '4', name: 'UTI Adulto', active: true },
  { id: '5', name: 'Hotelaria', active: true }
];

const INITIAL_USERS: User[] = [
  { id: '1', name: 'Ana Qualidade', email: 'ana@hospital.com', role: 'Qualidade', sectors: ['Qualidade'], active: true },
  { id: '2', name: 'Carlos Gestor', email: 'carlos@hospital.com', role: 'Gestor', sectors: ['Unidade 4° andar', 'OPME', 'Farmácia'], active: true },
  { id: '3', name: 'Admin Master', email: 'admin@hospital.com', role: 'Administrador', sectors: [], active: true }
];

const App: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [sectors, setSectors] = useState<Sector[]>(INITIAL_SECTORS);
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const addNotification = (newNotif: any) => {
    const fullNotif: Notification = {
      ...newNotif,
      id: Math.random().toString(36).substr(2, 9),
      notificationNumber: notifications.length + 1000,
      status: NotificationStatus.PENDING,
      isSentToArea: false,
      createdAt: Date.now()
    };
    setNotifications([fullNotif, ...notifications]);
  };

  const updateNotification = (id: string, updates: Partial<Notification>) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  return (
    <Router>
      <Routes>
        {/* Página inicial é o formulário público */}
        <Route path="/" element={<PublicForm sectors={sectors} onSubmit={addNotification} />} />
        <Route path="/login" element={<Login users={users} onLogin={setCurrentUser} />} />
        
        <Route path="/dashboard/*" element={
          currentUser ? (
            <div className="flex h-screen overflow-hidden bg-white">
              <Sidebar user={currentUser} onLogout={() => setCurrentUser(null)} />
              <main className="flex-1 overflow-y-auto bg-slate-50">
                <Routes>
                  <Route path="/" element={
                    currentUser.role === 'Qualidade' || currentUser.role === 'Administrador' 
                      ? <QualityDashboard notifications={notifications} updateNotification={updateNotification} /> 
                      : <ManagerDashboard user={currentUser} notifications={notifications} updateNotification={updateNotification} />
                  } />
                  <Route path="/admin" element={
                    currentUser.role === 'Administrador' 
                      ? <AdminSettings users={users} setUsers={setUsers} sectors={sectors} setSectors={setSectors} roles={roles} setRoles={setRoles} /> 
                      : <Navigate to="/dashboard" />
                  } />
                </Routes>
              </main>
            </div>
          ) : <Navigate to="/login" />
        } />

        {/* Fallbacks */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
