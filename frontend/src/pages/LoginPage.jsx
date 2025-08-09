import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../store/auth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [mode,setMode] = useState('login');
  const [form,setForm] = useState({ name:'', email:'', password:'' });
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(false);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function submit() {
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await api.post('/auth/register', {
          name: form.name,
          email: form.email,
          password: form.password
        });
      }
      const res = await api.post('/auth/login', {
        email: form.email,
        password: form.password
      });
      setAuth(res.data.user, res.data.token);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-10">
      <div className="card max-w-sm mx-auto bg-base-100 shadow">
        <div className="card-body">
          <h1 className="card-title capitalize">{mode}</h1>
          {error && <div className="alert alert-error py-2 text-sm">
            <span>{error}</span>
          </div>}
          {mode === 'register' && (
            <input
              className="input input-bordered w-full"
              placeholder="Name"
              value={form.name}
              onChange={e=>update('name', e.target.value)}
            />
          )}
          <input
            className="input input-bordered w-full"
            placeholder="Email"
            value={form.email}
            onChange={e=>update('email', e.target.value)}
            type="email"
          />
          <input
            className="input input-bordered w-full"
            placeholder="Password"
            value={form.password}
            onChange={e=>update('password', e.target.value)}
            type="password"
          />
          <div className="card-actions mt-2">
            <button
              disabled={loading}
              onClick={submit}
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            >
              {loading ? 'Please wait' : (mode === 'login' ? 'Login' : 'Register')}
            </button>
          </div>
          <button
            onClick={()=>setMode(mode === 'login' ? 'register' : 'login')}
            className="btn btn-ghost btn-sm mt-2"
          >
            {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}