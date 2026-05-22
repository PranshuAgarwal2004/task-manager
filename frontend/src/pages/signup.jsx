import { useState } from 'react';
import { api } from '../api';

export default function Signup({ onLogin, goLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    const res = await api.signup(form);
    if (res.error) return setError(res.error);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    onLogin(res.user);
  };

  return (
    <div className="form-box">
      <h2>📝 Create Account</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Full Name" value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })} />
      <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSubmit}>
        Sign Up
      </button>
      <p style={{ marginTop: 15, textAlign: 'center', fontSize: 14 }}>
        Already have an account?{' '}
        <span style={{ color: '#4fc3f7', cursor: 'pointer' }} onClick={goLogin}>
          Login
        </span>
      </p>
    </div>
  );
}