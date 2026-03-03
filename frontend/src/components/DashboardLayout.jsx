import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleLabels = {
  admin: 'Administrator',
  manager: 'Manager',
  worker: 'Worker',
};

const TAB_CONFIG = [
  { label: 'Dashboard', path: '/dashboard', roles: ['admin', 'manager', 'worker'] },
  { label: 'Tickets', path: '/tickets', roles: ['admin', 'manager', 'worker'] },
  { label: 'Users', path: '/admin/users', roles: ['admin'] },
  { label: 'Departments', path: '/admin/departments', roles: ['admin'] },
  { label: 'Categories', path: '/admin/categories', roles: ['admin'] },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const visibleTabs = TAB_CONFIG.filter((tab) => tab.roles.includes(user.role));

  const isTabActive = (tab) =>
    location.pathname === tab.path || location.pathname.startsWith(tab.path + '/');

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-brand">
          <img src="/odo-logo.png" alt="odo" className="header-logo" />
        </div>
        <div className="header-right">
          <span className="user-info">
            {user.firstName} {user.lastName}
            <span className={`role-badge role-${user.role}`}>
              {roleLabels[user.role] || user.role}
            </span>
          </span>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>
      <nav className="tab-bar">
        {visibleTabs.map((tab) => (
          <button
            key={tab.path}
            className={`tab-item${isTabActive(tab) ? ' active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
