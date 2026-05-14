import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';
import PageHeader from '../components/PageHeader';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({ full_name: '', phone: '', address: '', payment_method: 'cod' });
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="page-container py-10 sm:py-12">
        <div className="empty-state mx-auto max-w-md">
          <h1 className="section-title">Nothing to checkout</h1>
          <p className="mt-2 text-sm text-parchment/65">Your bag is empty. Add fragrances before placing an order.</p>
          <Link to="/products" className="btn-gold mt-5 inline-block rounded-full">Browse shop</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/orders', {
        ...form,
        items: items.map((item) => ({ product_id: item.product_id, quantity: item.quantity })),
      });
      clearCart();
      toast.success('Order placed successfully');
      navigate('/my-orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container max-w-5xl py-6 sm:py-8">
      <PageHeader
        eyebrow="Secure checkout"
        title="Complete your order"
        subtitle="Enter delivery details below. We will confirm your order by phone."
      />

      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <form onSubmit={handleSubmit} className="panel-dark rounded-lg p-5 sm:p-6">
          <h2 className="section-title text-lg">Delivery details</h2>
          <div className="mt-5 space-y-4">
            <label className="form-field">
              <span className="form-label">Full name</span>
              <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5" />
            </label>
            <label className="form-field">
              <span className="form-label">Phone number</span>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5" />
            </label>
            <label className="form-field">
              <span className="form-label">Delivery address</span>
              <textarea required rows={4} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5" />
            </label>
            <label className="form-field">
              <span className="form-label">Payment method</span>
              <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} className="input-luxury w-full rounded-lg px-4 py-2.5">
                <option value="cod">Cash on delivery</option>
              </select>
            </label>
          </div>
          <button type="submit" disabled={submitting} className="btn-gold mt-6 w-full rounded-full disabled:opacity-50">
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </form>

        <div className="panel-dark h-fit rounded-lg p-5 sm:p-6">
          <h2 className="section-title text-lg">Order summary</h2>
          <div className="mt-4 space-y-2.5">
            {items.map((item) => (
              <div key={item.product_id} className="flex justify-between gap-3 text-sm text-parchment/75">
                <span className="truncate">{item.name} × {item.quantity}</span>
                <span className="shrink-0 text-parchment">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t border-gold/15 pt-4">
            <span className="text-sm font-medium text-parchment">Total</span>
            <span className="text-lg font-medium text-gold">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
