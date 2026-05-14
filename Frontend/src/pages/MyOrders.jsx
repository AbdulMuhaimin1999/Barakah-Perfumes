import { useEffect, useState } from 'react';
import api from '../api/client';
import PageHeader from '../components/PageHeader';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/orders/my')
      .then((res) => setOrders(res.data.orders || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-container py-6 sm:py-8">
        <PageHeader eyebrow="Account" title="Order history" />
        <p className="text-sm text-parchment/60">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="page-container py-6 sm:py-8">
      <PageHeader
        eyebrow="Account"
        title="Order history"
        subtitle={orders.length ? 'Track status and delivery updates for your purchases.' : 'Your completed orders will appear here.'}
      />
      {orders.length === 0 ? (
        <div className="empty-state">
          <p className="text-sm text-parchment/65">You have not placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="panel-dark rounded-lg p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-parchment/50">Order #{order.id}</p>
                  <p className="mt-1 text-base font-medium text-gold">${Number(order.total_amount).toFixed(2)}</p>
                </div>
                <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : ''}`}>{order.status}</span>
              </div>
              {order.status === 'Delivered' && (
                <p className="mt-3 text-xs text-emerald-300">Delivered successfully</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
