const BASE = 'https://task-manager-production-afd7.up.railway.app/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const api = {
  signup: (data) =>
    fetch(`${BASE}/auth/signup`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),

  login: (data) =>
    fetch(`${BASE}/auth/login`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),

  getDashboard: () =>
    fetch(`${BASE}/dashboard`, { headers: getHeaders() }).then(r => r.json()),

  getProjects: () =>
    fetch(`${BASE}/projects`, { headers: getHeaders() }).then(r => r.json()),

  createProject: (data) =>
    fetch(`${BASE}/projects`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),

  deleteProject: (id) =>
    fetch(`${BASE}/projects/${id}`, { method: 'DELETE', headers: getHeaders() }).then(r => r.json()),

  addMember: (projectId, email) =>
    fetch(`${BASE}/projects/${projectId}/members`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ email }) }).then(r => r.json()),

  getMembers: (projectId) =>
    fetch(`${BASE}/projects/${projectId}/members`, { headers: getHeaders() }).then(r => r.json()),

  getTasks: (projectId) =>
    fetch(`${BASE}/tasks/project/${projectId}`, { headers: getHeaders() }).then(r => r.json()),

  createTask: (data) =>
    fetch(`${BASE}/tasks`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),

  updateStatus: (id, status) =>
    fetch(`${BASE}/tasks/${id}/status`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ status }) }).then(r => r.json()),

  deleteTask: (id) =>
    fetch(`${BASE}/tasks/${id}`, { method: 'DELETE', headers: getHeaders() }).then(r => r.json()),
};