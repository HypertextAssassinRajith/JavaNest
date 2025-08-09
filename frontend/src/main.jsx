import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import NavBar from './components/NavBar';
import AppRoutes from './AppRoutes';
import { useAuth } from './store/auth';
import { api } from './api/client';

// (Optional) Try to fetch /auth/me on load to populate user if token exists
function Bootstrap() {
  const { token, setAuth } = useAuth();
  React.useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then(r => {
          // r.data.user has id + role
          // Extend minimal shape:
          setAuth({ id: r.data.user.id, role: r.data.user.role, email: '(session)' }, token);
        })
        .catch(()=>{ /* token invalid, ignore */ });
    }
  }, [token, setAuth]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <Bootstrap />
      <NavBar />
      <main className="p-4 max-w-6xl mx-auto">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);