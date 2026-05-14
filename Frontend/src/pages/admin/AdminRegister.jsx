import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { BRAND_IMAGE } from '../../utils/imageUrl';

export default function AdminRegister() {
  const { adminRegister, user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user && isAdmin) navigate('/admin', { replace: true });
  }, [authLoading, user, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await adminRegister(form.name, form.email, form.password);
      toast.success('Admin account created');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Admin registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="panel-dark w-full max-w-md rounded-xl p-6 sm:p-8">
        <img src={BRAND_IMAGE} alt="" className="mx-auto h-14 w-14 rounded-full border border-gold/30 object-cover" />
        <p className="section-eyebrow mt-4 text-center">Staff portal</p>
        <h1 className="page-title text-center">Create admin account</h1>
        <p className="mt-2 text-center text-sm text-parchment/65">
          Register to manage products, orders, and delivery.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="form-field">
            <span className="form-label">Full name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-luxury w-full rounded-lg px-4 py-2.5"
            />
          </label>
          <label className="form-field">
            <span className="form-label">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-luxury w-full rounded-lg px-4 py-2.5"
            />
          </label>
          <label className="form-field">
            <span className="form-label">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-luxury w-full rounded-lg px-4 py-2.5"
            />
          </label>
          <label className="form-field">
            <span className="form-label">Confirm password</span>
            <input
              type="password"
              required
              minLength={6}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="input-luxury w-full rounded-lg px-4 py-2.5"
            />
          </label>
          <button type="submit" disabled={loading} className="btn-gold w-full rounded-full disabled:opacity-50">
            {loading ? 'Creating account…' : 'Create admin account'}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-parchment/65">
          Already have an account?{' '}
          <Link to="/admin/login" className="text-gold hover:underline">Sign in</Link>
        </p>
        <Link to="/" className="mt-3 block text-center text-xs text-parchment/50 hover:text-gold-light">
          Back to store
        </Link>
      </div>
    </div>
  );
}
