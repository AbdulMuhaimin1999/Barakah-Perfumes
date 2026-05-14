import { Link } from 'react-router-dom';
import { BRAND_IMAGE } from '../utils/imageUrl';

export default function Footer() {
  return (
    <footer className="panel-navy mt-auto border-t border-gold/35 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="page-container grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <img
            src={BRAND_IMAGE}
            alt="Barakah Scents"
            className="seal-ring mb-3 h-12 w-12 rounded-full border-2 border-gold object-cover"
          />
          <p className="font-[family-name:var(--font-display)] text-base tracking-[0.12em] text-gold">Barakah Scents</p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-gold-light/80">Signature of Soul</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-parchment/70">
            A curated house of luxury fragrances — authentic products, refined presentation, and trusted service.
          </p>
        </div>
        <div>
          <p className="section-eyebrow">Shop</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-parchment/75">
            <Link to="/products" className="transition hover:text-gold-light">All fragrances</Link>
            <Link to="/products?category=men" className="transition hover:text-gold-light">Men</Link>
            <Link to="/products?category=women" className="transition hover:text-gold-light">Women</Link>
            <Link to="/cart" className="transition hover:text-gold-light">Shopping bag</Link>
          </div>
        </div>
        <div>
          <p className="section-eyebrow">Customer care</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-parchment/75">
            <Link to="/my-orders" className="transition hover:text-gold-light">Track orders</Link>
            <Link to="/login" className="transition hover:text-gold-light">Sign in</Link>
            <Link to="/register" className="transition hover:text-gold-light">Create account</Link>
          </div>
        </div>
        <div>
          <p className="section-eyebrow">Company</p>
          <p className="mt-4 text-sm leading-relaxed text-parchment/70">
            Premium e-commerce experience for discerning fragrance lovers.
          </p>
          <Link to="/admin/login" className="mt-3 inline-block text-xs text-gold-light/70 transition hover:text-gold-light">
            Staff portal
          </Link>
        </div>
      </div>
      <div className="border-t border-gold/10">
        <div className="page-container flex flex-col items-center justify-between gap-2 py-4 text-center text-xs text-parchment/50 sm:flex-row sm:text-left">
          <p>&copy; {new Date().getFullYear()} Barakah Scents. All rights reserved.</p>
          <p>Authentic perfumes · Secure checkout · Cash on delivery</p>
        </div>
      </div>
    </footer>
  );
}
