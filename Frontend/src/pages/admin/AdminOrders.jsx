import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

const statuses = ['Pending', 'Shipped', 'Delivered'];

const statusStyle = {
  Pending: 'border-amber-400/40 bg-amber-950/40 text-amber-100',
  Shipped: 'border-gold/40 bg-gold/10 text-gold-light',
  Delivered: 'border-emerald-500/35 bg-emerald-950/50 text-emerald-100',
};

function formatDate(value) {
  if (!value) return null;
  return new Date(value).toLocaleString();
}

function OrderCard({ order, onStatusChange, readOnly = false }) {
  return (
    <article className="panel-dark rounded-lg p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gold/15 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold">Order #{order.id}</p>
          <p className="mt-1 text-base text-parchment sm:text-lg">{order.full_name}</p>
          <p className="text-sm text-parchment/70">{order.user_email || order.user_name}</p>
          <p className="mt-1 text-sm text-parchment/70">{order.phone}</p>
        </div>
        <div className="text-right">
          <span className={`inline-block rounded-full border px-3 py-1 text-xs uppercase tracking-wider ${statusStyle[order.status] || statusStyle.Pending}`}>
            {order.status}
          </span>
          <p className="mt-2 text-lg text-gold sm:text-xl">${Number(order.total_amount).toFixed(2)}</p>
          <p className="mt-1 text-xs text-parchment/50">Placed {formatDate(order.created_at)}</p>
          {order.delivered_at && (
            <p className="mt-1 text-xs text-emerald-300">Delivered {formatDate(order.delivered_at)}</p>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-gold/80">Delivery address</p>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-parchment/80">{order.address}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.16em] text-gold/80">Payment</p>
          <p className="mt-1 text-sm text-parchment/80">
            {(order.payment_method || 'cod').toUpperCase()} · {order.payment_status || 'pending'}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-gold/80">Items</p>
          <ul className="mt-2 space-y-2">
            {(order.items || []).map((item) => (
              <li key={item.id} className="flex justify-between text-sm text-parchment/80">
                <span>{item.product_name} × {item.quantity}</span>
                <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {!readOnly && (
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-gold/15 pt-4">
          <label className="text-sm text-parchment/70" htmlFor={`status-${order.id}`}>Update delivery status</label>
          <select
            id={`status-${order.id}`}
            value={order.status}
            onChange={(e) => onStatusChange(order.id, e.target.value)}
            className="input-luxury rounded-lg px-3 py-2"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      )}
    </article>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('active');

  const load = () => {
    setLoading(true);
    setError('');
    api
      .get('/api/orders')
      .then((res) => setOrders(res.data.orders || []))
      .catch((err) => {
        setOrders([]);
        setError(err.response?.data?.message || 'Could not load orders. Check that you are signed in as admin.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const activeOrders = useMemo(
    () => orders.filter((o) => o.status !== 'Delivered'),
    [orders]
  );

  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === 'Delivered'),
    [orders]
  );

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/api/orders/${id}/status`, { status });
      if (status === 'Delivered') {
        toast.success('Order delivered — moved to completed orders');
        setView('completed');
      } else {
        toast.success(res.data.message || 'Order updated');
      }
      load();
    } catch {
      toast.error('Failed to update order');
    }
  };

  const visibleOrders = view === 'active' ? activeOrders : completedOrders;

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl text-parchment sm:text-3xl">Manage orders & delivery</h2>
      <p className="mt-2 text-sm text-parchment/70">
        Active orders stay here until delivered. Completed orders move to their own list.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setView('active')}
          className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${view === 'active' ? 'btn-gold text-navy-950' : 'border border-gold/35 bg-navy-900/80 text-parchment/80'}`}
        >
          Active ({activeOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setView('completed')}
          className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${view === 'completed' ? 'btn-gold text-navy-950' : 'border border-gold/35 bg-navy-900/80 text-parchment/80'}`}
        >
          Completed ({completedOrders.length})
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-gold">Loading orders...</p>
      ) : error ? (
        <div className="empty-state mt-8">
          <p className="text-sm text-red-300">{error}</p>
          <button type="button" onClick={load} className="btn-outline mt-4">Try again</button>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state mt-8 max-w-xl">
          <h3 className="section-title text-lg">No orders yet</h3>
          <p className="mt-2 text-sm text-parchment/65">
            Orders appear after a customer completes checkout.
          </p>
        </div>
      ) : visibleOrders.length === 0 ? (
        <div className="empty-state mt-8 max-w-xl">
          <h3 className="section-title text-lg">
            {view === 'active' ? 'No active orders' : 'No completed orders yet'}
          </h3>
          <p className="mt-2 text-sm text-parchment/65">
            {view === 'active'
              ? 'All current orders have been delivered. Check the Completed tab.'
              : 'Delivered orders will appear here after you mark them as Delivered.'}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {visibleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={updateStatus}
              readOnly={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
