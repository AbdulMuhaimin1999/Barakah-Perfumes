import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/categories', label: 'Categories' },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <div className="app-shell min-h-dvh">
      <header className="border-b border-gold/20 bg-navy-900/80 pt-[env(safe-area-inset-top,0px)]">
        <div className="page-container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Store admin</p>
            <h1 className="font-[family-name:var(--font-display)] text-xl tracking-[0.12em] text-gold sm:text-2xl">Barakah Scents</h1>
            {user && <p className="truncate text-sm text-parchment/60">Signed in as {user.name}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <Link to="/" className="touch-target text-sm text-parchment/70 hover:text-gold">Back to store</Link>
            <button type="button" onClick={logout} className="touch-target text-sm text-parchment/70 hover:text-gold">Log out</button>
          </div>
        </div>
        <nav className="page-container scroll-x-tabs pb-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`shrink-0 rounded-full px-4 py-2 text-sm ${location.pathname === link.to ? 'bg-gold text-navy-950' : 'border border-gold/25 text-parchment/80'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="page-container py-5 sm:py-6">
        <Outlet />
      </main>
    </div>
  );
}
