import { Link } from 'react-router-dom';
import { useAuth } from '../store/auth';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-primary text-primary-content px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">JavaNest</Link>
      </div>
      <div className="flex-none gap-2">
        <ul className="menu menu-horizontal px-1 hidden md:flex">
          <li><Link to="/cart">Cart</Link></li>
          {user?.role === 'admin' && <li><Link to="/admin/products">Admin</Link></li>}
        </ul>

        <div className="dropdown dropdown-end md:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40 text-neutral">
            <li><Link to="/cart">Cart</Link></li>
            {user?.role === 'admin' && <li><Link to="/admin/products">Admin</Link></li>}
            {!user && <li><Link to="/login">Login</Link></li>}
            {user && <li><button onClick={logout}>Logout</button></li>}
          </ul>
        </div>

        {!user && (
          <Link to="/login" className="btn btn-secondary btn-sm hidden md:inline-flex">Login</Link>
        )}
        {user && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-accent btn-sm">
              {user.email?.split('@')[0]}
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40 text-neutral">
              <li className="menu-title">
                <span className="text-xs opacity-70">{user.role}</span>
              </li>
              <li><button onClick={logout}>Logout</button></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}