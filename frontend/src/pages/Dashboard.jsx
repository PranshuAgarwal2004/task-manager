import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Dashboard({ user }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getDashboard().then(setData);
  }, []);

  if (!data) return <div className="container"><p>Loading...</p></div>;

  const { stats, recentTasks } = data;

  return (
    <div className="container">
      <h2>👋 Welcome, {user.name}</h2>
      <p style={{ color: '#888', marginBottom: 20 }}>
        Role: <strong>{user.role}</strong>
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="number">{stats.my_tasks}</div>
          <div className="label">My Tasks</div>
        </div>
        <div className="stat-card">
          <div className="number" style={{ color: '#66bb6a' }}>{stats.completed}</div>
          <div className="label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="number" style={{ color: '#ffa726' }}>{stats.in_progress}</div>
          <div className="label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="number" style={{ color: '#ef5350' }}>{stats.overdue}</div>
          <div className="label">Overdue</div>
        </div>
      </div>

      <h3>📋 Recent Tasks</h3>
      {recentTasks.length === 0 && (
        <p style={{ color: '#888' }}>No tasks assigned yet.</p>
      )}
      {recentTasks.map(task => (
        <div className="card" key={task.id}>
          <div className="row">
            <strong>{task.title}</strong>
            <span className={`badge badge-${task.status}`}>{task.status}</span>
            <span className={`badge badge-${task.priority}`}>{task.priority}</span>
          </div>
          <p style={{ fontSize: 13, color: '#888', marginTop: 5 }}>
            Project: {task.project_name}{' '}
            {task.due_date && `• Due: ${task.due_date?.slice(0, 10)}`}
          </p>
        </div>
      ))}
    </div>
  );
}