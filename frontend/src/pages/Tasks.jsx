import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Tasks({ user, project, goBack }) {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', assignee_id: '', due_date: '', priority: 'medium'
  });

  const load = () => {
    api.getTasks(project.id).then(setTasks);
    api.getMembers(project.id).then(setMembers);
  };

  useEffect(() => { load(); }, [project.id]);

  const createTask = async () => {
    if (!form.title) return;
    const res = await api.createTask({ ...form, project_id: project.id });
    if (res.error) return alert(res.error);
    setForm({ title: '', description: '', assignee_id: '', due_date: '', priority: 'medium' });
    load();
  };

  const changeStatus = async (id, status) => {
    await api.updateStatus(id, status);
    load();
  };

  const deleteTask = async (id) => {
    if (!confirm('Delete task?')) return;
    await api.deleteTask(id);
    load();
  };

  const columns = ['todo', 'in_progress', 'done'];
  const labels = { todo: '📌 To Do', in_progress: '🔄 In Progress', done: '✅ Done' };

  return (
    <div className="container">
      <button className="btn btn-primary" onClick={goBack} style={{ marginBottom: 15 }}>
        ← Back to Projects
      </button>
      <h2>📋 {project.name} — Tasks</h2>

      {user.role === 'admin' && (
        <div className="card">
          <h3>➕ Create Task</h3>
          <input placeholder="Task Title" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Description (optional)" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="row">
            <select style={{ flex: 1, marginBottom: 0 }} value={form.assignee_id}
              onChange={e => setForm({ ...form, assignee_id: e.target.value })}>
              <option value="">Assign to...</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <select style={{ flex: 1, marginBottom: 0 }} value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input type="date" style={{ flex: 1, marginBottom: 0 }} value={form.due_date}
              onChange={e => setForm({ ...form, due_date: e.target.value })} />
          </div>
          <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={createTask}>
            Create Task
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15, marginTop: 10 }}>
        {columns.map(col => (
          <div key={col}>
            <h3 style={{ marginBottom: 10 }}>{labels[col]}</h3>
            {tasks.filter(t => t.status === col).length === 0 && (
              <p style={{ color: '#aaa', fontSize: 13 }}>No tasks</p>
            )}
            {tasks.filter(t => t.status === col).map(task => (
              <div className="card" key={task.id} style={{ padding: 15 }}>
                <strong>{task.title}</strong>
                {task.description && (
                  <p style={{ fontSize: 12, color: '#888', margin: '5px 0' }}>{task.description}</p>
                )}
                <div className="row" style={{ marginTop: 8, gap: 5 }}>
                  <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                  {task.assignee_name && (
                    <span style={{ fontSize: 12, color: '#666' }}>👤 {task.assignee_name}</span>
                  )}
                </div>
                {task.due_date && (
                  <p style={{ fontSize: 11, color: '#aaa', marginTop: 5 }}>
                    Due: {task.due_date?.slice(0, 10)}
                  </p>
                )}
                <select
                  style={{ marginTop: 8, marginBottom: 0, fontSize: 13 }}
                  value={task.status}
                  onChange={e => changeStatus(task.id, e.target.value)}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                {user.role === 'admin' && (
                  <button className="btn btn-danger"
                    style={{ width: '100%', marginTop: 8, padding: '5px' }}
                    onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}