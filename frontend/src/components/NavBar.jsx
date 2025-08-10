import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { useEffect, useState } from 'react';
import headerLogo from '../../public/images/header-logo.webp';

export default function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItemClass = ({ isActive }) =>
    isActive
      ? 'text-gray-500 font-medium'
      : 'text-white opacity-80 hover:opacity-100 transition';

  return (
    <div className={`fixed top-0 left-0 right-0 z-40 transition bg-base-100/70 backdrop-blur ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="navbar max-w-7xl mx-auto px-4">
        <div className="flex-1">
          <Link to="/" className="text-2xl font-bold heading-font tracking-wide">
            <img
              src={headerLogo}
              alt="JavaNest"
              className="h-10 w-auto object-contain"
              loading="lazy"
            />
          </Link>
        </div>

        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal gap-4 px-1">
            <li><NavLink to="/" className={navItemClass} end>Home</NavLink></li>
            <li><NavLink to="/about" className={navItemClass}>About</NavLink></li>
            <li><NavLink to="/services" className={navItemClass}>Services</NavLink></li>
            <li><NavLink to="/contact" className={navItemClass}>Contact</NavLink></li>
            {user?.role === 'admin' && <li><NavLink to="/admin/products" className={navItemClass}>Admin</NavLink></li>}
            <li>
              <Link to="/book-table" className="btn btn-sm btn-outline text-white hover:text-black transition-colors">
                Book Table
              </Link>
            </li>
            <li>
              <a href={location.pathname === '/' ? '#shop' : '/#shop'} className="btn btn-sm btn-primary">
                Shop
              </a>
            </li>
          </ul>
        </div>

        <div className="flex-none gap-2">
            {!user && (
              <Link to="/login" className="btn btn-secondary btn-sm hidden md:inline-flex">
                Login
              </Link>
            )}
            {user && (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-accent btn-sm">
                  {user.email?.split('@')[0]}
                </label>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-44">
                  <li className="menu-title">
                    <span className="text-xs uppercase tracking-wide">{user.role}</span>
                  </li>
                  <li><button onClick={logout}>Logout</button></li>
                </ul>
              </div>
            )}

          {/* Mobile nav */}
          <div className="dropdown dropdown-end lg:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow bg-base-100 rounded-box w-56 space-y-1">
              <li><NavLink to="/" end>Home</NavLink></li>
              <li><NavLink to="/about">About</NavLink></li>
              <li><NavLink to="/services">Services</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>
              {user?.role === 'admin' && <li><NavLink to="/admin/products">Admin</NavLink></li>}
              <li><Link to="/book-table">Book Table</Link></li>
              <li><a href={location.pathname === '/' ? '#shop' : '/#shop'}>Shop</a></li>
              {!user && <li><NavLink to="/login">Login</NavLink></li>}
              {user && <li><button onClick={logout}>Logout</button></li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}