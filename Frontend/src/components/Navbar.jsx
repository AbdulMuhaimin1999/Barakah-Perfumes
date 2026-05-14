import { Link, NavLink, useLocation } from 'react-router-dom';
import { HiMenu, HiOutlineShoppingBag, HiX } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { BRAND_IMAGE } from '../utils/imageUrl';

const linkClass = ({ isActive }) =>
  `touch-target relative inline-flex items-center text-sm uppercase tracking-[0.14em] transition hover:text-gold-light ${isActive ? 'nav-link-active text-gold-light' : 'text-parchment/85'}`;

const mobileLinkClass = ({ isActive }) =>
  `touch-target flex w-full items-center rounded-xl px-3 py-2.5 text-sm uppercase tracking-[0.14em] transition ${isActive ? 'bg-gold/15 text-gold-light' : 'text-parchment/85 hover:bg-gold/10'}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count } = useCart();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/35 bg-navy-950/95 pt-[env(safe-area-inset-top,0px)] shadow-md shadow-black/40 backdrop-blur-md">
      <div className="page-container flex items-center justify-between gap-3 py-2.5 sm:py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <img
            src={BRAND_IMAGE}
            alt="Barakah Scents"
            className="seal-ring h-9 w-9 shrink-0 rounded-full border-2 border-gold object-cover sm:h-10 sm:w-10"
          />
          <div className="min-w-0">
            <span className="block truncate font-[family-name:var(--font-display)] text-sm tracking-[0.12em] text-gold sm:text-base md:text-lg">
              Barakah Scents
            </span>
            <span className="hidden text-[9px] uppercase tracking-[0.24em] text-gold-light/80 sm:block">
              Signature of Soul
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 lg:gap-6 md:flex">
          <NavLink to="/products" className={linkClass}>Shop All</NavLink>
          {user && <NavLink to="/my-orders" className={linkClass}>My Orders</NavLink>}
          {user ? (
            <button type="button" onClick={logout} className="touch-target text-sm uppercase tracking-[0.14em] text-parchment/80 hover:text-gold-light">
              Log out
            </button>
          ) : (
            <NavLink to="/login" className={linkClass}>Log in</NavLink>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            to="/cart"
            className="touch-target relative inline-flex items-center justify-center rounded-full border border-gold/50 text-gold-light hover:bg-gold/10"
            aria-label="Shopping bag"
          >
            <HiOutlineShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-navy-950">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="touch-target inline-flex items-center justify-center rounded-full border border-gold/50 text-gold-light md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-gold/20 md:hidden">
          <div className="page-container flex flex-col gap-1 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
            <NavLink to="/products" className={mobileLinkClass} onClick={() => setOpen(false)}>Shop All</NavLink>
            {user && <NavLink to="/my-orders" className={mobileLinkClass} onClick={() => setOpen(false)}>My Orders</NavLink>}
            {user ? (
              <button
                type="button"
                onClick={() => { logout(); setOpen(false); }}
                className="touch-target rounded-xl px-3 py-2.5 text-left text-sm text-parchment/80 hover:bg-gold/10"
              >
                Log out
              </button>
            ) : (
              <NavLink to="/login" className={mobileLinkClass} onClick={() => setOpen(false)}>Log in</NavLink>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
