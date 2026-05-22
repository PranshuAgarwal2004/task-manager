import { useState } from 'react';
import { api } from '../api';

export default function Login({ onLogin, goSignup }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    const res = await api.login(form);
    if (res.error) return setError(res.error);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    onLogin(res.user);
  };

  return (
    <div className="form-box">
      <h2>🔐 Login</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Email" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })} />
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSubmit}>
        Login
      </button>
      <p style={{ marginTop: 15, textAlign: 'center', fontSize: 14 }}>
        No account?{' '}
        <span style={{ color: '#4fc3f7', cursor: 'pointer' }} onClick={goSignup}>
          Sign up
        </span>
      </p>
    </div>
  );
}