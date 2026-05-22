import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import './index.css';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [page, setPage] = useState('dashboard');
  const [authPage, setAuthPage] = useState('login');
  const [selectedProject, setSelectedProject] = useState(null);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('dashboard');
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setPage('tasks');
  };

  if (!user) {
    return authPage === 'login'
      ? <Login onLogin={setUser} goSignup={() => setAuthPage('signup')} />
      : <Signup onLogin={setUser} goLogin={() => setAuthPage('login')} />;
  }

  return (
    <>
      <nav>
        <span style={{ fontWeight: 700, fontSize: 18 }}>🗂️ TaskFlow</span>
        <div>
          <a href="#" onClick={() => setPage('dashboard')}>Dashboard</a>
          <a href="#" onClick={() => setPage('projects')}>Projects</a>
          <span style={{ marginLeft: 20, fontSize: 14, color: '#aaa' }}>
            {user.name} ({user.role})
          </span>
          <button className="btn btn-danger" style={{ marginLeft: 15 }} onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      {page === 'dashboard' && <Dashboard user={user} />}
      {page === 'projects' && (
        <Projects user={user} onSelectProject={handleSelectProject} />
      )}
      {page === 'tasks' && selectedProject && (
        <Tasks user={user} project={selectedProject} goBack={() => setPage('projects')} />
      )}
    </>
  );
}