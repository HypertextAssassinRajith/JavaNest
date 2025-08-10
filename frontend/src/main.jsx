import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import NavBar from './components/NavBar';
import AppRoutes from './AppRoutes';
import { useAuth } from './store/auth';
import { api } from './api/client';

function Bootstrap() {
  const { token, setAuth } = useAuth();
  React.useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then(r => {
          setAuth({ id: r.data.user.id, role: r.data.user.role, email: r.data.user.email || 'session@local' }, token);
        })
        .catch(()=>{ });
    }
  }, [token, setAuth]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <Bootstrap />
      <NavBar />
      <main className="min-h-screen">
        <AppRoutes />
      </main>
      <footer className="bg-neutral text-neutral-content mt-10">
        <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-semibold mb-2">JavaNest</h3>
            <p className="text-sm opacity-70">
              Crafted with passion. Empower your mornings with the perfect brew.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Links</h4>
            <ul className="space-y-1 text-sm opacity-80">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Get Updates</h4>
            <form onSubmit={e=>e.preventDefault()} className="space-y-2">
              <input type="email" placeholder="Email" className="input input-sm input-bordered w-full" />
              <button className="btn btn-sm btn-primary w-full">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="text-center text-xs opacity-60 pb-6">
          © {new Date().getFullYear()} JavaNest. All rights reserved.
        </div>
      </footer>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);