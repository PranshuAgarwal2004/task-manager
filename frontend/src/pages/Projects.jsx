import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Projects({ user, onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [memberEmail, setMemberEmail] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => api.getProjects().then(setProjects);

  useEffect(() => { load(); }, []);

  const createProject = async () => {
    if (!form.name) return;
    const res = await api.createProject(form);
    if (res.error) return alert(res.error);
    setForm({ name: '', description: '' });
    load();
  };

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.deleteProject(id);
    load();
  };

  const addMember = async (projectId) => {
    if (!memberEmail) return;
    const res = await api.addMember(projectId, memberEmail);
    if (res.error) return alert(res.error);
    setMemberEmail('');
    setMsg('Member added!');
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="container">
      <h2>📁 Projects</h2>

      {user.role === 'admin' && (
        <div className="card">
          <h3>➕ Create Project</h3>
          <input placeholder="Project Name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Description (optional)" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
          <button className="btn btn-primary" onClick={createProject}>Create</button>
        </div>
      )}

      {projects.length === 0 && <p style={{ color: '#888' }}>No projects yet.</p>}

      {projects.map(p => (
        <div className="card" key={p.id}>
          <div className="row">
            <h3 style={{ flex: 1 }}>{p.name}</h3>
            <button className="btn btn-primary" onClick={() => onSelectProject(p)}>
              View Tasks
            </button>
            {user.role === 'admin' && (
              <button className="btn btn-danger" onClick={() => deleteProject(p.id)}>
                Delete
              </button>
            )}
          </div>
          <p style={{ color: '#888', fontSize: 13, margin: '5px 0' }}>{p.description}</p>
          <p style={{ fontSize: 12, color: '#aaa' }}>
            {p.task_count} tasks • {p.member_count} members • Created by {p.creator_name}
          </p>

          {user.role === 'admin' && (
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <input
                placeholder="Add member by email"
                value={selectedProjectId === p.id ? memberEmail : ''}
                onFocus={() => setSelectedProjectId(p.id)}
                onChange={e => setMemberEmail(e.target.value)}
                style={{ marginBottom: 0, flex: 1 }}
              />
              <button className="btn btn-success" onClick={() => addMember(p.id)}>Add</button>
            </div>
          )}
          {msg && selectedProjectId === p.id && (
            <p style={{ color: '#66bb6a', fontSize: 13, marginTop: 5 }}>{msg}</p>
          )}
        </div>
      ))}
    </div>
  );
}