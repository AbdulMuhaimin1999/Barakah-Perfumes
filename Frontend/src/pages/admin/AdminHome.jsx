import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

const quickLinks = [
  { to: '/admin/products', label: 'Manage products', desc: 'Add, view, and remove fragrances' },
  { to: '/admin/orders', label: 'Manage orders & delivery', desc: 'Update status: Pending → Shipped → Delivered' },
  { to: '/admin/categories', label: 'Categories', desc: 'Organize Men, Women, Luxury, Arabic' },
];

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    api.get('/api/orders/stats').then((res) => setStats(res.data.stats));
    api.get('/api/orders').then((res) => {
      const active = (res.data.orders || []).filter((o) => o.status !== 'Delivered');
      setRecentOrders(active.slice(0, 5));
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-parchment">Welcome to the admin dashboard</h2>
        <p className="mt-2 text-parchment/70">
          Manage products, track orders, and mark deliveries from one place.
        </p>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total orders', value: stats.totalOrders },
            { label: 'Products', value: stats.totalProducts },
            { label: 'Customers', value: stats.totalUsers },
            { label: 'Revenue', value: `$${Number(stats.totalRevenue).toFixed(2)}` },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-gold/20 bg-navy-900/50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-gold/80">{card.label}</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-parchment">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-2xl border border-gold/20 bg-navy-900/40 p-5 transition hover:border-gold/40 hover:bg-navy-900/60"
          >
            <p className="font-medium text-gold">{link.label}</p>
            <p className="mt-2 text-sm text-parchment/70">{link.desc}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-gold/20 bg-navy-900/40 p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-[family-name:var(--font-display)] text-xl text-parchment">Active orders</h3>
          <Link to="/admin/orders" className="text-sm text-gold hover:underline">Manage orders</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-parchment/60">No active orders. Delivered orders are in the Completed tab on Manage orders.</p>
        ) : (
          <div className="divide-y divide-gold/15">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-parchment">#{order.id} — {order.full_name}</p>
                  <p className="text-sm text-parchment/60">{order.phone}</p>
                </div>
                <div className="text-right">
                  <span className="rounded-full border border-gold/30 px-3 py-1 text-xs uppercase tracking-wider text-gold">
                    {order.status}
                  </span>
                  <p className="mt-1 text-sm text-gold">${Number(order.total_amount).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
