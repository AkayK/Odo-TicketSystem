import { useAuth } from '../context/AuthContext';

const roleLabels = {
  admin: 'Administrator',
  manager: 'Manager',
  worker: 'Worker',
};

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Ticket System</h1>
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

      <main className="dashboard-main">
        <h2>Dashboard</h2>
        <div className="dashboard-cards">
          <div className="card">
            <h3>Welcome</h3>
            <p>
              {user.firstName} {user.lastName}
            </p>
            <p className="card-detail">Role: {roleLabels[user.role]}</p>
            {user.department && (
              <p className="card-detail">Department: {user.department}</p>
            )}
          </div>

          {user.role === 'admin' && (
            <>
              <div className="card">
                <h3>User Management</h3>
                <p className="card-detail">Create and manage system users</p>
                <p className="card-placeholder">Coming soon...</p>
              </div>
              <div className="card">
                <h3>Category Management</h3>
                <p className="card-detail">Manage ticket categories</p>
                <p className="card-placeholder">Coming soon...</p>
              </div>
            </>
          )}

          {user.role === 'manager' && (
            <div className="card">
              <h3>My Department Tickets</h3>
              <p className="card-detail">
                View and manage tickets for {user.department || 'your department'}
              </p>
              <p className="card-placeholder">Coming soon...</p>
            </div>
          )}

          <div className="card">
            <h3>Tickets</h3>
            <p className="card-detail">View and create tickets</p>
            <p className="card-placeholder">Coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
