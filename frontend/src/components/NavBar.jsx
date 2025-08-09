import { Link } from 'react-router-dom';
import { useAuth } from '../store/auth';

export default function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav className="flex gap-4 items-center px-4 py-3 bg-amber-800 text-white">
      <Link to="/" className="font-bold tracking-wide">CoffeeShop</Link>
      <Link to="/cart">Cart</Link>
      {user?.role === 'admin' && <Link to="/admin/products">Admin</Link>}
      <div className="ml-auto flex gap-3 items-center">
        {!user && <Link to="/login">Login</Link>}
        {user && (
          <>
            <span className="text-sm">{user.email}</span>
            <button
              onClick={logout}
              className="bg-amber-600 hover:bg-amber-500 px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}