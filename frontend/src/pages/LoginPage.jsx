import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../store/auth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [mode,setMode] = useState('login'); // or 'register'
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
    <div className="max-w-sm mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4 capitalize">{mode}</h1>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {mode === 'register' && (
        <input
          className="border w-full p-2 mb-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={e=>update('name', e.target.value)}
        />
      )}
      <input
        className="border w-full p-2 mb-2 rounded"
        placeholder="Email"
        value={form.email}
        onChange={e=>update('email', e.target.value)}
        type="email"
      />
      <input
        className="border w-full p-2 mb-4 rounded"
        placeholder="Password"
        value={form.password}
        onChange={e=>update('password', e.target.value)}
        type="password"
      />
      <button
        disabled={loading}
        onClick={submit}
        className="w-full bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white py-2 rounded"
      >
        {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Register')}
      </button>
      <button
        onClick={()=>setMode(mode === 'login' ? 'register' : 'login')}
        className="block w-full text-center text-sm mt-3 text-blue-600 underline"
      >
        {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  );
}